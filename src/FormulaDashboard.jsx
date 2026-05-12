import { useEffect, useMemo, useRef, useState } from 'react'

/** IFRA max % in finished product (simplified single limit per material). null = no tracked limit in app. */
const INGREDIENT_CATALOG = [
  { name: 'Jasmine Grandiflorum Absolute', ifraLimit: null },
  { name: 'Bergamot Essential Oil', ifraLimit: 0.8 },
  { name: 'Australian Sandalwood', ifraLimit: null },
  { name: 'Vanillin Crystal', ifraLimit: null },
  { name: 'Rose Otto (Bulgaria)', ifraLimit: 2.0 },
  { name: 'Rose Oil', ifraLimit: 2.0 },
  { name: 'Patchouli Heart', ifraLimit: null },
  { name: 'Iso E Super', ifraLimit: null },
  { name: 'Hedione', ifraLimit: null },
  { name: 'Oakmoss Absolute', ifraLimit: 0.02 },
  { name: 'Ethanol 96%', ifraLimit: null },
  { name: 'DPG', ifraLimit: null },
]

function nextId() {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}

function getIfraLimitForName(ingredientName) {
  const entry = INGREDIENT_CATALOG.find((c) => c.name === ingredientName)
  if (!entry || entry.ifraLimit == null) return null
  return Number(entry.ifraLimit)
}

/**
 * @param {{
 *   formula: { id: string; name: string; targetVolumeMl: number; lines: Array<{ id: string; ingredientName: string; weightGrams: number|string }> };
 *   onUpdateFormula: (patch: Partial<{ name: string; targetVolumeMl: number; lines: unknown }>) => void;
 *   onBackToSuite?: () => void;
 * }} props
 */
