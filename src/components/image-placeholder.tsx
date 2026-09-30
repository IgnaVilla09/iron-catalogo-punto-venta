import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  imageUrl?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ImagePlaceholder({ imageUrl, alt, className, priority = false }: ImagePlaceholderProps) {
  if (imageUrl) {
    // Product images come from the catalog API; its host can vary by installation.
    return <img alt={alt} src={imageUrl} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className={cn('h-full w-full object-cover', className)} />;
  }

  return (
    <div role="img" aria-label={`Imagen no disponible: ${alt}`} className={cn('flex h-full w-full flex-col items-center justify-center gap-3 bg-[#e4e9e8] text-muted', className)}>
      <ImageOff className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
      <span className="text-xs font-bold">Imagen no disponible</span>
    </div>
  );
}
