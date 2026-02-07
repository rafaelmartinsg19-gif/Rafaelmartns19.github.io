import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { 
  CheckCircle2, 
  MapPin, 
  MessageCircle, 
  Star,
  CreditCard,
  Smartphone,
  Shield
} from "lucide-react";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute;

      // Monday to Friday: 8:00 - 17:30, Saturday: 8:00 - 12:00, Sunday: Closed
      if (day === 0) {
        setIsOpen(false);
      } else if (day === 6) {
        setIsOpen(currentTime >= 480 && currentTime < 720);
      } else {
        setIsOpen(currentTime >= 480 && currentTime < 1050);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/content");
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error("Erro ao carregar conteúdo");
      }
    };
    loadContent();
  }, []);

  // Load custom fonts dynamically
  useEffect(() => {
    if (!content.hero_title_font && !content.hero_subtitle_font) return;

    const fonts = new Set<string>();
    if (content.hero_title_font && content.hero_title_font !== 'Inter') {
      fonts.add(content.hero_title_font);
    }
    if (content.hero_subtitle_font && content.hero_subtitle_font !== 'Inter') {
      fonts.add(content.hero_subtitle_font);
    }

    if (fonts.size === 0) return;

    const fontFamilies = Array.from(fonts).map(f => f.replace(/ /g, '+')).join('&family=');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    link.rel = 'stylesheet';
    
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [content.hero_title_font, content.hero_subtitle_font]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Vim pelo site da Tintim Car e gostaria de fazer um orçamento para o meu veículo.");
    window.open(`https://wa.me/5533999516878?text=${message}`, '_blank');
  };

  const handleDirections = () => {
    window.open('https://www.google.com/maps/dir/?api=1&destination=R.+Delfino+Ferreira+Martins,+Santa+Bárbara+do+Leste+-+MG,+35328-000', '_blank');
  };

  const heroBackgroundImage = content.hero_background_image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop";
  const galleryImages = [
    content.gallery_image_1 || "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=2070&auto=format&fit=crop",
    content.gallery_image_2 || "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2064&auto=format&fit=crop",
    content.gallery_image_3 || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2068&auto=format&fit=crop",
    content.gallery_image_4 || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop"
  ];

  const heroTitleStyle: React.CSSProperties = {
    fontFamily: content.hero_title_font || 'Inter',
    fontSize: content.hero_title_size ? `${content.hero_title_size}px` : undefined
  };

  const heroSubtitleStyle: React.CSSProperties = {
    fontFamily: content.hero_subtitle_font || 'Inter',
    fontSize: content.hero_subtitle_size ? `${content.hero_subtitle_size}px` : undefined
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6"
        aria-label="Apresentação principal"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackgroundImage}
            alt="Camaro azul profissional após pintura e polimento"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/75" aria-hidden="true"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          {/* Logo */}
          <header className="mb-8 sm:mb-12">
            {content.site_logo ? (
              <div className="flex justify-center mb-4">
                <img 
                  src={content.site_logo} 
                  alt="Tintim Car Logo"
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                  loading="eager"
                />
              </div>
            ) : (
              <h1 className="mb-3 sm:mb-4 text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
                TINTIM CAR
              </h1>
            )}
            <p className="text-base sm:text-lg md:text-xl text-white/90 tracking-widest font-light">
              Funilaria • Pintura • Embelezamento Automotivo
            </p>
          </header>

          {/* Headline */}
          <h2 
            className="mb-4 sm:mb-6 leading-tight text-balance px-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
            style={heroTitleStyle}
          >
            {content.hero_title || "Funilaria e pintura com padrão de acabamento que valoriza seu veículo."}
          </h2>

          {/* Subheadline */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-10 font-light px-4"
            style={heroSubtitleStyle}
          >
            {content.hero_subtitle || "Nada de improviso. Nada de surpresas. Só resultado impecável."}
          </p>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10 px-4">
            <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} aria-hidden="true"></div>
            <span className="text-sm font-medium" role="status" aria-live="polite">
              {isOpen ? 'Aberto agora — fecha às 17:30' : 'Fechado — abre às 08:00'}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-2xl mx-auto">
            <Button 
              onClick={handleWhatsApp}
              className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90 text-white px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl w-full sm:w-auto"
              aria-label="Fazer orçamento pelo WhatsApp"
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              FAZER ORÇAMENTO NO WHATSAPP
            </Button>
            <Button 
              onClick={handleDirections}
              variant="outline"
              className="border-2 border-white/30 hover:bg-white/10 text-white px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              aria-label="Ver rotas no Google Maps"
            >
              <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
              VER ROTAS
            </Button>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section 
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#070707] to-[#0a0a0a]"
        aria-labelledby="authority-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="authority-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-center px-2">
            {content.authority_title || "Referência em funilaria e pintura automotiva em Santa Bárbara do Leste e região."}
          </h2>
          
          <p className="text-lg sm:text-xl text-white/70 mb-8 sm:mb-12 text-center max-w-3xl mx-auto leading-relaxed px-4">
            {content.authority_description || "Especialistas em funilaria, pintura e embelezamento automotivo, utilizando processos modernos, materiais premium e um padrão rigoroso de acabamento."}
          </p>

          <p className="text-base sm:text-lg text-white/80 mb-12 sm:mb-16 text-center max-w-3xl mx-auto font-semibold px-4">
            Operamos com agenda organizada para garantir prazo, qualidade e atenção máxima a cada veículo.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
            {[
              { icon: CheckCircle2, text: "Alto padrão de acabamento" },
              { icon: CheckCircle2, text: "Transparência total" },
              { icon: CheckCircle2, text: "Técnicas modernas" },
              { icon: CheckCircle2, text: "Compromisso com prazos" }
            ].map((feature, index) => (
              <article key={index} className="flex flex-col items-center text-center space-y-3 p-4">
                <feature.icon className="h-8 w-8 text-[#2F6BFF]" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-base sm:text-lg font-medium">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section 
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#070707]"
        aria-labelledby="gallery-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="gallery-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">
            {content.gallery_title || "Resultados que falam por si."}
          </h2>
          <p className="text-lg sm:text-xl text-white/60 mb-12 sm:mb-16 text-center px-4">
            {content.gallery_subtitle || "Veja a transformação dos nossos trabalhos"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
              >
                <img 
                  src={image} 
                  alt={`Trabalho de funilaria e pintura ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section (if video URL is provided) */}
      {content.promo_video_url && (
        <section 
          className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#070707] to-[#0a0a0a]"
          aria-label="Vídeo promocional"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-2xl">
              {content.promo_video_thumbnail ? (
                <a 
                  href={content.promo_video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img 
                    src={content.promo_video_thumbnail} 
                    alt="Thumbnail do vídeo promocional"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-20 h-20 bg-[#2F6BFF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </a>
              ) : (
                <iframe 
                  src={content.promo_video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Vídeo promocional Tintim Car"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Experience Banner */}
      <section 
        className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0B3D91]"
        aria-label="Compromisso com qualidade"
      >
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed px-4">
            "{content.quote || "Ambiente profissional, atendimento humano e cuidado extremo com cada detalhe. Seu carro não precisa apenas de reparo — ele merece valorização."}"
          </blockquote>
        </div>
      </section>

      {/* Reviews Section */}
      <section 
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#070707] to-[#0a0a0a]"
        aria-labelledby="reviews-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center items-center gap-1 sm:gap-2 mb-4" role="img" aria-label="5 estrelas de 5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 sm:h-8 w-6 sm:w-8 fill-[#2F6BFF] text-[#2F6BFF]" aria-hidden="true" />
              ))}
            </div>
            <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-bold mb-2">5.0 de satisfação</h2>
            <p className="text-white/60">Baseado em avaliações de clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Carlos Silva", text: "Acabamento perfeito. Superou minhas expectativas.", rating: 5 },
              { name: "Maria Santos", text: "Profissionalismo do início ao fim. Recomendo!", rating: 5 },
              { name: "João Oliveira", text: "Organização impecável. Entregaram no prazo prometido.", rating: 5 }
            ].map((review, index) => (
              <Card 
                key={index} 
                className="bg-white/5 border-white/10 p-4 sm:p-6"
                itemScope
                itemType="https://schema.org/Review"
              >
                <div className="flex gap-1 mb-3" role="img" aria-label={`${review.rating} estrelas de 5`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#2F6BFF] text-[#2F6BFF]" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-white/80 mb-4" itemProp="reviewBody">{review.text}</p>
                <p className="font-semibold" itemProp="author">{review.name}</p>
                <meta itemProp="ratingValue" content={review.rating.toString()} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Location */}
      <section 
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#070707]"
        aria-label="Informações de pagamento e localização"
      >
        <div className="max-w-5xl mx-auto">
          {/* Payment Methods */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Formas de Pagamento</h3>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-8 sm:h-10 w-8 sm:w-10 text-[#2F6BFF]" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm">Crédito</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-8 sm:h-10 w-8 sm:w-10 text-[#2F6BFF]" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm">Débito</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="h-8 sm:h-10 w-8 sm:w-10 text-[#2F6BFF]" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-sm">PIX</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="text-center" itemScope itemType="https://schema.org/PostalAddress">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Localização</h3>
            <address className="not-italic">
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8">
                <span itemProp="streetAddress">R. Delfino Ferreira Martins</span><br />
                <span itemProp="addressLocality">Santa Bárbara do Leste</span> - <span itemProp="addressRegion">MG</span><br />
                <span itemProp="postalCode">35328-000</span> — <span itemProp="addressCountry">Brasil</span>
              </p>
            </address>
            <Button 
              onClick={handleDirections}
              className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto max-w-sm"
              aria-label="Abrir rotas no Google Maps"
            >
              <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
              VER ROTAS
            </Button>
            <p className="text-xs sm:text-sm text-white/50 mt-4 px-4">
              Ative sua localização ou utilize o centro da cidade como referência.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 bg-black"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            {content.final_cta_title || "Seu carro merece um serviço à altura."}
          </h2>
          <p className="text-xl sm:text-2xl text-white/70 mb-8 sm:mb-10 px-4">
            {content.final_cta_subtitle || "Agende agora e surpreenda-se com o resultado."}
          </p>
          <Button 
            onClick={handleWhatsApp}
            className="bg-[#2F6BFF] hover:bg-[#2F6BFF]/90 text-white px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl w-full sm:w-auto max-w-md"
            aria-label="Fazer orçamento pelo WhatsApp"
          >
            <MessageCircle className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" aria-hidden="true" />
            FAZER ORÇAMENTO
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 bg-[#070707] border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center text-white/50 text-sm">
          <p>© 2024 Tintim Car. Todos os direitos reservados.</p>
          <nav aria-label="Contatos telefônicos">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
              <a 
                href="https://wa.me/5533999516878" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
                aria-label="WhatsApp (33) 99951-6878"
              >
                (33) 99951-6878
              </a>
              <a 
                href="https://wa.me/5533998463264" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
                aria-label="WhatsApp (33) 99846-3264"
              >
                (33) 99846-3264
              </a>
            </div>
          </nav>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-[#25D366] hover:bg-[#25D366]/90 text-white p-4 sm:p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Abrir WhatsApp para fazer orçamento"
      >
        <MessageCircle className="h-6 sm:h-7 w-6 sm:w-7" aria-hidden="true" />
      </button>

      {/* Hidden Admin Button */}
      <button
        onClick={() => navigate("/admin")}
        className="fixed bottom-6 sm:bottom-8 left-6 sm:left-8 bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Painel administrativo"
        title="Admin"
      >
        <Shield className="h-5 w-5" aria-hidden="true" />
      </button>
    </main>
  );
}