export default function FormulaDashboard({ formula, onUpdateFormula, onBackToSuite }) {
  const { name, targetVolumeMl, lines } = formula

  const [selectedIngredient, setSelectedIngredient] = useState(
    INGREDIENT_CATALOG[0].name,
  )
  const [newGrams, setNewGrams] = useState('')

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(name)
  const nameInputRef = useRef(null)

  const [editingVolume, setEditingVolume] = useState(false)
  const [volumeDraft, setVolumeDraft] = useState(String(targetVolumeMl))
  const volumeInputRef = useRef(null)

  useEffect(() => {
    if (!editingName) setNameDraft(name)
  }, [name, editingName])

  useEffect(() => {
    if (!editingVolume) setVolumeDraft(String(targetVolumeMl))
  }, [targetVolumeMl, editingVolume])

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])

  useEffect(() => {
    if (editingVolume) volumeInputRef.current?.focus()
  }, [editingVolume])

  function commitName() {
    const trimmed = nameDraft.trim() || 'Untitled formula'
    onUpdateFormula({ name: trimmed })
    setNameDraft(trimmed)
    setEditingName(false)
  }

  function commitVolume() {
    const parsed = parseFloat(volumeDraft)
    const next = Number.isFinite(parsed) && parsed >= 0 ? parsed : targetVolumeMl
    onUpdateFormula({ targetVolumeMl: next })
    setVolumeDraft(String(next))
    setEditingVolume(false)
  }

  const totalWeight = useMemo(
    () =>
      lines.reduce((sum, row) => sum + (Number(row.weightGrams) || 0), 0),
    [lines],
  )

  const percents = useMemo(() => {
    if (totalWeight <= 0) {
      return Object.fromEntries(lines.map((l) => [l.id, 0]))
    }
    const out = {}
    for (const row of lines) {
      const w = Number(row.weightGrams) || 0
      out[row.id] = (w / totalWeight) * 100
    }
    return out
  }, [lines, totalWeight])

  const ifraFlags = useMemo(() => {
    const out = {}
    for (const row of lines) {
      const limit = getIfraLimitForName(row.ingredientName)
      const pct = percents[row.id] ?? 0
      out[row.id] = {
        limit,
        violates:
          limit != null &&
          totalWeight > 0 &&
          pct > limit,
      }
    }
    return out
  }, [lines, percents, totalWeight])

  function updateLines(updater) {
    const next =
      typeof updater === 'function' ? updater(lines) : updater
    onUpdateFormula({ lines: next })
  }

  function updateWeight(id, raw) {
    updateLines((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        if (raw === '') return { ...row, weightGrams: '' }
        const parsed = parseFloat(raw)
        if (!Number.isFinite(parsed) || parsed < 0) return row
        return { ...row, weightGrams: parsed }
      }),
    )
  }

  function deleteLine(id) {
    updateLines((prev) => prev.filter((row) => row.id !== id))
  }

  function addLine() {
    const g = newGrams === '' ? 0 : Number(newGrams)
    if (!Number.isFinite(g) || g < 0) return
    updateLines((prev) => [
      ...prev,
      {
        id: nextId(),
        ingredientName: selectedIngredient,
        weightGrams: g,
      },
    ])
    setNewGrams('')
  }

  return (
    <div className="lab-grid h-full">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {onBackToSuite ? (
          <nav className="mb-6" aria-label="Suite navigation">
            <button
              type="button"
              onClick={onBackToSuite}
              className="inline-flex items-center gap-2 rounded-lg border border-lab-border bg-lab-surface px-3 py-2 font-mono text-xs font-medium uppercase tracking-wider text-lab-muted shadow-panel transition hover:border-lab-accent/40 hover:text-lab-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent/40"
            >
              <span aria-hidden="true">←</span>
              All apps
            </button>
          </nav>
        ) : null}
        <header className="mb-10 flex flex-col gap-6 border-b border-lab-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-lab-accent">
              Olfacta Lab
            </p>
            {editingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitName()
                  if (e.key === 'Escape') {
                    setNameDraft(name)
                    setEditingName(false)
                  }
                }}
                className="mt-2 w-full max-w-xl rounded-lg border border-lab-accent/50 bg-lab-bg px-3 py-2 font-sans text-2xl font-semibold tracking-tight text-white shadow-inner outline-none focus:ring-2 focus:ring-lab-accent/40 sm:text-4xl"
                aria-label="Formula name"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNameDraft(name)
                  setEditingName(true)
                }}
                className="group mt-2 block max-w-full text-left"
              >
                <h1 className="break-words font-sans text-3xl font-semibold tracking-tight text-white underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-lab-accent/60 sm:text-4xl">
                  {name}
                </h1>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-lab-muted opacity-0 transition-opacity group-hover:opacity-100">
                  Click to rename
                </span>
              </button>
            )}
            <p className="mt-2 text-sm text-lab-muted">
              Formula workspace · weights in grams · IFRA limits where listed
            </p>
          </div>
          <div className="shrink-0">
            {editingVolume ? (
              <div className="rounded-lg border border-lab-accent/50 bg-lab-surface px-5 py-4 shadow-panel">
                <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-lab-muted">
                  Target volume (mL)
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <input
                    ref={volumeInputRef}
                    type="number"
                    min={0}
                    step={0.1}
                    value={volumeDraft}
                    onChange={(e) => setVolumeDraft(e.target.value)}
                    onBlur={commitVolume}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitVolume()
                      if (e.key === 'Escape') {
                        setVolumeDraft(String(targetVolumeMl))
                        setEditingVolume(false)
                      }
                    }}
                    className="w-28 rounded-md border border-lab-border bg-lab-bg px-3 py-1.5 font-mono text-2xl font-semibold tabular-nums text-lab-highlight outline-none focus:ring-2 focus:ring-lab-accent/40"
                    aria-label="Target volume in milliliters"
                  />
                  <span className="font-mono text-base text-lab-muted">mL</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setVolumeDraft(String(targetVolumeMl))
                  setEditingVolume(true)
                }}
                className="group rounded-lg border border-lab-border bg-lab-surface px-5 py-4 text-left shadow-panel transition-colors hover:border-lab-accent/40"
              >
                <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-lab-muted">
                  Target volume
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-lab-highlight">
                  {targetVolumeMl}{' '}
                  <span className="text-base font-normal text-lab-muted">mL</span>
                </p>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-lab-accent/80 opacity-0 transition-opacity group-hover:opacity-100">
                  Click to edit
                </span>
              </button>
            )}
          </div>
        </header>

        <section className="overflow-hidden rounded-xl border border-lab-border bg-lab-surface shadow-panel">
          <div className="border-b border-lab-border bg-lab-elevated px-4 py-3 sm:px-6">
            <h2 className="font-sans text-sm font-semibold text-white">
              Formula line items
            </h2>
            <p className="mt-0.5 font-mono text-xs text-lab-muted">
              {lines.length} row{lines.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-lab-border font-mono text-[11px] font-medium uppercase tracking-wider text-lab-muted">
                  <th className="px-4 py-3 pl-6 sm:pl-8">Ingredient</th>
                  <th className="px-4 py-3 text-right">Weight (g)</th>
                  <th className="px-4 py-3 text-right">% of total</th>
                  <th className="w-12 px-2 py-3 pr-4 sm:pr-6">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((row) => {
                  const { violates } = ifraFlags[row.id] ?? {
                    violates: false,
                  }
                  const rowClasses = [
                    'border-b transition-colors',
                    violates
                      ? 'border-red-500/40 bg-red-950/25 hover:bg-red-950/35'
                      : 'border-lab-border/80 hover:bg-white/[0.02]',
                  ].join(' ')

                  const textMuted = violates ? 'text-red-300/90' : 'text-lab-muted'
                  const textMain = violates ? 'text-red-200' : 'text-lab-highlight'

                  const inputClasses = violates
                    ? 'w-28 rounded-md border border-red-500/60 bg-red-950/40 px-3 py-1.5 text-right font-mono text-sm tabular-nums text-red-100 outline-none transition-[border-color,box-shadow] focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'w-28 rounded-md border border-lab-border bg-lab-bg px-3 py-1.5 text-right font-mono text-sm tabular-nums text-lab-highlight outline-none transition-[border-color,box-shadow] focus:border-lab-accent focus:ring-1 focus:ring-lab-accent'

                  return (
                    <tr key={row.id} className={rowClasses}>
                      <td
                        className={`px-4 py-3.5 pl-6 font-medium sm:pl-8 ${textMain}`}
                      >
                        {row.ingredientName}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={row.weightGrams}
                          onChange={(e) => updateWeight(row.id, e.target.value)}
                          className={inputClasses}
                        />
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-mono text-sm tabular-nums ${textMuted}`}
                      >
                        <span className="inline-flex items-center justify-end gap-1.5">
                          {totalWeight > 0 ? (
                            <>
                              <span>{percents[row.id].toFixed(2)}%</span>
                              {violates ? (
                                <span
                                  className="text-base leading-none"
                                  title="Exceeds IFRA limit for this material"
                                  aria-hidden
                                >
                                  ⚠️
                                </span>
                              ) : null}
                            </>
                          ) : (
                            '—'
                          )}
                        </span>
                      </td>
                      <td className="px-2 py-3.5 pr-4 align-middle sm:pr-6">
                        <button
                          type="button"
                          onClick={() => deleteLine(row.id)}
                          className="flex h-8 w-8 items-center justify-center rounded text-lab-muted transition-colors hover:bg-white/10 hover:text-lab-highlight focus:outline-none focus:ring-2 focus:ring-lab-accent/50"
                          aria-label={`Remove ${row.ingredientName}`}
                        >
                          <span className="text-lg leading-none" aria-hidden>
                            ×
                          </span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-lab-border bg-lab-elevated/50 px-4 py-5 sm:px-6">
            <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-widest text-lab-muted">
              Add new ingredient
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 min-w-0">
                <span className="sr-only">Ingredient</span>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="w-full min-w-0 cursor-pointer rounded-md border border-lab-border bg-lab-bg px-3 py-2.5 text-sm text-lab-highlight outline-none transition-[border-color,box-shadow] focus:border-lab-accent focus:ring-1 focus:ring-lab-accent"
                >
                  {INGREDIENT_CATALOG.map(({ name: n }) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sm:w-36">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-lab-muted">
                  Grams
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={newGrams}
                  onChange={(e) => setNewGrams(e.target.value)}
                  className="w-full rounded-md border border-lab-border bg-lab-bg px-3 py-2.5 font-mono text-sm tabular-nums text-lab-highlight outline-none transition-[border-color,box-shadow] focus:border-lab-accent focus:ring-1 focus:ring-lab-accent"
                />
              </label>
              <button
                type="button"
                onClick={addLine}
                className="rounded-md bg-lab-accent px-5 py-2.5 text-sm font-semibold text-lab-bg transition-colors hover:bg-lab-accent-dim focus:outline-none focus:ring-2 focus:ring-lab-accent focus:ring-offset-2 focus:ring-offset-lab-surface"
              >
                Add to formula
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-4 rounded-xl border border-lab-border bg-lab-surface px-6 py-5 shadow-panel sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-lab-muted">
              Total weight
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">
              {totalWeight.toFixed(2)}{' '}
              <span className="text-lg font-normal text-lab-muted">g</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-mono text-xs text-lab-muted">Sum of line weights</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-lab-accent">
              {lines.length} component{lines.length === 1 ? '' : 's'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
