import { SexoFilter, EdadFilter, SortOption } from '../../types'

interface FilterBarProps {
  sexo: SexoFilter
  edad: EdadFilter
  sort: SortOption
  onSexoChange: (v: SexoFilter) => void
  onEdadChange: (v: EdadFilter) => void
  onSortChange: (v: SortOption) => void
}

const SEXO_OPTIONS: { value: SexoFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'nene', label: 'Nene' },
  { value: 'nena', label: 'Nena' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'bebe', label: 'Bebé' },
]

const EDAD_OPTIONS: { value: EdadFilter; label: string }[] = [
  { value: 'todos', label: 'Todas las edades' },
  { value: '0-2', label: '0–2 años' },
  { value: '3-5', label: '3–5 años' },
  { value: '6-8', label: '6–8 años' },
  { value: '9-12', label: '9–12 años' },
  { value: '12+', label: '+12 años' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'az', label: 'A–Z' },
  { value: 'za', label: 'Z–A' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
]

export function FilterBar({ sexo, edad, sort, onSexoChange, onEdadChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Sexo pills */}
      <div className="flex gap-1.5 flex-wrap">
        {SEXO_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSexoChange(opt.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              sexo === opt.value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap sm:ml-auto">
        {/* Edad select */}
        <select
          value={edad}
          onChange={(e) => onEdadChange(e.target.value as EdadFilter)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        >
          {EDAD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Orden select */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
