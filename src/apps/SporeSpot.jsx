import { useMemo, useState } from 'react'

const INITIAL_SPOTS = [
  {
    id: 's1',
    spotName: 'North Ridge Morels',
    coordinates: '45.5123, -122.6587',
    targetSpecies: 'Morel (Morchella)',
    weatherTrigger: 'Alert if Rain > 1 inch in 3 days',
  },
  {
    id: 's2',
    spotName: 'Cedar Hollow Chanterelles',
    coordinates: '47.6062, -122.3321',
    targetSpecies: 'Chanterelle (Cantharellus)',
    weatherTrigger: 'Alert if Humidity > 85% for 24h',
  },
  {
    id: 's3',
    spotName: 'South Slope Porcini',
    coordinates: '44.0521, -123.0868',
    targetSpecies: 'Porcini (Boletus edulis)',
    weatherTrigger: 'Alert if Night Lows > 50°F after rain',
  },
]

function nextId() {
  return crypto.randomUUID?.() ?? String(Date.now() + Math.random())
}

export default function SporeSpot({ onBackToSuite }) {
  const [spots, setSpots] = useState(INITIAL_SPOTS)
  const [triggeredSpotId, setTriggeredSpotId] = useState(null)
  const [notification, setNotification] = useState(null)

  const [spotName, setSpotName] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [targetSpecies, setTargetSpecies] = useState('')
  const [weatherTrigger, setWeatherTrigger] = useState('')

  const canAdd = useMemo(() => {
    return (
      spotName.trim().length > 0 &&
      coordinates.trim().length > 0 &&
      targetSpecies.trim().length > 0 &&
      weatherTrigger.trim().length > 0
    )
  }, [spotName, coordinates, targetSpecies, weatherTrigger])

  function simulateTrigger(spot) {
    setTriggeredSpotId(spot.id)
    setNotification({
      id: nextId(),
      message: `Bingo! Perfect humidity reached at ${spot.spotName}. Time to forage!`,
    })
    window.clearTimeout(simulateTrigger._t)
    simulateTrigger._t = window.setTimeout(() => setNotification(null), 4200)
  }

  function addSpot(e) {
    e.preventDefault()
    if (!canAdd) return
    const newSpot = {
      id: nextId(),
      spotName: spotName.trim(),
      coordinates: coordinates.trim(),
      targetSpecies: targetSpecies.trim(),
      weatherTrigger: weatherTrigger.trim(),
    }
    setSpots((prev) => [newSpot, ...prev])
    setSpotName('')
    setCoordinates('')
    setTargetSpecies('')
    setWeatherTrigger('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06120b] via-[#07160d] to-[#030a06] text-emerald-50">
      {/* Fake push notification */}
      <div
        className={[
          'fixed left-0 right-0 top-0 z-50',
          'transition-transform duration-500',
          notification ? 'translate-y-0' : '-translate-y-full',
        ].join(' ')}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-4 shadow-[0_18px_60px_rgba(16,185,129,0.18)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Field Alert
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-50">
              {notification?.message}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        {typeof onBackToSuite === 'function' ? (
          <nav className="mb-6" aria-label="Suite navigation">
            <button
              type="button"
              onClick={onBackToSuite}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-[#06120b]/90 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-200/90 transition hover:border-emerald-300/45 hover:text-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
            >
              <span aria-hidden="true">←</span>
              All apps
            </button>
          </nav>
        ) : null}
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
              SporeSpot
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-50 sm:text-4xl">
              Secret Spots Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/70">
              Keep your foraging locations private. Simulate weather triggers until maps and live forecasts land.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/10 bg-white/5 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-medium text-emerald-100/70">Spots tracked</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-emerald-50">
              {spots.length}
            </p>
          </div>
        </header>

        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-200/10 bg-white/5 shadow-[0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.45)]">
          <div className="border-b border-emerald-200/10 bg-white/5 px-6 py-5">
            <h2 className="text-sm font-semibold text-emerald-50">Add new secret spot</h2>
            <p className="mt-1 text-xs text-emerald-100/70">
              For now, coordinates are just a string (dummy lat/long).
            </p>
          </div>

          <form onSubmit={addSpot} className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                Spot name
              </span>
              <input
                value={spotName}
                onChange={(e) => setSpotName(e.target.value)}
                placeholder="e.g., North Ridge Morels"
                className="mt-2 w-full rounded-xl border border-emerald-200/10 bg-[#06120b] px-4 py-3 text-sm text-emerald-50 outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-400/20"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                Coordinates
              </span>
              <input
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="e.g., 45.5123, -122.6587"
                className="mt-2 w-full rounded-xl border border-emerald-200/10 bg-[#06120b] px-4 py-3 text-sm text-emerald-50 outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-400/20"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                Target species
              </span>
              <input
                value={targetSpecies}
                onChange={(e) => setTargetSpecies(e.target.value)}
                placeholder="e.g., Chanterelle (Cantharellus)"
                className="mt-2 w-full rounded-xl border border-emerald-200/10 bg-[#06120b] px-4 py-3 text-sm text-emerald-50 outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-400/20"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100/70">
                Weather trigger
              </span>
              <input
                value={weatherTrigger}
                onChange={(e) => setWeatherTrigger(e.target.value)}
                placeholder="e.g., Alert if Rain > 1 inch in 3 days"
                className="mt-2 w-full rounded-xl border border-emerald-200/10 bg-[#06120b] px-4 py-3 text-sm text-emerald-50 outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-400/20"
              />
            </label>

            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <p className="text-xs text-emerald-100/60">
                Cards will light up bright green when conditions are “met”.
              </p>
              <button
                type="submit"
                disabled={!canAdd}
                className={[
                  'rounded-xl px-5 py-3 text-sm font-semibold',
                  'transition',
                  canAdd
                    ? 'bg-emerald-400 text-[#06120b] hover:bg-emerald-300'
                    : 'cursor-not-allowed bg-emerald-400/20 text-emerald-100/40',
                ].join(' ')}
              >
                Add spot
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {spots.map((s) => {
            const triggered = s.id === triggeredSpotId
            return (
              <article
                key={s.id}
                className={[
                  'rounded-3xl border p-6 shadow-[0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.45)]',
                  'transition-colors',
                  triggered
                    ? 'border-emerald-300/40 bg-emerald-400/20'
                    : 'border-emerald-200/10 bg-white/5',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-emerald-50">
                      {s.spotName}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-100/70">
                      {s.targetSpecies}
                    </p>
                  </div>
                  {triggered ? (
                    <span className="shrink-0 rounded-full bg-emerald-300 px-3 py-1 text-xs font-semibold text-[#06120b]">
                      Conditions Met!
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-emerald-200/10 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-100/70">
                      Watching…
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-emerald-200/10 bg-[#06120b]/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/60">
                      Coordinates
                    </p>
                    <p className="mt-1 font-mono text-sm tabular-nums text-emerald-50/90">
                      {s.coordinates}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200/10 bg-[#06120b]/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/60">
                      Weather trigger
                    </p>
                    <p className="mt-1 text-sm text-emerald-50/90">{s.weatherTrigger}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xs text-emerald-100/60">
                    No live weather yet — simulate to test workflows.
                  </p>
                  <button
                    type="button"
                    onClick={() => simulateTrigger(s)}
                    className={[
                      'rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                      triggered
                        ? 'bg-emerald-300 text-[#06120b] hover:bg-emerald-200'
                        : 'bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25',
                    ].join(' ')}
                  >
                    Simulate Weather Trigger
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}

