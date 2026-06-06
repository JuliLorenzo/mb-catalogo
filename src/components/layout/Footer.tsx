
export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Mundo Barrilete — San Juan, Argentina
        </p>
        <p className="text-slate-300 text-xs mt-1">
          Catálogo digital para regalos corporativos · Día del Niño
        </p>
      </div>
    </footer>
  )
}
