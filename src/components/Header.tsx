import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LinksGo</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/templates" 
              className="transition-colors hover:text-primary"
            >
              Templates
            </Link>
            <Link 
              to="/pricing" 
              className="transition-colors hover:text-primary"
            >
              Preços
            </Link>
            <Link 
              to="/features" 
              className="transition-colors hover:text-primary"
            >
              Funcionalidades
            </Link>
            <Link 
              to="/help" 
              className="transition-colors hover:text-primary"
            >
              Ajuda
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search could go here if needed */}
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Começar Grátis</Link>
            </Button>
          </nav>

          <button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/40 bg-background/95 backdrop-blur">
            <Link
              to="/templates"
              className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              to="/help"
              className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Ajuda
            </Link>
            <div className="px-3 py-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button variant="hero" className="w-full" asChild>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Começar Grátis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;