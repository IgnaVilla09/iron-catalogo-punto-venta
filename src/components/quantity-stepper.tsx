import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({ value, max, onChange, label }: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex h-12 items-center rounded-lg border border-border bg-white" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`Reducir ${label}`} className="flex h-11 w-11 items-center justify-center disabled:opacity-30">
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-bold">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Aumentar ${label}`} className="flex h-11 w-11 items-center justify-center disabled:opacity-30">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
