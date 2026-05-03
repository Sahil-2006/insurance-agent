/* ═══════════════════════════════════════════════════════════════════════════
   components/dashboard/InsightsCard.jsx
   ═══════════════════════════════════════════════════════════════════════════
   Displays AI-generated per-score insights from OpenAI.
   Shows a loading shimmer while insights are being fetched,
   then renders each insight in its own mini-card.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Sparkles, Loader } from 'lucide-react';

/* Labels for the insight keys returned by the backend */
const INSIGHT_LABELS = {
  risk_score: 'Risk Score Reasoning',
  expected_loss: 'Expected Loss Analysis',
  confidence: 'AI Confidence Rationale',
  policy_recommendation: 'Policy Recommendation',
  utility_score: 'Utility Score Breakdown',
  overall_summary: 'Overall Summary',
};

/* Accent colors per insight key */
const INSIGHT_COLORS = {
  risk_score: 'var(--color-info)',
  expected_loss: 'var(--color-danger)',
  confidence: 'var(--color-success)',
  policy_recommendation: 'var(--color-sand-dark)',
  utility_score: 'var(--color-espresso-muted)',
  overall_summary: 'var(--color-info)',
};

export default function InsightsCard({ insights, insightsLoading }) {
  /* Not available or not fetched yet */
  if (!insights && !insightsLoading) return null;

  return (
    <div className="card p-5 mt-4" id="insights-section">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} style={{ color: 'var(--color-sand-dark)' }} />
        <h3
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
        >
          AI Score Insights
        </h3>
        {insightsLoading && (
          <span className="flex items-center gap-1.5 ml-auto text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <Loader size={12} className="animate-spin" />
            Generating insights…
          </span>
        )}
        {insights?.available && !insightsLoading && (
          <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{
            backgroundColor: 'var(--color-cream)',
            border: '1px solid var(--color-border-soft)',
            color: 'var(--color-text-secondary)',
          }}>
            Powered by {insights.provider || 'AI'}
          </span>
        )}
      </div>

      {/* Loading shimmer */}
      {insightsLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 rounded-full mb-2 w-1/4" style={{ backgroundColor: 'var(--color-cream-dark)' }} />
              <div className="h-3 rounded-full w-3/4" style={{ backgroundColor: 'var(--color-cream)' }} />
            </div>
          ))}
        </div>
      )}

      {/* Not available */}
      {insights && !insights.available && !insightsLoading && (
        <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
          AI insights are unavailable. Set <code className="text-[11px] px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-cream)' }}>OPENAI_API_KEY</code> in your <code className="text-[11px] px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-cream)' }}>.env</code> file to enable this feature.
        </p>
      )}

      {/* Insights grid */}
      {insights?.available && !insightsLoading && insights.insights && (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(insights.insights).map(([key, text]) => {
            const label = INSIGHT_LABELS[key] || key.replace(/_/g, ' ');
            const color = INSIGHT_COLORS[key] || 'var(--color-info)';
            return (
              <div
                key={key}
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color }}>
                  {label}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
