import { LucideProps } from "lucide-react";
import { icons } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: React.ComponentType<LucideProps>;
}

export const DynamicIcon = ({ name, fallback: Fallback, ...props }: DynamicIconProps) => {
  // Handle custom telegram icon
  if (name === 'telegram') {
    return (
      <div 
        className="inline-flex items-center justify-center"
        style={{ 
          width: props.size || 24, 
          height: props.size || 24,
          backgroundImage: 'url(/lovable-uploads/70261896-0b87-47f7-a317-c7cbc0ba9362.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
    );
  }

  // Convert kebab-case to PascalCase for lucide icon names
  const iconName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Get the icon from lucide-react icons object
  const Icon = icons[iconName as keyof typeof icons] as React.ComponentType<LucideProps>;

  if (!Icon && Fallback) {
    return <Fallback {...props} />;
  }

  if (!Icon) {
    // Return a default icon if the requested icon is not found
    const DefaultIcon = icons.Circle as React.ComponentType<LucideProps>;
    return <DefaultIcon {...props} />;
  }

  return <Icon {...props} />;
};