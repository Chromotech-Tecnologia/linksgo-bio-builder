import { DynamicIcon } from "@/components/ui/dynamic-icon";

interface BannerLink {
  id: string;
  title: string;
  url: string;
  icon_name?: string;
  is_active: boolean;
  banner_image?: string;
  banner_color?: string;
  text_color?: string;
  subtitle?: string;
}

interface BannerCardTemplateProps {
  data: {
    title: string;
    description?: string;
    avatar_url?: string;
    background_url?: string;
    theme_config: {
      background_color?: string;
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
      title_color?: string;
      business_type?: string;
      logo_shape?: 'circle' | 'square' | 'rounded';
      logo_size?: string;
      banner_style?: {
        height?: string;
        border_radius?: string;
        shadow?: boolean;
      };
    };
    project_links: BannerLink[];
  };
  onLinkClick?: (linkId: string, url: string) => void;
}

// Default banner colors for different link types
const getBannerStyle = (link: BannerLink, index: number, themeConfig: BannerCardTemplateProps['data']['theme_config']) => {
  const defaultColors = [
    { bg: 'linear-gradient(135deg, #dc2626, #ef4444)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #eab308, #fbbf24)', text: '#1f2937' },
    { bg: 'linear-gradient(135deg, #16a34a, #22c55e)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #2563eb, #3b82f6)', text: '#ffffff' },
    { bg: 'linear-gradient(135deg, #9333ea, #a855f7)', text: '#ffffff' },
  ];

  const colorSet = defaultColors[index % defaultColors.length];

  return {
    background: link.banner_color || colorSet.bg,
    color: link.text_color || colorSet.text,
    borderRadius: themeConfig.banner_style?.border_radius || '16px',
    boxShadow: themeConfig.banner_style?.shadow !== false ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
  };
};

// Get icon based on link content
const getSmartIcon = (link: BannerLink): string => {
  const title = link.title.toLowerCase();
  const url = link.url.toLowerCase();

  if (url.includes('ifood') || title.includes('ifood')) return 'smartphone';
  if (url.includes('whatsapp') || url.includes('wa.me') || title.includes('whatsapp')) return 'message-circle';
  if (url.includes('instagram') || title.includes('instagram')) return 'instagram';
  if (url.includes('facebook') || title.includes('facebook')) return 'facebook';
  if (title.includes('cardápio') || title.includes('menu') || title.includes('pedido')) return 'utensils';
  if (title.includes('site') || title.includes('website')) return 'globe';
  if (title.includes('local') || title.includes('endereço') || title.includes('visite')) return 'map-pin';
  if (title.includes('telefone') || title.includes('ligar')) return 'phone';
  if (title.includes('delivery') || title.includes('entrega')) return 'truck';
  
  return link.icon_name || 'external-link';
};

export const BannerCardTemplate = ({ data, onLinkClick }: BannerCardTemplateProps) => {
  const {
    title,
    avatar_url,
    theme_config,
    project_links,
  } = data;

  const handleLinkClick = (linkId: string, url: string) => {
    if (onLinkClick) {
      onLinkClick(linkId, url);
    } else {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  const logoSize = theme_config.logo_size || '100px';
  const logoShape = theme_config.logo_shape || 'circle';

  const getLogoStyle = () => {
    const baseStyle = {
      width: logoSize,
      height: logoSize,
      objectFit: 'cover' as const,
    };

    switch (logoShape) {
      case 'square':
        return { ...baseStyle, borderRadius: '0' };
      case 'rounded':
        return { ...baseStyle, borderRadius: '16px' };
      case 'circle':
      default:
        return { ...baseStyle, borderRadius: '50%' };
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: theme_config.background_color || '#f5f5f5',
      }}
    >
      {/* Header with Logo */}
      <div className="flex flex-col items-center pt-8 pb-4 px-4">
        {avatar_url && (
          <div 
            className="border-4 border-white shadow-xl overflow-hidden"
            style={getLogoStyle()}
          >
            <img
              src={avatar_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 
          className="text-2xl font-bold mt-4 text-center"
          style={{ color: theme_config.title_color || '#1f2937' }}
        >
          {title}
        </h1>
      </div>

      {/* Banner Links */}
      <div className="flex-1 px-4 pb-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          {project_links
            .filter(link => link.is_active)
            .map((link, index) => {
              const bannerStyle = getBannerStyle(link, index, theme_config);
              const iconName = getSmartIcon(link);

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="w-full relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{
                    ...bannerStyle,
                    minHeight: theme_config.banner_style?.height || '80px',
                    padding: '16px 20px',
                  }}
                >
                  {/* Banner Image Background (if provided) */}
                  {link.banner_image && (
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url(${link.banner_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        <DynamicIcon
                          name={iconName}
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-lg block">{link.title}</span>
                        {link.subtitle && (
                          <span className="text-sm opacity-80">{link.subtitle}</span>
                        )}
                      </div>
                    </div>
                    <DynamicIcon
                      name="chevron-right"
                      className="w-6 h-6 opacity-70"
                    />
                  </div>
                </button>
              );
            })}
        </div>

        {/* Footer with LinksGo Logo */}
        <div className="text-center pt-8 mt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">O seu link para todas as conexões!</p>
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/2fb17c2c-7b1b-4521-bf54-b081461411c8.png" 
              alt="LinksGo" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">©Copyright - LinksGo</p>
        </div>
      </div>
    </div>
  );
};
