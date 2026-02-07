import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Get all content
app.get("/api/content", async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare(
    "SELECT content_key, content_type, content_value FROM site_content WHERE content_type != 'secret'"
  ).all();
  
  const content: Record<string, string> = {};
  for (const row of results as any[]) {
    content[row.content_key] = row.content_value;
  }
  
  return c.json({ content });
});

// Verify admin password
app.post("/api/admin/verify", async (c) => {
  const body = await c.req.json<{ password: string }>();
  const db = c.env.DB;
  
  const result = await db.prepare(
    "SELECT content_value FROM site_content WHERE content_key = 'admin_password'"
  ).first() as { content_value: string } | null;
  
  if (!result || result.content_value !== body.password) {
    return c.json({ valid: false }, 401);
  }
  
  return c.json({ valid: true });
});

// Update content (requires password)
app.post("/api/admin/update", async (c) => {
  const body = await c.req.json<{ password: string; content_key: string; content_value: string }>();
  const db = c.env.DB;
  
  // Verify password
  const authResult = await db.prepare(
    "SELECT content_value FROM site_content WHERE content_key = 'admin_password'"
  ).first() as { content_value: string } | null;
  
  if (!authResult || authResult.content_value !== body.password) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Update content
  await db.prepare(
    "UPDATE site_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?"
  ).bind(body.content_value, body.content_key).run();
  
  return c.json({ success: true });
});

// Upload image (requires password)
app.post("/api/admin/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const password = formData.get("password") as string;
    const file = formData.get("file") as File;
    const contentKey = formData.get("content_key") as string;

    if (!password || !file || !contentKey) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = c.env.DB;

    // Verify password
    const authResult = await db.prepare(
      "SELECT content_value FROM site_content WHERE content_key = 'admin_password'"
    ).first() as { content_value: string } | null;

    if (!authResult || authResult.content_value !== password) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Generate unique key for R2
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const r2Key = `uploads/${contentKey}-${timestamp}.${fileExt}`;

    // Upload to R2
    await c.env.R2_BUCKET.put(r2Key, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Generate URL
    const url = `/api/files/${r2Key}`;

    // Update database
    await db.prepare(
      "UPDATE site_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?"
    ).bind(url, contentKey).run();

    return c.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Serve uploaded files
app.get("/api/files/:key{.+}", async (c) => {
  const key = c.req.param("key");
  const object = await c.env.R2_BUCKET.get(key);

  if (!object) {
    return c.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return c.body(object.body, { headers });
});

export default app;
