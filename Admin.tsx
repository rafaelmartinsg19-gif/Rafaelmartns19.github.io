import { useState, useEffect } from "react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Card } from "@/react-app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Slider } from "@/react-app/components/ui/slider";
import { Shield, Save, LogOut, Eye, Image as ImageIcon, Video, Type, Layout } from "lucide-react";
import { useNavigate } from "react-router";

const FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Oswald",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Ubuntu",
  "Rubik",
  "Work Sans",
  "PT Sans",
  "Mulish",
  "Fira Sans",
  "Barlow",
  "Karla",
  "DM Sans",
  "Source Sans Pro",
  "Noto Sans",
  "Libre Baskerville",
  "Crimson Text"
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const navigate = useNavigate();

  const contentLabels: Record<string, string> = {
    hero_title: "Título Principal",
    hero_subtitle: "Subtítulo Principal",
    authority_title: "Título Autoridade",
    authority_description: "Descrição Autoridade",
    quote: "Citação Destaque",
    gallery_title: "Título Galeria",
    gallery_subtitle: "Subtítulo Galeria",
    final_cta_title: "Título CTA Final",
    final_cta_subtitle: "Subtítulo CTA Final"
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedPassword) {
      verifyPassword(savedPassword);
    }
  }, []);

  const verifyPassword = async (pwd: string) => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd })
      });

      if (response.ok) {
        setAuthenticated(true);
        setPassword(pwd);
        sessionStorage.setItem("admin_password", pwd);
        loadContent();
      } else {
        alert("Senha incorreta");
      }
    } catch (error) {
      alert("Erro ao verificar senha");
    }
  };

  const loadContent = async () => {
    try {
      const response = await fetch("/api/content");
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      alert("Erro ao carregar conteúdo");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword(password);
  };

  const handleUpdate = async (key: string, value: string) => {
    setSaving(key);
    try {
      const response = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          content_key: key,
          content_value: value
        })
      });

      if (response.ok) {
        setContent(prev => ({ ...prev, [key]: value }));
        setTimeout(() => setSaving(null), 1000);
      } else {
        alert("Erro ao salvar");
        setSaving(null);
      }
    } catch (error) {
      alert("Erro ao salvar conteúdo");
      setSaving(null);
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("file", file);
      formData.append("content_key", key);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setContent(prev => ({ ...prev, [key]: data.url }));
        setUploading(null);
      } else {
        alert("Erro ao fazer upload");
        setUploading(null);
      }
    } catch (error) {
      alert("Erro ao fazer upload");
      setUploading(null);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("admin_password");
    navigate("/");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070707] to-[#0B3D91] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <div className="flex flex-col items-center mb-8">
            <Shield className="h-16 w-16 text-[#2F6BFF] mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Painel Admin</h1>
            <p className="text-white/60 text-center">Tintim Car</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Senha de Acesso</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2F6BFF] hover:bg-[#2F6BFF]/90"
            >
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-[#2F6BFF]" />
            <div>
              <h1 className="text-xl font-bold">Painel Admin</h1>
              <p className="text-sm text-white/60">Tintim Car</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-white/20 hover:bg-white/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Site
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="content" className="data-[state=active]:bg-[#2F6BFF]">
              <Type className="h-4 w-4 mr-2" />
              Textos
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-[#2F6BFF]">
              <ImageIcon className="h-4 w-4 mr-2" />
              Imagens
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-[#2F6BFF]">
              <Video className="h-4 w-4 mr-2" />
              Vídeo
            </TabsTrigger>
            <TabsTrigger value="typography" className="data-[state=active]:bg-[#2F6BFF]">
              <Layout className="h-4 w-4 mr-2" />
              Tipografia
            </TabsTrigger>
          </TabsList>

          {/* Textos Tab */}
          <TabsContent value="content" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Editor de Textos</h2>
              <p className="text-white/60">Edite os textos do seu site</p>
            </div>

            <div className="grid gap-6">
              {Object.entries(contentLabels).map(([key, label]) => (
                <Card key={key} className="p-6 bg-white/5 border-white/10">
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-white/80 mb-2 block">
                      {label}
                    </label>
                    {key.includes("description") || key.includes("quote") ? (
                      <Textarea
                        value={content[key] || ""}
                        onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white min-h-[100px]"
                      />
                    ) : (
                      <Input
                        value={content[key] || ""}
                        onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    )}
                  </div>

                  <Button
                    onClick={() => handleUpdate(key, content[key])}
                    disabled={saving === key}
                    className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === key ? "Salvando..." : "Salvar"}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Imagens Tab */}
          <TabsContent value="images" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Gerenciar Imagens</h2>
              <p className="text-white/60">Faça upload de imagens de fundo, logo e galeria</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Hero Background */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-semibold mb-4">Imagem de Fundo Principal</h3>
                {content.hero_background_image && (
                  <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={content.hero_background_image} 
                      alt="Fundo atual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("hero_background_image", file);
                  }}
                  disabled={uploading === "hero_background_image"}
                  className="bg-white/10 border-white/20 text-white"
                />
                {uploading === "hero_background_image" && (
                  <p className="text-sm text-white/60 mt-2">Fazendo upload...</p>
                )}
              </Card>

              {/* Logo */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-semibold mb-4">Logo do Site</h3>
                {content.site_logo && (
                  <div className="mb-4 h-32 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <img 
                      src={content.site_logo} 
                      alt="Logo atual"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("site_logo", file);
                  }}
                  disabled={uploading === "site_logo"}
                  className="bg-white/10 border-white/20 text-white"
                />
                {uploading === "site_logo" && (
                  <p className="text-sm text-white/60 mt-2">Fazendo upload...</p>
                )}
              </Card>

              {/* Gallery Images */}
              {[1, 2, 3, 4].map((num) => {
                const key = `gallery_image_${num}`;
                return (
                  <Card key={key} className="p-6 bg-white/5 border-white/10">
                    <h3 className="font-semibold mb-4">Imagem da Galeria {num}</h3>
                    {content[key] && (
                      <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={content[key]} 
                          alt={`Galeria ${num}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(key, file);
                      }}
                      disabled={uploading === key}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    {uploading === key && (
                      <p className="text-sm text-white/60 mt-2">Fazendo upload...</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Vídeo Tab */}
          <TabsContent value="video" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Vídeo Promocional</h2>
              <p className="text-white/60">Adicione um vídeo do YouTube ou faça upload de uma thumbnail</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
              <Card className="p-6 bg-white/5 border-white/10">
                <label className="text-sm font-semibold text-white/80 mb-2 block">
                  URL do Vídeo (YouTube, Vimeo, etc.)
                </label>
                <Input
                  type="url"
                  value={content.promo_video_url || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, promo_video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-white/10 border-white/20 text-white mb-4"
                />
                <Button
                  onClick={() => handleUpdate("promo_video_url", content.promo_video_url || "")}
                  disabled={saving === "promo_video_url"}
                  className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === "promo_video_url" ? "Salvando..." : "Salvar URL"}
                </Button>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-semibold mb-4">Thumbnail do Vídeo</h3>
                {content.promo_video_thumbnail && (
                  <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={content.promo_video_thumbnail} 
                      alt="Thumbnail do vídeo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload("promo_video_thumbnail", file);
                  }}
                  disabled={uploading === "promo_video_thumbnail"}
                  className="bg-white/10 border-white/20 text-white"
                />
                {uploading === "promo_video_thumbnail" && (
                  <p className="text-sm text-white/60 mt-2">Fazendo upload...</p>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Tipografia Tab */}
          <TabsContent value="typography" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Configurar Tipografia</h2>
              <p className="text-white/60">Escolha fontes e tamanhos para os textos principais</p>
            </div>

            <div className="grid gap-6 max-w-3xl">
              {/* Hero Title Typography */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-semibold mb-6">Título Principal</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-white/80 mb-2 block">Fonte</label>
                    <Select
                      value={content.hero_title_font || "Inter"}
                      onValueChange={(value) => {
                        setContent(prev => ({ ...prev, hero_title_font: value }));
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-white/80 mb-2 block">
                      Tamanho: {content.hero_title_size || 48}px
                    </label>
                    <Slider
                      value={[parseInt(content.hero_title_size || "48")]}
                      onValueChange={([value]) => {
                        setContent(prev => ({ ...prev, hero_title_size: value.toString() }));
                      }}
                      min={24}
                      max={96}
                      step={2}
                      className="mb-4"
                    />
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="text-xs text-white/60 mb-2">Preview:</p>
                    <p 
                      style={{ 
                        fontFamily: content.hero_title_font || "Inter",
                        fontSize: `${content.hero_title_size || 48}px`
                      }}
                      className="font-bold leading-tight"
                    >
                      {content.hero_title || "Seu título aqui"}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      handleUpdate("hero_title_font", content.hero_title_font || "Inter");
                      handleUpdate("hero_title_size", content.hero_title_size || "48");
                    }}
                    disabled={saving === "hero_title_font"}
                    className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "hero_title_font" ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </Card>

              {/* Hero Subtitle Typography */}
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="font-semibold mb-6">Subtítulo Principal</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-white/80 mb-2 block">Fonte</label>
                    <Select
                      value={content.hero_subtitle_font || "Inter"}
                      onValueChange={(value) => {
                        setContent(prev => ({ ...prev, hero_subtitle_font: value }));
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-white/80 mb-2 block">
                      Tamanho: {content.hero_subtitle_size || 24}px
                    </label>
                    <Slider
                      value={[parseInt(content.hero_subtitle_size || "24")]}
                      onValueChange={([value]) => {
                        setContent(prev => ({ ...prev, hero_subtitle_size: value.toString() }));
                      }}
                      min={14}
                      max={48}
                      step={2}
                      className="mb-4"
                    />
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="text-xs text-white/60 mb-2">Preview:</p>
                    <p 
                      style={{ 
                        fontFamily: content.hero_subtitle_font || "Inter",
                        fontSize: `${content.hero_subtitle_size || 24}px`
                      }}
                      className="font-light"
                    >
                      {content.hero_subtitle || "Seu subtítulo aqui"}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      handleUpdate("hero_subtitle_font", content.hero_subtitle_font || "Inter");
                      handleUpdate("hero_subtitle_size", content.hero_subtitle_size || "24");
                    }}
                    disabled={saving === "hero_subtitle_font"}
                    className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "hero_subtitle_font" ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
