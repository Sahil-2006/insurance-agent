/* ═══════════════════════════════════════════════════════════════════════════
   components/dashboard/PolicyTable.jsx
   ═══════════════════════════════════════════════════════════════════════════
   "Top Recommended Policies" table inside a tactile card.
   Columns: Policy Name, Type, Coverage, Premium, Utility Score, Actions.
   Expandable row detail on "Details" click.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function PolicyTable({ policies }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!policies || policies.length === 0) return null;

  const toggle = (i) => setExpandedIdx((prev) => (prev === i ? null : i));

  return (
    <div className="card overflow-hidden" id="policy-table">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border-soft)' }}>
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
        >
          Top Recommended Policies
        </h3>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--color-cream)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-soft)',
          }}
        >
          {policies.length} result{policies.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <table className="w-full text-[13px]" style={{ color: 'var(--color-text-primary)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-text-secondary)' }}>
            <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Policy Name</th>
            <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Type</th>
            <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Coverage</th>
            <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Premium</th>
            <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Utility</th>
            <th className="text-center px-5 py-3 font-semibold text-[11px] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p, i) => (
            <>
              {/* ── Main Row ──────────────────────────────────────── */}
              <tr
                key={`row-${i}`}
                className="transition-colors duration-150 cursor-pointer"
                style={{
                  borderBottom: '1px solid var(--color-border-soft)',
                  backgroundColor: expandedIdx === i ? 'var(--color-cream)' : 'transparent',
                }}
                onClick={() => toggle(i)}
                onMouseEnter={(e) => { if (expandedIdx !== i) e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'; }}
                onMouseLeave={(e) => { if (expandedIdx !== i) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3 capitalize" style={{ color: 'var(--color-text-secondary)' }}>{p.type}</td>
                <td className="px-5 py-3 text-right font-mono text-[12px]">{p.coverage}</td>
                <td className="px-5 py-3 text-right font-mono text-[12px]">{p.premium}</td>
                <td className="px-5 py-3 text-right">
                  <span className="font-semibold">{p.utilityScore}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    className="btn-soft text-[11px] py-1 px-3"
                    onClick={(e) => { e.stopPropagation(); toggle(i); }}
                  >
                    {expandedIdx === i ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Details
                  </button>
                </td>
              </tr>

              {/* ── Expanded Detail Row ───────────────────────────── */}
              {expandedIdx === i && (
                <tr key={`detail-${i}`} style={{ backgroundColor: 'var(--color-cream)' }}>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="grid grid-cols-3 gap-4 text-[12px]">
                      {/* Score Breakdown */}
                      <div>
                        <p className="font-semibold mb-1 text-[11px] uppercase" style={{ color: 'var(--color-text-muted)' }}>Score Breakdown</p>
                        <div className="space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <p>Total: <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{p.totalScore}</span></p>
                          <p>AI Score: <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{p.aiScore}</span></p>
                          <p>Utility: <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{p.utilityScore}</span></p>
                        </div>
                      </div>

                      {/* Tradeoff Summary */}
                      <div>
                        <p className="font-semibold mb-1 text-[11px] uppercase" style={{ color: 'var(--color-text-muted)' }}>Tradeoff</p>
                        <p style={{ color: 'var(--color-text-secondary)' }}>{p.tradeoff}</p>
                      </div>

                      {/* Explanation Points */}
                      <div>
                        <p className="font-semibold mb-1 text-[11px] uppercase" style={{ color: 'var(--color-text-muted)' }}>Reasoning</p>
                        <ul className="list-disc list-inside space-y-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          {p.explanationPoints.map((pt, j) => (
                            <li key={j}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
