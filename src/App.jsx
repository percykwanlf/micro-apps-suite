import { useCallback, useEffect, useMemo, useState } from 'react'
import FormulaDashboard from './FormulaDashboard'

const LIBRARY_KEY = 'olfacta_library'
const LEGACY_DRAFT_KEY = 'olfacta_draft'

const DEFAULT_LINES_TEMPLATE = [
  { id: '1', ingredientName: 'Jasmine Grandiflorum Absolute', weightGrams: 2.5 },
  { id: '2', ingredientName: 'Bergamot Essential Oil', weightGrams: 8.0 },
  { id: '3', ingredientName: 'Australian Sandalwood', weightGrams: 4.2 },
  { id: '4', ingredientName: 'Iso E Super', weightGrams: 12.0 },
  { id: '5', ingredientName: 'Ethanol 96%', weightGrams: 73.3 },
]

function nextId() {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}

function normalizeLineRow(row) {
  if (
    !row ||
    typeof row.ingredientName !== 'string' ||
    row.id == null ||
    String(row.id).length === 0
  ) {
    return null
  }
  let weightGrams = row.weightGrams
  if (weightGrams === '' || weightGrams === undefined) {
    weightGrams = ''
  } else {
    const n = Number(weightGrams)
    weightGrams = Number.isFinite(n) && n >= 0 ? n : ''
  }
  return {
    id: String(row.id),
    ingredientName: row.ingredientName,
    weightGrams,
  }
}

function normalizeLines(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeLineRow).filter(Boolean)
}

function createFormula(overrides = {}) {
  return {
    id: nextId(),
    name: 'Untitled formula',
    targetVolumeMl: 100,
    lines: [],
    ...overrides,
  }
}

function loadLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      const formulas = Array.isArray(data.formulas) ? data.formulas : []
      let activeFormulaId =
        typeof data.activeFormulaId === 'string' ? data.activeFormulaId : null

      const normalized = formulas
        .filter(
          (f) =>
            f &&
            f.id != null &&
            typeof f.name === 'string' &&
            Number.isFinite(Number(f.targetVolumeMl)),
        )
        .map((f) => ({
          id: String(f.id),
          name: f.name.trim() || 'Untitled formula',
          targetVolumeMl: Math.max(0, Number(f.targetVolumeMl)),
          lines: normalizeLines(f.lines),
        }))

      if (normalized.length > 0) {
        if (
          !activeFormulaId ||
          !normalized.some((f) => f.id === activeFormulaId)
        ) {
          activeFormulaId = normalized[0].id
        }
        return { formulas: normalized, activeFormulaId }
      }
    }

    const legacy = localStorage.getItem(LEGACY_DRAFT_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy)
      const lines = normalizeLines(Array.isArray(parsed) ? parsed : [])
      if (lines.length > 0) {
        const f = createFormula({
          name: 'Midnight Jasmine',
          targetVolumeMl: 100,
          lines,
        })
        return { formulas: [f], activeFormulaId: f.id }
      }
    }
  } catch {
    /* fall through */
  }

  const seed = createFormula({
    name: 'Midnight Jasmine',
    targetVolumeMl: 100,
    lines: normalizeLines(DEFAULT_LINES_TEMPLATE),
  })
  return { formulas: [seed], activeFormulaId: seed.id }
}

function saveLibrary(formulas, activeFormulaId) {
  try {
    localStorage.setItem(
      LIBRARY_KEY,
      JSON.stringify({ version: 1, formulas, activeFormulaId }),
    )
  } catch {
    // ignore
  }
}

export default function App() {
  const [store, setStore] = useState(loadLibrary)
  const { formulas, activeFormulaId } = store

  const activeFormula = useMemo(
    () => formulas.find((f) => f.id === activeFormulaId) ?? null,
    [formulas, activeFormulaId],
  )

  useEffect(() => {
    saveLibrary(formulas, activeFormulaId)
  }, [formulas, activeFormulaId])

  const handleSelectFormula = useCallback((id) => {
    setStore((s) => ({ ...s, activeFormulaId: id }))
  }, [])

  const handleNewFormula = useCallback(() => {
    const f = createFormula({ name: 'New formula' })
    setStore((s) => ({
      formulas: [...s.formulas, f],
      activeFormulaId: f.id,
    }))
  }, [])

  const patchActiveFormula = useCallback(
    (patch) => {
      setStore((s) => ({
        ...s,
        formulas: s.formulas.map((f) =>
          f.id === s.activeFormulaId ? { ...f, ...patch } : f,
        ),
      }))
    },
    [],
  )

  return (
    <div className="flex h-screen overflow-hidden bg-lab-bg md:flex-row">
      <aside
        className="flex min-h-0 w-full shrink-0 flex-col border-b border-lab-border bg-lab-elevated md:w-72 md:border-b-0 md:border-r"
        aria-label="Formulas"
      >
        <div className="lab-grid border-b border-lab-border/80 px-4 py-5">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-lab-accent">
            Olfacta
          </p>
          <p className="mt-1 text-xs text-lab-muted">Project bench</p>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={handleNewFormula}
            className="w-full rounded-lg border border-lab-accent/40 bg-lab-surface py-2.5 text-sm font-semibold text-lab-accent shadow-panel transition-colors hover:border-lab-accent hover:bg-lab-accent/10 focus:outline-none focus:ring-2 focus:ring-lab-accent/40"
          >
            + New formula
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
          <p className="px-2 pb-2 font-mono text-[10px] font-medium uppercase tracking-widest text-lab-muted">
            Saved formulas
          </p>
          <ul className="space-y-1">
            {formulas.map((f) => {
              const active = f.id === activeFormulaId
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectFormula(f.id)}
                    className={[
                      'w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      active
                        ? 'bg-lab-accent/15 font-medium text-lab-highlight ring-1 ring-lab-accent/35'
                        : 'text-lab-muted hover:bg-white/[0.06] hover:text-lab-highlight',
                    ].join(' ')}
                  >
                    <span className="line-clamp-2">{f.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] tabular-nums text-lab-muted/90">
                      {f.targetVolumeMl} mL · {f.lines.length} line
                      {f.lines.length === 1 ? '' : 's'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        {activeFormula ? (
          <FormulaDashboard
            key={activeFormula.id}
            formula={activeFormula}
            onUpdateFormula={patchActiveFormula}
          />
        ) : (
          <div className="lab-grid flex min-h-[50vh] items-center justify-center px-6 py-16 text-center text-lab-muted">
            <p className="max-w-sm text-sm">Select a formula from the sidebar.</p>
          </div>
        )}
      </main>
    </div>
  )
}
