import { useMemo, useState } from 'react'

const CONTRACTS = [
  {
    id: 'c1',
    hospitalName: 'St. Aurora Medical Center',
    unitFloor: 'Med-Surg · 4W',
    patientRatio: '1:6',
    toxicityRating: 3,
    weeklyPay: 3200,
  },
  {
    id: 'c2',
    hospitalName: 'Harborline Regional',
    unitFloor: 'ICU · 2N',
    patientRatio: '1:2',
    toxicityRating: 2,
    weeklyPay: 4100,
  },
  {
    id: 'c3',
    hospitalName: 'Summit Valley Hospital',
    unitFloor: 'ED · Trauma Bay',
    patientRatio: '1:4',
    toxicityRating: 4,
    weeklyPay: 3800,
  },
  {
    id: 'c4',
    hospitalName: 'Cedar Grove Health',
    unitFloor: 'Telemetry · 5E',
    patientRatio: '1:5',
    toxicityRating: 2,
    weeklyPay: 3450,
  },
  {
    id: 'c5',
    hospitalName: 'Northbridge University Hospital',
    unitFloor: 'NICU · 3S',
    patientRatio: '1:2',
    toxicityRating: 1,
    weeklyPay: 4650,
  },
  {
    id: 'c6',
    hospitalName: 'Riverbend Community',
    unitFloor: 'Med-Surg · 3E',
    patientRatio: '1:7',
    toxicityRating: 5,
    weeklyPay: 2900,
  },
]

function formatMoneyUSD(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function Stars({ value }) {
  const full = Math.max(0, Math.min(5, Number(value) || 0))
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${full} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? 'text-sky-600' : 'text-slate-300'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function ShiftNomad() {
  const minPayFloor = 2400
  const maxPayCeil = 5200

  const [contracts, setContracts] = useState(CONTRACTS)
  const [minWeeklyPay, setMinWeeklyPay] = useState(3200)
  const [maxToxicity, setMaxToxicity] = useState(3)
  const [hospitalName, setHospitalName] = useState('')
  const [unitFloor, setUnitFloor] = useState('')
  const [patientRatio, setPatientRatio] = useState('')
  const [weeklyPayInput, setWeeklyPayInput] = useState('')
  const [toxicityInput, setToxicityInput] = useState('3')

  const filtered = useMemo(() => {
    return contracts.filter(
      (c) => c.weeklyPay >= minWeeklyPay && c.toxicityRating <= maxToxicity,
    )
  }, [contracts, minWeeklyPay, maxToxicity])

  const canSubmit =
    hospitalName.trim().length > 0 &&
    unitFloor.trim().length > 0 &&
    patientRatio.trim().length > 0 &&
    weeklyPayInput.trim().length > 0

  function handleSubmitReview(e) {
    e.preventDefault()
    if (!canSubmit) return

    const parsedPay = Number(weeklyPayInput)
    const parsedToxicity = Number(toxicityInput)
    if (!Number.isFinite(parsedPay) || parsedPay <= 0) return
    if (!Number.isInteger(parsedToxicity) || parsedToxicity < 1 || parsedToxicity > 5) {
      return
    }

    const newContract = {
      id: `u-${Date.now()}`,
      hospitalName: hospitalName.trim(),
      unitFloor: unitFloor.trim(),
      patientRatio: patientRatio.trim(),
      weeklyPay: parsedPay,
      toxicityRating: parsedToxicity,
    }

    setContracts((prev) => [newContract, ...prev])
    setHospitalName('')
    setUnitFloor('')
    setPatientRatio('')
    setWeeklyPayInput('')
    setToxicityInput('3')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              ShiftNomad
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Unit Vitals
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              A clinical dashboard for travel nurses to filter contracts by safety and pay.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_rgba(2,132,199,0.10)] backdrop-blur">
            <p className="text-xs font-medium text-slate-500">Matches</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {filtered.length}{' '}
              <span className="text-base font-normal text-slate-500">
                / {contracts.length}
              </span>
            </p>
          </div>
        </header>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_50px_rgba(2,132,199,0.12)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Smart Filter</h2>
            <p className="mt-1 text-xs text-slate-600">
              Dial in strict requirements — contracts update instantly.
            </p>
          </div>

          <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold text-slate-900">Minimum weekly pay</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-sky-700">
                  {formatMoneyUSD(minWeeklyPay)}
                </p>
              </div>
              <input
                type="range"
                min={minPayFloor}
                max={maxPayCeil}
                step={50}
                value={minWeeklyPay}
                onChange={(e) => setMinWeeklyPay(Number(e.target.value))}
                className="mt-4 w-full accent-sky-600"
                aria-label="Minimum weekly pay"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{formatMoneyUSD(minPayFloor)}</span>
                <span>{formatMoneyUSD(maxPayCeil)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold text-slate-900">Maximum toxicity</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-sky-700">
                  ≤ {maxToxicity}★
                </p>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={maxToxicity}
                onChange={(e) => setMaxToxicity(Number(e.target.value))}
                className="mt-4 w-full accent-sky-600"
                aria-label="Maximum toxicity rating"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>1★</span>
                <span>5★</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_50px_rgba(2,132,199,0.12)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Submit a Review</h2>
            <p className="mt-1 text-xs text-slate-600">
              Add your own contract data to the Unit Vitals feed.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hospital name
              </span>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g., Metro General Hospital"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Unit / floor
              </span>
              <input
                type="text"
                value={unitFloor}
                onChange={(e) => setUnitFloor(e.target.value)}
                placeholder="e.g., ICU · 2N"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Patient ratio
              </span>
              <input
                type="text"
                value={patientRatio}
                onChange={(e) => setPatientRatio(e.target.value)}
                placeholder="e.g., 1:5"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Weekly pay (USD)
              </span>
              <input
                type="number"
                min={0}
                step={50}
                value={weeklyPayInput}
                onChange={(e) => setWeeklyPayInput(e.target.value)}
                placeholder="e.g., 3500"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Toxicity rating
              </span>
              <select
                value={toxicityInput}
                onChange={(e) => setToxicityInput(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              >
                <option value="1">1 ★</option>
                <option value="2">2 ★★</option>
                <option value="3">3 ★★★</option>
                <option value="4">4 ★★★★</option>
                <option value="5">5 ★★★★★</option>
              </select>
            </label>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!canSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_rgba(2,132,199,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(15,23,42,0.04),0_22px_60px_rgba(2,132,199,0.16)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {c.hospitalName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{c.unitFloor}</p>
                </div>
                <div className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                  {c.patientRatio}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Weekly pay
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
                    {formatMoneyUSD(c.weeklyPay)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Toxicity
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <Stars value={c.toxicityRating} />
                    <span className="font-mono text-xs font-semibold tabular-nums text-slate-700">
                      {c.toxicityRating}/5
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                  Unit vitals summary
                </span>
                <span className="font-mono">Filtered live</span>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            <p className="text-sm font-medium text-slate-900">No matches</p>
            <p className="mt-1 text-sm">
              Try lowering the minimum pay or allowing a higher toxicity rating.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

