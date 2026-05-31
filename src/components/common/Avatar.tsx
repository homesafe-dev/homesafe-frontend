import React, { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../../utils/avatarUrl';

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  firstName,
  lastName,
  size = 'md',
  className = '',
  showStatus = false,
  isOnline = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedSrc = resolveMediaUrl(src);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  // Generate initials from first and last name
  const getInitials = (first: string, last: string): string => {
    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Generate a consistent background color based on name
  const getInitialsColor = (first: string, last: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];

    const nameString = `${first}${last}`;
    const hash = nameString.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-2xl',
  };

  const statusSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const statusPositionClasses = {
    sm: '-top-0.5 -right-0.5',
    md: '-top-0.5 -right-0.5',
    lg: 'top-1 right-1',
    xl: 'top-1 right-1',
  };

  // Check if avatar is valid
  const hasValidAvatar = Boolean(resolvedSrc) && !imageFailed;

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ${className}`;

  if (hasValidAvatar) {
    return (
      <div className="relative">
        <img
          src={resolvedSrc!}
          alt={`${firstName} ${lastName}`}
          className={`${baseClasses} object-cover`}
          onError={() => setImageFailed(true)}
        />
        {showStatus && (
          <div
            className={`absolute ${statusPositionClasses[size]} ${statusSizeClasses[size]} border-2 border-white rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`${baseClasses} text-white ${getInitialsColor(firstName, lastName)}`}
      >
        {getInitials(firstName, lastName)}
      </div>
      {showStatus && (
        <div
          className={`absolute ${statusPositionClasses[size]} ${statusSizeClasses[size]} border-2 border-white rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
