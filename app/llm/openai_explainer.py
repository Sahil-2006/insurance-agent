"""OpenAI-based score insights generator.

Generates per-score AI reasoning insights using the OpenAI Chat Completions
API.  Activated by setting the OPENAI_API_KEY environment variable.

Falls back gracefully if the key is missing or the call fails — callers
receive None and should display the deterministic explanation instead.
"""

from __future__ import annotations

import os
from typing import Optional


def openai_key_present() -> bool:
    return bool(os.getenv("OPENAI_API_KEY"))


def generate_score_insights(*, prompt: str, model: str = "gpt-4o-mini") -> Optional[str]:
    """Call OpenAI Chat Completions and return the assistant text, or None."""

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI  # type: ignore
    except Exception as e:
        print(f"OpenAI Import Error: {e}")
        return None

    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert insurance advisor AI. Provide clear, concise, "
                        "user-friendly reasoning for the scores presented. Use ₹ for INR "
                        "currency. Do NOT add disclaimers or mention internal agent names. "
                        "Keep each insight to 1-3 sentences."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=800,
        )
        text = response.choices[0].message.content
        return text.strip() if text else None
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return None
