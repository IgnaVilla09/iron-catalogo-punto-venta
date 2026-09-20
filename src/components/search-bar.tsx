'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (search: string) => void;
}

export function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    onSearch(trimmed);
    if (!trimmed) {
      setOpen(false);
    }
  }

  function handleClose() {
    setValue('');
    onSearch('');
    setOpen(false);
  }

  return (
    <div className="relative flex items-center justify-end">
      {/* Botón lupa - se desvanece cuando se abre */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-card transition-all duration-300 hover:bg-accentSoft ${
          open ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'
        }`}
        aria-label="Buscar productos"
      >
        <Search className="h-4 w-4 text-stone-600" />
      </button>

      {/* Formulario de búsqueda - se expande desde la derecha */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 transition-all duration-300 ease-out ${
          open
            ? 'w-full opacity-100'
            : 'pointer-events-none absolute w-0 opacity-0'
        }`}
      >
        <div className="relative flex-1 overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-border bg-card px-4 py-2 pr-9 text-sm shadow-card outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-card transition-colors hover:bg-accentSoft"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4 text-stone-600" />
        </button>
      </form>
    </div>
  );
}
