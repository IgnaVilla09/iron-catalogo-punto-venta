'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (search: string) => void;
}

export function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [open, setOpen] = useState(Boolean(initialValue));
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
    if (initialValue) setOpen(true);
  }, [initialValue]);

  function handleClose() {
    setValue(initialValue);
    setOpen(false);
  }

  function handleClear() {
    setValue('');
    if (initialValue) onSearch('');
    inputRef.current?.focus();
  }

  return (
    <div className="relative shrink-0">
      <button type="button" onClick={() => { setOpen(true); requestAnimationFrame(() => inputRef.current?.focus()); }} aria-label="Buscar productos" aria-expanded={open} className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white hover:border-foreground">
        <Search className="h-5 w-5" aria-hidden="true" />
        {initialValue ? <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> : null}
      </button>
      {open ? (
        <form role="search" onSubmit={(event) => { event.preventDefault(); onSearch(value.trim()); }} onKeyDown={(event) => { if (event.key === 'Escape') handleClose(); }} className="absolute right-0 top-full z-20 mt-2 flex w-[min(85vw,420px)] items-center gap-1 rounded-lg border border-border bg-white p-1 shadow-lg">
          <label htmlFor="catalog-search" className="sr-only">Nombre del producto</label>
          <input ref={inputRef} id="catalog-search" type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Buscar por nombre" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
          {value ? <button type="button" onClick={handleClear} aria-label="Borrar búsqueda" title="Borrar búsqueda" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md hover:bg-background"><Eraser className="h-4 w-4" aria-hidden="true" /></button> : null}
          <button type="submit" aria-label="Buscar" className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-white"><Search className="h-4 w-4" /></button>
          <button type="button" onClick={handleClose} aria-label="Cerrar búsqueda" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md hover:bg-background"><X className="h-4 w-4" /></button>
        </form>
      ) : null}
    </div>
  );
}
