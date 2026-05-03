/* ═══════════════════════════════════════════════════════════════════════════
   components/pages/TraceView.jsx
   ═══════════════════════════════════════════════════════════════════════════
   Agent Trace — a timeline-style card view showing each agent's execution
   in the multi-agent pipeline. Displays agent name, input/output summaries,
   and duration in milliseconds.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Workflow, Clock, ArrowRight } from 'lucide-react';

export default function TraceView({ trace }) {
  if (!trace || trace.length === 0) {
    return (
      <div className="card p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
        <Workflow size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Submit a recommendation request to view the agent execution trace.</p>
      </div>
    );
  }

  /* Total pipeline time */
  const totalMs = trace.reduce((sum, t) => sum + Number(t.durationMs), 0);

  return (
    <div id="trace-view">
      {/* Summary bar */}
      <div
        className="card flex items-center justify-between px-5 py-3 mb-4"
        style={{ borderLeft: '3px solid var(--color-info)' }}
      >
        <div className="flex items-center gap-2">
          <Workflow size={15} style={{ color: 'var(--color-info)' }} />
          <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Pipeline Execution
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
          <Clock size={12} />
          <span className="font-mono font-semibold">{totalMs.toFixed(0)}ms</span>
          <span>total · {trace.length} agents</span>
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {trace.map((t, i) => {
          /* Width of the bar relative to longest agent */
          const maxMs = Math.max(...trace.map((x) => Number(x.durationMs)), 1);
          const barPct = ((Number(t.durationMs) / maxMs) * 100).toFixed(0);

          return (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      color: 'var(--color-espresso)',
                      border: '1px solid var(--color-border-soft)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {t.agent}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold" style={{ color: 'var(--color-info)' }}>
                  {t.durationMs}ms
                </span>
              </div>

              {/* Duration bar */}
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: 'var(--color-cream-dark)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    background: 'linear-gradient(90deg, var(--color-sand-light), var(--color-sand))',
                  }}
                />
              </div>

              {/* Input → Output */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-[11px]">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Input
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{t.input}</p>
                </div>
                <ArrowRight size={14} className="self-center" style={{ color: 'var(--color-border-soft)' }} />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Output
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{t.output}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
