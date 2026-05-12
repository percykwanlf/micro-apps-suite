import { useEffect, useState } from 'react'
import HouseholdManual from './apps/HouseholdManual'
import ShiftNomad from './apps/ShiftNomad'
import SporeSpot from './apps/SporeSpot'
import FormulaDashboard from './FormulaDashboard'

const DEFAULT_FORMULA = {
  id: '1',
  name: 'Midnight Jasmine',
  targetVolumeMl: 100,
  lines: [],
}

const FORMULA_STORAGE_KEY = 'olfacta_formula_draft'

/** Hash routes — keeps browser back/forward in sync with the suite. */
function parseAppFromHash() {
  const h = window.location.hash.slice(1)
  const path = (h.startsWith('/') ? h.slice(1) : h).replace(/\/$/, '')
  if (path === 'olfacta') return 'olfacta'
  if (path === 'manual') return 'manual'
  if (path === 'shiftnomad') return 'shiftnomad'
  if (path === 'sporespot') return 'sporespot'
  return 'menu'
}

function hashForApp(app) {
  if (app === 'menu') return '#/'
  return `#/${app}`
}

function isMenuHash(hash) {
  const h = hash ?? ''
  return h === '' || h === '#' || h === '#/'
}

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
  const [activeApp, setActiveApp] = useState(parseAppFromHash)
  const [formula, setFormula] = useState(loadFormula)

  useEffect(() => {
    localStorage.setItem(FORMULA_STORAGE_KEY, JSON.stringify(formula))
  }, [formula])

  useEffect(() => {
    const syncFromHash = () => setActiveApp(parseAppFromHash())
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  function navigateToApp(app) {
    const next = hashForApp(app)
    const cur = window.location.hash
    if (cur === next || (app === 'menu' && isMenuHash(cur))) {
      setActiveApp(app)
      return
    }
    window.location.hash = next
  }

  if (activeApp === 'olfacta') {
    return (
      <FormulaDashboard
        formula={formula}
        onUpdateFormula={(patch) =>
          setFormula((prev) => ({ ...prev, ...patch }))
        }
        onBackToSuite={() => navigateToApp('menu')}
      />
    )
  }

  if (activeApp === 'manual') {
    return <HouseholdManual onBackToSuite={() => navigateToApp('menu')} />
  }

  if (activeApp === 'shiftnomad') {
    return <ShiftNomad onBackToSuite={() => navigateToApp('menu')} />
  }

  if (activeApp === 'sporespot') {
    return <SporeSpot onBackToSuite={() => navigateToApp('menu')} />
  }

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
          Pick an app — high contrast for easier reading. Browser back returns
          here once you open an app.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full rounded-xl bg-white px-5 py-4 text-left text-base font-semibold text-slate-900 shadow-lg transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => navigateToApp('olfacta')}
          >
            Olfacta (Perfume)
            <span className="mt-1 block text-xs font-normal text-slate-600">
              Formula lab &amp; IFRA helpers
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-xl bg-slate-800 px-5 py-4 text-left text-base font-semibold text-white border border-slate-600 shadow-lg transition hover:bg-slate-700 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => navigateToApp('manual')}
          >
            Helper Manual
            <span className="mt-1 block text-xs font-normal text-slate-400">
              Household notes (saved in this browser)
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-sky-500/40 bg-sky-950/80 px-5 py-4 text-left text-base font-semibold text-sky-50 shadow-lg transition hover:border-sky-400/60 hover:bg-sky-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => navigateToApp('shiftnomad')}
          >
            Shift Nomad
            <span className="mt-1 block text-xs font-normal text-sky-200/80">
              Travel nurse contract filters
            </span>
          </button>
          <button
            type="button"
            className="w-full rounded-xl border border-emerald-500/35 bg-emerald-950/70 px-5 py-4 text-left text-base font-semibold text-emerald-50 shadow-lg transition hover:border-emerald-400/50 hover:bg-emerald-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            onClick={() => navigateToApp('sporespot')}
          >
            Spore Spot
            <span className="mt-1 block text-xs font-normal text-emerald-200/75">
              Foraging spots &amp; weather-style alerts (demo)
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
