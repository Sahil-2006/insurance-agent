/* ═══════════════════════════════════════════════════════════════════════════
   components/dashboard/ExplanationCard.jsx
   ═══════════════════════════════════════════════════════════════════════════
   Displays the LLM-generated (or rule-based) explanation text and critic
   issues in a soft card below the policy table.
   ═══════════════════════════════════════════════════════════════════════════ */

import { MessageSquareText, AlertTriangle } from 'lucide-react';

export default function ExplanationCard({ explanation, criticIssues, regulatoryNote }) {
  if (!explanation && (!criticIssues || criticIssues.length === 0)) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4" id="explanation-section">
      {/* ── Explanation ────────────────────────────────────────────── */}
      {explanation && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareText size={15} style={{ color: 'var(--color-info)' }} />
            <h4
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
            >
              AI Explanation
            </h4>
          </div>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {explanation}
          </p>
          {regulatoryNote && (
            <p
              className="mt-3 text-[10.5px] italic leading-relaxed px-3 py-2 rounded-lg"
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              {regulatoryNote}
            </p>
          )}
        </div>
      )}

      {/* ── Critic Issues ──────────────────────────────────────────── */}
      {criticIssues && criticIssues.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: 'var(--color-warning)' }} />
            <h4
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
            >
              Critic Issues
            </h4>
          </div>
          <ul className="space-y-2">
            {criticIssues.map((issue, i) => (
              <li
                key={i}
                className="text-[12.5px] flex items-start gap-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--color-warning)' }}
                />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
