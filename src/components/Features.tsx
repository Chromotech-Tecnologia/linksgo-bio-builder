import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Smartphone, 
  BarChart, 
  Shield, 
  Zap, 
  Globe,
  Heart,
  Users,
  Star
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Palette,
      title: "Personalização Total",
      description: "Customize cores, fontes, botões e layout. Sua marca, seu estilo."
    },
    {
      icon: Smartphone,
      title: "100% Responsivo",
      description: "Perfeito em qualquer dispositivo. Mobile-first sempre."
    },
    {
      icon: BarChart,
      title: "Analytics Completo",
      description: "Veja estatísticas detalhadas de cliques e visitantes."
    },
    {
      icon: Shield,
      title: "Seguro & Confiável",
      description: "SSL gratuito e backup automático. Seus dados protegidos."
    },
    {
      icon: Zap,
      title: "Super Rápido",
      description: "Carregamento instantâneo. Performance otimizada."
    },
    {
      icon: Globe,
      title: "Domínio Personalizado",
      description: "Use seu próprio domínio ou subdomínio personalizado."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Influencer Digital",
      content: "O LinksGo transformou completamente como compartilho meu conteúdo. Super fácil de usar!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Empreendedor",
      content: "Aumentei minhas conversões em 300% depois que comecei a usar. Recomendo muito!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Coach",
      content: "A personalização é incrível. Consegui criar algo único para minha marca.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 sm:py-32">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
            Funcionalidades que fazem a
            <span className="text-gradient ml-2">diferença</span>
          </h2>
          <p className="text-lg text-muted-foreground lg:text-xl">
            Tudo que você precisa para criar a página de bio links perfeita
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-32">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="interactive-card glass-card border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            O que nossos
            <span className="text-gradient ml-2">usuários dizem</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="interactive-card glass-card border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Love section */}
        <div className="mx-auto max-w-2xl text-center mt-20">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-pulse mr-2" />
            <span className="text-2xl font-bold">Mais de 50.000 usuários apaixonados</span>
            <Heart className="h-8 w-8 text-red-500 fill-red-500 animate-pulse ml-2" />
          </div>
          <p className="text-lg text-muted-foreground">
            Junte-se à maior comunidade de criadores de bio links do Brasil
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;