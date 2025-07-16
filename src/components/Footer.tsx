import { Link } from "react-router-dom";
import { Zap, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">LinksGo</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              A plataforma mais completa para criar suas páginas de bio links. 
              Simples, rápido e totalmente personalizável.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Produto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/templates" className="hover:text-primary transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-primary transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Suporte</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-primary transition-colors">
                  Tutoriais
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-primary transition-colors">
                  Status do Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Empresa</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-primary transition-colors">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-primary transition-colors">
                  Imprensa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 LinksGo. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;