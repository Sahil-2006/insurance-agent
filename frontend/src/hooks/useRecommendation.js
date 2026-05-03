/* ═══════════════════════════════════════════════════════════════════════════
   hooks/useRecommendation.js — Central state hook
   ═══════════════════════════════════════════════════════════════════════════
   Manages the full lifecycle:
     1. idle → loading → success / error  (recommendation)
     2. After success, automatically fetches AI insights from OpenAI
   Wraps the API calls and exposes pre-transformed data via the adapter.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo } from 'react';
import { fetchRecommendation, fetchScoreInsights } from '../api/client';
import {
  extractMetrics,
  extractPolicies,
  extractProfile,
  extractTrace,
  extractScenarios,
} from '../adapters/responseAdapter';

/**
 * @returns {object} — { status, rawResponse, metrics, policies, profile,
 *   trace, scenarios, explanation, criticIssues, insights, insightsLoading,
 *   submit, reset, userName }
 */
export function useRecommendation() {
  const [status, setStatus] = useState('idle');      // idle | loading | success | error
  const [rawResponse, setRawResponse] = useState(null);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  /* AI Insights state (from OpenAI) */
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  /* ── Memoized transforms — only recompute when rawResponse changes ── */
  const metrics    = useMemo(() => extractMetrics(rawResponse),   [rawResponse]);
  const policies   = useMemo(() => extractPolicies(rawResponse),  [rawResponse]);
  const profile    = useMemo(() => extractProfile(rawResponse),   [rawResponse]);
  const trace      = useMemo(() => extractTrace(rawResponse),     [rawResponse]);
  const scenarios  = useMemo(() => extractScenarios(rawResponse), [rawResponse]);
  const explanation   = rawResponse?.explanation ?? '';
  const criticIssues  = rawResponse?.critic_issues ?? [];
  const regulatoryNote = rawResponse?.regulatory_note ?? '';

  /* ── Submit a recommendation request ── */
  const submit = useCallback(async (userInput) => {
    setStatus('loading');
    setError(null);
    setInsights(null);
    setUserName(userInput.name || '');
    try {
      const res = await fetchRecommendation(userInput);
      setRawResponse(res);
      setStatus('success');

      /* ── Automatically fetch AI insights after success ── */
      setInsightsLoading(true);
      try {
        const insightsRes = await fetchScoreInsights(res);
        setInsights(insightsRes);
      } catch {
        /* AI insights are optional — fail silently */
      } finally {
        setInsightsLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  /* ── Reset to idle state ── */
  const reset = useCallback(() => {
    setStatus('idle');
    setRawResponse(null);
    setError(null);
    setInsights(null);
    setUserName('');
  }, []);

  return {
    status,
    error,
    rawResponse,
    metrics,
    policies,
    profile,
    trace,
    scenarios,
    explanation,
    criticIssues,
    regulatoryNote,
    insights,
    insightsLoading,
    userName,
    submit,
    reset,
  };
}
