# NexusAI — Deal Intelligence Agent
> **A persistent-memory AI agent for sales and product/strategy teams that understands the full history of a deal, remembers previous interactions, surfaces critical context, identifies risks, and prepares decision-ready intelligence.**

Built for the **“AI Agents That Learn Using Hindsight”** challenge.

---

## 1. Problem
In complex B2B sales cycles spanning weeks or months:
- Critical objections and customer constraints are lost across disparate call recordings and notes.
- Verbal commitments made in earlier meetings (e.g. key escrow, latency guarantees, dedicated TAM) are forgotten or missed.
- Changing stakeholder dynamics (e.g. newly surfaced InfoSec blockers favoring incumbent competitors) slip past account executives.
- Standard CRMs only store static fields, leaving sales reps underprepared before executive meetings and deals vulnerable to stalling.

## 2. Solution
**NexusAI Deal Intelligence Agent** makes **persistent memory the core value of the system**:
- **Automatic Memory Retention**: Every recorded interaction, objection, competitor mention, and commitment is automatically extracted and retained into an isolated Hindsight memory bank per deal (`deal-bank-{dealId}`).
- **Memory-Grounded Intelligence**: Rather than hallucinating, the agent recalls historical context and categorizes intelligence into **Confirmed Facts**, **Inferred Insights**, and **Unknown Information Gaps**.
- **1-Click Meeting Preparation**: Synthesizes open commitments, pain points, objections to anticipate, and suggested questions before critical meetings.
- **Deal Risk Sentinel**: Monitors stalled stages, silence > 14 days, and negative signals, generating automated **Recommended Rescue Plays**.
- **Strict Indian Rupee (INR ₹) Compliance**: All deal amounts and pipeline analytics are natively structured and formatted in INR (e.g. ₹2.84 Cr, ₹1.50 Cr, ₹25 Lakhs).

---

## 3. Architecture

```
                  ┌────────────────────────────────────────────────────────┐
                  │              NexusAI Enterprise UI                     │
                  │   (Dashboard, Apollo Deals View, Deal Risk Sentinel,   │
                  │       Deal Detail Hero Workspace, Settings Hub)        │
                  └──────────────────────────┬─────────────────────────────┘
                                             │ HTTP / JSON
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 Next.js 14 API Layer                   │
                  │  /api/deals, /api/interactions, /api/hindsight/*, etc. │
                  └──────┬───────────────────┬──────────────────────┬──────┘
                         │                   │                      │
                         ▼                   ▼                      ▼
               ┌───────────────────┐ ┌───────────────┐ ┌────────────────────┐
               │ File-Backed Rel.  │ │   Hindsight   │ │     Groq Cloud     │
               │  Database Engine  │ │  Memory Layer │ │    LLM Provider    │
               │ (Deals, Contacts, │ │ (Retain/Recall│ │(llama-3.3-70b-vers)│
               │ Tasks, Timeline)  │ │  Memory Bank) │ │ (or Grounded Rule) │
               └───────────────────┘ └───────────────┘ └────────────────────┘
```

---

## 4. How Hindsight Memory is Used

Hindsight is the central intelligence engine:
- **Memory Banks**: Organized with isolated banks per deal: `deal-bank-{dealId}` (e.g. `deal-bank-deal-1`).
- **Retain**: Triggered immediately when meetings, notes, calls, or demos are recorded. Converts natural language summaries, objections, and promises into durable memories.
- **Recall**: Performs semantic and keyword retrieval against the deal's memory bank using TEMPR strategies. Returns ranked memories with confidence scores.
- **Memory Taxonomy**:
  - `World`: Market facts, client infrastructure, regulatory constraints (e.g. RBI Mumbai residency).
  - `Experience`: Prior commitments, successful/failed tactics, pricing agreements.
  - `Observation`: Stakeholder sentiment, objections, competitor moves.
- **Real Cloud Connection & Resilient Local Fallback**:
  - Uses `@vectorize-io/hindsight-client` and points to `https://api.hindsight.vectorize.io` when `HINDSIGHT_API_KEY` is provided.
  - Features an embedded persistent bank engine that provides identical Retain/Recall/Reflect semantics out-of-the-box before keys are entered.

---

## 5. Primary Demo Flow (Judge Walkthrough in 2 Minutes)

1. **Dashboard Overview**:
   - Inspect the **NexusAI Dashboard** (Image 1 replica): Revenue in INR (`₹2.84 Cr`), Pipeline value (`₹8.2 Cr`), interactive dual-curve Revenue Growth chart with tooltip, mini status bars, and active deals table.
   - Interact with the embedded **NexusAI Copilot** on the right column.

2. **Deals Table & Filtering**:
   - Switch to **Deals** (Image 2 replica): View collapsible filter sidebar (Company, Owner, Stage, Amount), search deals, and view deals in INR.

3. **Deal Risk Sentinel**:
   - Open **Deal Risk Agent** (Image 3 replica): View Kanban pipeline (Qualification, Discovery, Proposal, Negotiation, Closed Won) with High Risk, Silence, and Weak Engagement badges.
   - Click **Execute Play** on the "Re-engage Aurora Solutions" card. Observe automated email generation, BYOK attachment, and memory retention.

4. **Deal Intelligence Workspace (Hero Screen)**:
   - Click **Aurora Solutions**:
     - **Deal Intelligence Tab**: Inspect executive summary, hallucination-controlled grounding (**Confirmed**, **Inferred**, **Unknown**), known objections, and deal risks.
     - **Timeline Tab**: Review chronological interaction and memory events.
     - **Interactions Tab**: Click **Add New Interaction**, log a new meeting note containing a new customer objection (e.g. *"Board requires Deloitte SOC-2 Type II audit report"*).
     - **Hindsight Bank Tab**: Notice the memory bank count incremented. Test the **Recall Sandbox** by querying *"SOC-2 audit report"* — observe immediate match.
     - **AI Deal Copilot Tab**: Ask *"What did we promise them regarding the audit?"* — observe the agent citing the newly retained Hindsight memory!
     - **Meeting Prep Tab**: Click **Prepare for Meeting** to generate an executive 1-click briefing brief.

5. **Settings & API Configuration**:
   - Open **Settings & API Keys** (Image 4 replica): View preferences locked to INR (`₹`), and the **API Authentication Tokens** section where you can plug in `HINDSIGHT_API_KEY` and `GROQ_API_KEY` directly from the UI or `.env.local`.

---

## 6. Setup & Local Development

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Installation
```bash
git clone <repo-url>
cd "deal-intelligence-agent final1"
npm install
```

### Environment Configuration
Copy `.env.local` or set your keys:
```env
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DEFAULT_CURRENCY=INR
```
*(Note: If you run without API keys, the application seamlessly operates in high-intelligence local bank mode with full retain, recall, and grounded intelligence!)*

### Running the Application
```bash
# Build for production
npm run build

# Start the server
npm start
# Server listens at http://localhost:3000
```

---

## 7. Known Limitations
- Real-time cloud sync with Hindsight Cloud requires an active internet connection and valid `HINDSIGHT_API_KEY`.
- Automated browser testing using Playwright in headless subagents requires pre-installed browser drivers. Integration and API test suites verify 100% of routes and state transitions.
