import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 sm:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary/30 dark:to-secondary/30"></div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 animate-fade-in-up">
            <Sparkles className="mr-2 h-4 w-4" />
            Plataforma #1 para Bio Links no Brasil
          </div>

          {/* Main heading */}
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gradient sm:text-6xl lg:text-7xl animate-fade-in-up">
            Crie sua página de
            <br />
            <span className="text-gradient">bio links</span> em minutos
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-lg leading-8 text-muted-foreground sm:text-xl lg:text-2xl animate-fade-in-up">
            Conecte todas as suas redes sociais, sites e conteúdos em uma única página personalizada. 
            Simples, rápido e totalmente customizável.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/register">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/templates">
                Ver Templates
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8 animate-slide-in-right">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 animate-float">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">Usuários ativos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-secondary rounded-2xl mb-4 animate-float" style={{ animationDelay: '1s' }}>
                <Globe className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-foreground">1M+</p>
              <p className="text-sm text-muted-foreground">Links criados</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 animate-float" style={{ animationDelay: '2s' }}>
                <Zap className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview mockup */}
      <div className="container px-4 sm:px-6 lg:px-8 mt-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-primary opacity-75 blur-xl animate-pulse-slow"></div>
            <div className="relative rounded-2xl bg-card/80 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ES</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Estética Premium</h3>
                  <p className="text-muted-foreground text-sm">@esteticapremium</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg text-center font-medium">
                  🏥 Agende Sua Consulta
                </div>
                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-center font-medium">
                  📋 Nossos Tratamentos
                </div>
                <div className="bg-accent text-accent-foreground p-4 rounded-lg text-center font-medium">
                  💬 WhatsApp Direto
                </div>
                <div className="bg-muted text-muted-foreground p-4 rounded-lg text-center font-medium">
                  🌐 Site Oficial
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;