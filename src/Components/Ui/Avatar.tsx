import React from 'react';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className = '' }) => (
  <div className={`relative inline-block overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className = '' }) => {
  if (!src) return null;
  return (
    <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />
  );
};

export const AvatarFallback: React.FC<AvatarProps> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center w-full h-full ${className}`}>
    {children}
  </div>
);