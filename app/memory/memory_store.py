"""Simple file-backed memory store for profiles and recommendations."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from app.models import RankedPolicy, UserProfile


class MemoryStore:
    """Persist user profiles and recommendation history in a local JSON file."""

    def __init__(self, storage_path: Path | None = None) -> None:
        default_path = Path(__file__).resolve().parent.parent / "data" / "memory_store.json"
        self.storage_path = storage_path or default_path

    def save_user_profile(self, profile: UserProfile) -> str:
        """Save a user profile and return its deterministic signature."""
        store = self._read_store()
        profile_signature = self._build_profile_signature(profile)
        store["profiles"].append(
            {
                "profile_signature": profile_signature,
                "profile": profile.model_dump(),
            }
        )
        self._write_store(store)
        return profile_signature

    def save_recommendation(self, profile_signature: str, recommendation: RankedPolicy) -> None:
        """Save a recommendation linked to a profile signature."""
        store = self._read_store()
        store["recommendations"].append(
            {
                "profile_signature": profile_signature,
                "recommendation": recommendation.model_dump(),
            }
        )
        self._write_store(store)

    def get_previous_recommendations(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Return recent recommendation history, failing safely on malformed data."""
        store = self._read_store()
        recommendations = store.get("recommendations", [])
        return recommendations[-limit:]

    def get_similar_recommendations(self, profile: UserProfile, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Return the most similar historical recommendations for the current profile.

        The similarity score is intentionally simple and explainable so it can be
        used as a lightweight memory retrieval signal during planning.
        """
        store = self._read_store()
        profiles_by_signature = {
            item.get("profile_signature"): item.get("profile")
            for item in store.get("profiles", [])
            if isinstance(item, dict)
        }

        scored_matches: List[Dict[str, Any]] = []
        for recommendation in store.get("recommendations", []):
            if not isinstance(recommendation, dict):
                continue

            signature = recommendation.get("profile_signature")
            stored_profile_data = profiles_by_signature.get(signature)
            if not isinstance(stored_profile_data, dict):
                continue

            score = self._profile_similarity(profile, stored_profile_data)
            scored_matches.append(
                {
                    "profile_signature": signature,
                    "similarity_score": round(score, 4),
                    "profile": stored_profile_data,
                    "recommendation": recommendation.get("recommendation"),
                }
            )

        scored_matches.sort(key=lambda item: item["similarity_score"], reverse=True)
        return scored_matches[:limit]

    def _build_profile_signature(self, profile: UserProfile) -> str:
        """Create a lightweight deterministic signature from core inputs."""
        return (
            f"{profile.age}-{int(profile.income)}-{profile.dependents}-"
            f"{int(profile.liabilities)}-{profile.insurance_goal}"
        )

    def _profile_similarity(self, profile: UserProfile, stored_profile: Dict[str, Any]) -> float:
        """Compute a simple similarity score between two profiles."""
        age_gap = abs(profile.age - int(stored_profile.get("age", profile.age))) / 70.0
        income_gap = abs(profile.income - float(stored_profile.get("income", profile.income))) / max(profile.income, 1.0)
        dependent_gap = abs(profile.dependents - int(stored_profile.get("dependents", profile.dependents))) / 10.0
        liability_gap = abs(profile.liabilities - float(stored_profile.get("liabilities", profile.liabilities))) / max(profile.income, 1.0)
        goal_match = 0.0 if profile.insurance_goal == stored_profile.get("insurance_goal") else 1.0

        distance = min(1.0, (age_gap * 0.25) + (income_gap * 0.25) + (dependent_gap * 0.15) + (liability_gap * 0.20) + (goal_match * 0.15))
        return max(0.0, 1.0 - distance)

    def _read_store(self) -> Dict[str, List[Dict[str, Any]]]:
        """Read the store or initialize an empty structure when needed."""
        if not self.storage_path.exists():
            return self._empty_store()

        try:
            with self.storage_path.open("r", encoding="utf-8") as file:
                raw_data = json.load(file)
        except (json.JSONDecodeError, OSError):
            return self._empty_store()

        profiles = raw_data.get("profiles", [])
        recommendations = raw_data.get("recommendations", [])
        return {
            "profiles": profiles if isinstance(profiles, list) else [],
            "recommendations": recommendations if isinstance(recommendations, list) else [],
        }

    def _write_store(self, store: Dict[str, List[Dict[str, Any]]]) -> None:
        """Persist the memory store to disk."""
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        with self.storage_path.open("w", encoding="utf-8") as file:
            json.dump(store, file, indent=2)

    def _empty_store(self) -> Dict[str, List[Dict[str, Any]]]:
        """Return the default store structure."""
        # TODO: Add session-aware memory and richer retrieval strategies.
        # TODO: Support vector memory or external persistence backends.
        return {"profiles": [], "recommendations": []}
