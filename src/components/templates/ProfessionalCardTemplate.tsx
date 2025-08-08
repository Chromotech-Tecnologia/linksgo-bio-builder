import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Button } from "@/components/ui/button";

interface ProfessionalCardTemplateProps {
  data: {
    title: string;
    description?: string;
    avatar_url?: string;
    background_url?: string;
    theme_config: {
      background_color?: string;
      title_color?: string;
      description_color?: string;
      hero_image?: {
        enabled: boolean;
        height?: string;
        border_radius?: string;
        size?: string;
        shape?: string;
      };
      buttons?: {
        gradient?: {
          from: string;
          to: string;
        };
        text_color?: string;
        icon_color?: string;
        border_radius?: string;
      };
      social_icons?: {
        background_color?: string;
        icon_color?: string;
        size?: string;
      };
    };
    project_links: Array<{
      id: string;
      title: string;
      url: string;
      icon_name?: string;
      icon_color?: string;
      background_color?: string;
      text_color?: string;
      gradient?: {
        from: string;
        to: string;
      };
      is_active: boolean;
    }>;
    social_links?: Array<{
      id: string;
      platform: string;
      url: string;
      icon_name: string;
      icon_color?: string;
      background_color?: string;
    }>;
  };
  onLinkClick?: (linkId: string, url: string) => void;
}

export const ProfessionalCardTemplate = ({ data, onLinkClick }: ProfessionalCardTemplateProps) => {
  const {
    title,
    description,
    avatar_url,
    background_url,
    theme_config,
    project_links,
    social_links = []
  } = data;

  const handleLinkClick = (linkId: string, url: string) => {
    if (onLinkClick) {
      onLinkClick(linkId, url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getButtonStyle = (link: any) => {
    if (link.gradient) {
      return {
        background: `linear-gradient(135deg, ${link.gradient.from}, ${link.gradient.to})`,
        color: link.text_color || theme_config.buttons?.text_color || '#ffffff',
        borderRadius: theme_config.buttons?.border_radius || '12px',
        border: 'none'
      };
    }
    
    return {
      backgroundColor: link.background_color || theme_config.buttons?.gradient?.from || '#1e40af',
      color: link.text_color || theme_config.buttons?.text_color || '#ffffff',
      borderRadius: theme_config.buttons?.border_radius || '12px',
      border: 'none'
    };
  };

  const getSocialIconStyle = (social: any) => ({
    backgroundColor: social.background_color || theme_config.social_icons?.background_color || '#3b82f6',
    color: social.icon_color || theme_config.social_icons?.icon_color || '#ffffff',
    width: theme_config.social_icons?.size || '48px',
    height: theme_config.social_icons?.size || '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  });

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: theme_config.background_color || '#ffffff',
        backgroundImage: background_url ? `url(${background_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Hero Image Section */}
      {theme_config.hero_image?.enabled && avatar_url && (
        <div 
          className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden"
          style={{
            height: theme_config.hero_image.height || '200px',
            borderRadius: theme_config.hero_image.border_radius || '0 0 24px 24px'
          }}
        >
          <img
            src={avatar_url}
            alt={title}
            className="object-cover border-4 border-white shadow-lg"
            style={{ 
              width: theme_config.hero_image.size || '120px',
              height: theme_config.hero_image.size || '120px',
              borderRadius: theme_config.hero_image.shape === 'square' ? '12px' : '50%'
            }}
          />
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-indigo-200 rounded-full opacity-40"></div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold mb-3"
            style={{ 
              color: theme_config.title_color || '#1e40af',
              fontSize: '24px'
            }}
          >
            {title}
          </h1>
          {description && (
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: theme_config.description_color || '#64748b',
                fontSize: '14px'
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-3 mb-8">
          {project_links
            .filter(link => link.is_active)
            .map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className="w-full flex items-center justify-between p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                style={getButtonStyle(link)}
              >
                <div className="flex items-center space-x-3">
                  {link.icon_name && (
                    <DynamicIcon
                      name={link.icon_name}
                      className="w-5 h-5"
                      style={{ 
                        color: link.icon_color || theme_config.buttons?.icon_color || '#ffffff'
                      }}
                    />
                  )}
                  <span className="font-medium">{link.title}</span>
                </div>
                <DynamicIcon
                  name="chevron-right"
                  className="w-5 h-5 opacity-70"
                  style={{ 
                    color: link.text_color || theme_config.buttons?.text_color || '#ffffff'
                  }}
                />
              </button>
            ))}
        </div>

        {/* Social Icons Section */}
        {social_links.length > 0 && (
          <div className="flex justify-center space-x-4 mb-8">
            {social_links.map((social) => (
              <button
                key={social.id}
                onClick={() => window.open(social.url, '_blank', 'noopener,noreferrer')}
                style={getSocialIconStyle(social)}
                className="hover:scale-110 transition-transform duration-300"
              >
                <DynamicIcon
                  name={social.icon_name}
                  className="w-6 h-6"
                />
              </button>
            ))}
          </div>
        )}

        {/* Footer with LinksGo Logo */}
        <div className="text-center pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-blue-500 text-sm">
            <img 
              src="/lovable-uploads/2fb17c2c-7b1b-4521-bf54-b081461411c8.png" 
              alt="LinksGo" 
              className="h-6 w-auto"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">©Copyright - LinksGo</p>
        </div>
      </div>
    </div>
  );
};