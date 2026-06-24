import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  imageUrl?: string | null;
  alt: string;
  className?: string;
}

export function ImagePlaceholder({ imageUrl, alt, className }: ImagePlaceholderProps) {
  if (imageUrl) {
    return <img alt={alt} src={imageUrl} className={cn('h-full w-full object-cover', className)} />;
  }

  return (
    <div className={cn('flex h-full w-full items-center justify-center bg-stone-200 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500', className)}>
      Sin imagen
    </div>
  );
}
