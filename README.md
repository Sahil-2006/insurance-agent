# Autonomous Adaptive Insurance Planning Agent

An academic insurance recommendation prototype with a multi-agent style backend and a React dashboard frontend.

The system takes user financial and health inputs, builds a structured profile, computes a transparent risk score, simulates scenario loss, ranks local insurance policies, validates the result with a critic and compliance layer, stores memory for later recall, and returns an explainable recommendation.

## What The Project Does

- Collects user inputs through an API, CLI, and frontend form
- Builds a normalized user profile
- Computes a transparent risk score and label
- Simulates medical emergency, accident, and income loss scenarios
- Evaluates policies from a local JSON dataset
- Uses a critic to flag underinsurance, premium pressure, and mismatch
- Runs a lightweight adaptive learner over an internal NumPy model
- Saves recommendations in a local memory store
- Shows the full execution trace in the frontend

## Current Architecture

### Backend

The backend is organized as a tool-driven orchestration loop:

1. `ProfileUserTool` creates a structured `UserProfile`
2. `CalculateRiskTool` computes a rule-based risk score
3. `SimulateScenarioTool` estimates expected loss
4. `RecallMemoryTool` retrieves similar past recommendations
5. `EvaluatePoliciesTool` ranks policies with utility, suitability, affordability, coverage, and memory signals
6. `ValidateCriticTool` validates the top policy and can trigger replanning
7. `LearnAdaptiveTool` updates the local NumPy policy model from critic feedback
8. `CheckComplianceTool` runs deterministic IRDAI-style checks
9. `PersistMemoryTool` stores the profile and recommendation snapshot

The orchestration layer is in:

- [app/core/orchestrator.py](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/core/orchestrator.py)
- [app/core/tools.py](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/core/tools.py)
- [app/agents/goal_planner.py](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/agents/goal_planner.py)

### Frontend

The frontend is a Vite + React dashboard that consumes the recommendation API and presents the output in a structured deep-dive view.

Main UI pieces:

- Input form for user profile creation
- Metric cards for summary values
- Policy table for ranked policy comparison
- Deep-dive tabs for profile, risk, scenario simulation, policy evaluation, critic insights, recommendation, and pipeline trace
- Trace timeline that shows each backend step as it executes

Frontend files of interest:

- [frontend/src/App.jsx](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/frontend/src/App.jsx)
- [frontend/src/hooks/useRecommendation.js](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/frontend/src/hooks/useRecommendation.js)
- [frontend/src/api/client.js](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/frontend/src/api/client.js)
- [frontend/src/components/deepdive/PipelineTraceTab.jsx](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/frontend/src/components/deepdive/PipelineTraceTab.jsx)

## Why This Is Agentic

This is not a fully autonomous general-purpose agent, but it does have real agentic patterns:

- It runs a multi-step execution loop instead of a single function call
- It uses memory retrieval to influence new decisions
- It has critique and replanning behavior
- It can learn from feedback through an adaptive layer
- It exposes the full reasoning path in a trace

So the best description is:

- `multi-agent insurance recommendation prototype`
- `agentic decision-support system`
- `explainable workflow with feedback-aware orchestration`

## Backend Modules

### User Profiling

Converts raw input into a structured profile with:

- net worth
- liability ratio
- affordability band
- life stage
- health risk score

### Risk Analysis

Calculates a transparent score from:

- age
- dependents
- liabilities
- income
- net worth
- health-related inputs

### Scenario Simulation

Estimates expected loss for:

- medical emergency
- accident
- income loss

It uses trained local model weights when available, and falls back to rule-based logic when needed.

### Policy Evaluation

Loads policies from [app/data/policies.json](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/data/policies.json) and ranks them using:

- suitability to goal and life stage
- coverage fit
- affordability
- utility based on expected loss
- optional memory recall signals
- local RL-style AI scoring

### Critic

Checks the top ranked recommendations for:

- underinsurance
- high premium pressure
- poor goal or risk match

It can rerank a better candidate or request replanning.

### Memory Store

Stores prior user profiles and recommendations in:

- [app/data/memory_store.json](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/data/memory_store.json)

It now also supports lightweight similarity-based recall.

### Adaptive Learner

Uses critic feedback to adjust the local NumPy policy model and save updated weights in:

- [app/models/rl_weights.json](/Users/atharv/Desktop/SRM/Projects/Agentic/Autonomous-Adaptive-Insurance-Planning-Agent/app/models/rl_weights.json)

## Frontend Modules

The frontend displays:

- profile details
- risk score breakdown
- scenario breakdown
- ranked policies
- critic issues
- compliance notes
- memory snapshot
- agent trace

The pipeline trace view now reflects the added memory recall and reflection behavior.

## API

### `POST /recommend`

Request body example:

```json
{
  "age": 35,
  "income": 900000,
  "dependents": 2,
  "assets": 2000000,
  "liabilities": 1500000,
  "insurance_goal": "family_protection"
}
```

Important response fields:

- `user_profile`
- `risk_score`
- `risk_label`
- `expected_loss`
- `scenario_breakdown`
- `best_policy`
- `final_recommendation`
- `top_policies`
- `critic_issues`
- `confidence_score`
- `memory_snapshot`
- `explanation`
- `regulatory_note`
- `compliance_report`
- `agent_trace`

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run The Backend

```bash
uvicorn app.main:app --reload
```

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for the Swagger UI.

## Run The Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Run The CLI Demo

```bash
python3 -m app.main --age 35 --income 900000 --dependents 2 --assets 2000000 --liabilities 1500000 --insurance-goal family_protection
```

## Run Tests

```bash
pytest app/tests -q
```

## How The Recommendation Flow Works

1. The user submits profile information.
2. The backend normalizes the data into a `UserProfile`.
3. Risk is scored with transparent rules.
4. Scenario loss is estimated.
5. Previous similar cases are recalled from memory.
6. Policies are ranked using rules, utility, and feedback-aware signals.
7. The critic checks the top candidate and can trigger replanning.
8. Compliance is checked with deterministic IRDAI-style rules.
9. The adaptive learner updates the internal weights when feedback suggests a mistake.
10. The recommendation and trace are returned to the frontend.

## What Changed Recently

The newer logic made the system more agentic and more demo-friendly:

- The backend now has memory recall before policy ranking
- The planner can reflect on critic and compliance outcomes
- The pipeline can replan after weak or non-compliant output
- Policy ranking can incorporate similar historical cases
- The frontend trace can show the extra reasoning steps

## Limitations

- This is still a student prototype, not a production advisory system
- The policy dataset is local and synthetic
- The reasoning is mostly deterministic and explainable
- The LLM is only used for explanation text, not full autonomous planning
- Real insurance deployment would require current regulatory, product, and compliance review

## IRDAI Note

The project includes an IRDAI-style disclosure layer, but it is not a licensed insurer or advisory platform. Any real deployment in India should be reviewed against current IRDAI regulations and product disclosures.

## Repo Structure

```text
insurance-agent/
├── app/
│   ├── agents/
│   ├── core/
│   ├── data/
│   ├── llm/
│   ├── memory/
│   ├── models.py
│   ├── main.py
│   └── tests/
├── frontend/
├── README.md
├── requirements.txt
└── AGENTS.md
```
