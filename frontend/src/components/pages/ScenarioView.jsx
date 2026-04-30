/* ═══════════════════════════════════════════════════════════════════════════
   components/pages/ScenarioView.jsx
   ═══════════════════════════════════════════════════════════════════════════
   Scenario Simulation results — shows the breakdown of simulated events
   (medical emergency, accident, income loss) that the backend uses to
   compute expected_loss.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Activity, AlertCircle } from 'lucide-react';

export default function ScenarioView({ scenarios }) {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="card p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
        <Activity size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Submit a recommendation request to view scenario simulations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="scenario-view">
      {scenarios.map((s, i) => (
        <div key={i} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} style={{ color: 'var(--color-warning)' }} />
              <h4
                className="text-sm font-semibold capitalize"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
              >
                {s.name}
              </h4>
            </div>
            <span className="badge badge-moderate">{s.probability} prob.</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3 text-[12px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Estimated Cost
              </p>
              <p className="font-semibold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>{s.cost}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Expected Impact
              </p>
              <p className="font-semibold mt-0.5" style={{ color: 'var(--color-danger)' }}>{s.impact}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Probability
              </p>
              <p className="font-semibold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>{s.probability}</p>
            </div>
          </div>

          {/* Reasons */}
          {s.reasons.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                Reasoning
              </p>
              <ul className="space-y-1">
                {s.reasons.map((r, j) => (
                  <li key={j} className="text-[12px] flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-sand)' }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
