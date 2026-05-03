/* ═══════════════════════════════════════════════════════════════════════════
   components/dashboard/DashboardView.jsx
   ═══════════════════════════════════════════════════════════════════════════
   Main "Dashboard" page — results only. No input form here.
   When no results exist, shows a prompt to navigate to User Profiling.
   When results are ready: MetricCards → PolicyTable → InsightsCard →
   ExplanationCard.
   ═══════════════════════════════════════════════════════════════════════════ */

import { UserCircle } from 'lucide-react';
import MetricCards from './MetricCards';
import PolicyTable from './PolicyTable';
import ExplanationCard from './ExplanationCard';
import InsightsCard from './InsightsCard';

export default function DashboardView({
  status,
  metrics,
  policies,
  explanation,
  criticIssues,
  regulatoryNote,
  insights,
  insightsLoading,
  userName,
  onGoToProfiler,
}) {
  const hasResults = status === 'success';

  return (
    <div id="dashboard-view">
      {/* ── Loading State ──────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="card p-12 text-center" id="loading-state">
          <div
            className="w-8 h-8 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: '3px solid var(--color-border-soft)',
              borderTopColor: 'var(--color-sand)',
            }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Agents are processing your request…
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Profiling → Risk → Simulation → Evaluation → Critique
          </p>
        </div>
      )}

      {/* ── Idle State — direct user to Profiling tab ──────────────── */}
      {status === 'idle' && (
        <div className="card p-12 text-center" id="idle-state">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-cream), var(--color-cream-dark))',
              border: '1px solid var(--color-border-soft)',
            }}
          >
            <span className="text-2xl">🛡️</span>
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}
          >
            No Results Yet
          </h3>
          <p className="text-[13px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Head to <strong>User Profiling</strong> to enter your details and run the multi-agent pipeline.
          </p>
          <button className="btn-primary" onClick={onGoToProfiler}>
            <UserCircle size={15} />
            Go to User Profiling
          </button>
        </div>
      )}

      {/* ── Error State ────────────────────────────────────────────── */}
      {status === 'error' && (
        <div className="card p-8 text-center" id="error-state" style={{ borderTop: '3px solid var(--color-danger)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-danger)' }}>
            Something went wrong
          </p>
          <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            Please check the backend is running on port 8000 and try again.
          </p>
          <button className="btn-soft" onClick={onGoToProfiler}>
            <UserCircle size={14} />
            Back to Profiling
          </button>
        </div>
      )}

      {/* ── Success State: Results ─────────────────────────────────── */}
      {hasResults && (
        <>
          {/* Greeting */}
          {userName && (
            <p className="text-[13px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Showing results for <strong style={{ color: 'var(--color-text-primary)' }}>{userName}</strong>
            </p>
          )}

          <MetricCards metrics={metrics} />
          <PolicyTable policies={policies} />
          <InsightsCard insights={insights} insightsLoading={insightsLoading} />
          <ExplanationCard
            explanation={explanation}
            criticIssues={criticIssues}
            regulatoryNote={regulatoryNote}
          />
        </>
      )}
    </div>
  );
}
