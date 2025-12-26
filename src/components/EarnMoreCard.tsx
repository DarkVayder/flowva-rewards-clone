import type { IconType } from 'react-icons';

interface EarnMoreCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: IconType;
  onClick?: () => void;
  iconPosition?: 'top' | 'left';
}

export default function EarnMoreCard({
  title,
  description,
  icon: Icon,
  onClick,
  iconPosition = 'top',
}: EarnMoreCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        group
        bg-white rounded-2xl p-6
        shadow-sm hover:shadow-md
        transition-all cursor-pointer
      "
    >
      {/* Icon */}
      {Icon && iconPosition === 'top' && (
        <Icon
          className="
            text-purple-600
            group-hover:text-pink-700
            text-2xl mb-3
            transition-colors
          "
        />
      )}

      {/* Title */}
      <h3
        className="
          font-semibold mb-1
          flex items-center gap-2
          text-gray-900
          group-hover:text-pink-700
          transition-colors
        "
      >
        {Icon && iconPosition === 'left' && (
          <Icon
            className="
              text-purple-600
              group-hover:text-pink-700
              text-lg
              transition-colors
            "
          />
        )}
        {title}
      </h3>

      {/* Description */}
      <div className="text-gray-500 text-sm mt-1">
        {description}
      </div>
    </div>
  );
}
