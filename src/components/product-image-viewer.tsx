'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, ZoomIn } from 'lucide-react';
import { ImagePlaceholder } from '@/components/image-placeholder';

export function ProductImageViewer({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (!imageUrl) {
    return (
      <div className="aspect-[4/5] max-h-[720px] overflow-hidden bg-[#e4e9e8]">
        <ImagePlaceholder alt={name} />
      </div>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" aria-label={`Ampliar imagen de ${name}`} className="group relative block aspect-[4/5] max-h-[720px] w-full cursor-zoom-in overflow-hidden bg-[#e4e9e8] text-left">
          <ImagePlaceholder imageUrl={imageUrl} alt={name} priority />
          <span aria-hidden="true" className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-foreground shadow-sm">
            <ZoomIn className="h-4 w-4" /> Ampliar
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[min(90dvh,900px)] w-[min(94vw,1200px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3">
          <Dialog.Title className="sr-only">Imagen ampliada de {name}</Dialog.Title>
          <Dialog.Description className="sr-only">Podés cerrar la imagen con Escape, el botón cerrar o tocando fuera.</Dialog.Description>
          <Dialog.Close asChild>
            <button type="button" aria-label="Cerrar imagen ampliada" className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-foreground hover:bg-accentSoft">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
          <img src={imageUrl} alt={name} decoding="async" className="max-h-[calc(90dvh-4rem)] max-w-full object-contain" />
          <p className="max-w-full truncate text-center text-sm font-semibold text-white">{name}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
