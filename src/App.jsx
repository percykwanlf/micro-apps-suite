import { useEffect, useState } from 'react'
import HouseholdManual from './apps/HouseholdManual'
import FormulaDashboard from './FormulaDashboard'

const DEFAULT_FORMULA = {
  id: '1',
  name: 'Midnight Jasmine',
  targetVolumeMl: 100,
  lines: [],
}

const FORMULA_STORAGE_KEY = 'olfacta_formula_draft'

function loadFormula() {
  try {
    const raw = localStorage.getItem(FORMULA_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_FORMULA }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.lines)) {
      return { ...DEFAULT_FORMULA, ...parsed, lines: parsed.lines }
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_FORMULA }
}

export default function App() {
  const [activeApp, setActiveApp] = useState('menu')
  const [formula, setFormula] = useState(loadFormula)

  useEffect(() => {
    localStorage.setItem(FORMULA_STORAGE_KEY, JSON.stringify(formula))
  }, [formula])

  if (activeApp === 'olfacta') {
    return (
      <FormulaDashboard
        formula={formula}
        onUpdateFormula={(patch) =>
          setFormula((prev) => ({ ...prev, ...patch }))
        }
      />
    )
  }

  if (activeApp === 'manual') return <HouseholdManual />

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-3">
          Local suite
        </p>
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          My HK Startup Suite
        </h1>
        <p className="text-center text-sm text-slate-400 mb-8">
          Pick an app — high contrast for easier reading.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full rounded-xl bg-white px-5 py-4 text-left text-base font-semibold text-slate-900 shadow-lg transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => setActiveApp('olfacta')}
          >
            Olfacta (Perfume)
            <span className="mt-1 block text-xs font-normal text-slate-600">
              Formula lab &amp; IFRA helpers
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-800 px-5 py-4 text-left text-base font-semibold text-white border border-slate-600 shadow-lg transition hover:bg-slate-700 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => setActiveApp('manual')}
          >
            Helper Manual
            <span className="mt-1 block text-xs font-normal text-slate-400">
              Household notes (saved in this browser)
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
