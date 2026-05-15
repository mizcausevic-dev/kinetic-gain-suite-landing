# Kinetic Gain Protocol Suite × NIST AI Risk Management Framework — Crosswalk

> Document version **0.2** · published 2026-05-14 · updated 2026-05-15 with implementation-tooling alignment (new section 7) · MIT-licensed

This document maps each of the eleven [Kinetic Gain Protocol Suite](https://suite.kineticgain.com/) specifications to the corresponding NIST AI Risk Management Framework (AI RMF 1.0) functions, categories, and subcategories. It is intended for federal/enterprise procurement teams, vendor compliance leads, and AI auditors who need a concrete, document-level answer to *"which RMF controls does this set of vendor declarations actually address?"*

The crosswalk is honest about gaps. Many RMF subcategories cover **operational practices** (training, monitoring, incident response process) that cannot be discharged by publishing JSON documents alone. Where the Suite covers a subcategory in full, that is called out explicitly. Where it covers part of one — typically the *disclosure* portion — that is also called out, with the operational gap noted.

---

## 1. Executive summary

**Who this is for:**
- Federal procurement teams operating under OMB M-24-10 ("Advancing Governance, Innovation, and Risk Management for Agency Use of Artificial Intelligence"), which directs agencies to use NIST AI RMF.
- Enterprise procurement, CISO, and AI governance offices building NIST RMF-aligned vendor assessment rubrics.
- AI vendors who want to demonstrate RMF posture as part of an RFP response or Approved Vendor List submission.

**What this document shows:**
- For each of the four NIST AI RMF functions (**GOVERN**, **MAP**, **MEASURE**, **MANAGE**), which Kinetic Gain Suite specs publish the relevant evidence.
- For each of the eleven Suite specs, which NIST subcategories it satisfies in whole or in part.
- A concrete recommendation for using the **AI Procurement Decision Card** (spec #11) to record RMF-aligned procurement outcomes in machine-readable form.
- **(Section 7, new in v0.2)** Which NIST subcategories the **fifteen-repo implementation stack** actively *operationalizes* — converting Suite disclosure into runtime enforcement, drift detection, tamper-evident audit trail, and mechanical remediation planning. Several Section-4 "Partial" cells move closer to "Full" when the implementation stack is deployed alongside the specs.

**Coverage at a glance — specs only (sections 4–6):**

| NIST function | Subcategories the Suite addresses (full or partial) | Suite specs involved |
|---|---|---|
| GOVERN | 10+ | AEO, Agent Card, Tool Card, Tutor Card, Clinical AI Card, Decision Card |
| MAP | 8+ | AEO, Agent Card, Clinical AI Card, Student Disclosure, Classroom AUP |
| MEASURE | 6+ | AI Evidence, Clinical AI Card, Prompt Provenance, Incident Card |
| MANAGE | 7+ | Incident Card, Decision Card, Agent Card, Classroom AUP |

**Coverage at a glance — with the implementation stack (section 7):**

| NIST function | Additional subcategories operationalized by deployed tooling | Headline implementation repos |
|---|---|---|
| GOVERN | 1.5 (record-keeping via audit-stream), 6.2 (transparency via MCP servers) | `audit-stream-py`, `mcp-*` servers |
| MAP | 4.1 (graph-based risk mapping) | `aeo-graph-explorer-rs`, `incident-correlation-rs` |
| MEASURE | 1.1 (mechanical contract validation), 2.3 (production diff), 3.1 (continuous drift detection) | `csv-data-quality-rs`, `request-shadow-rs`, `aeo-validator-service`, `slo-budget-tracker` |
| MANAGE | 1.3 (runtime enforcement, not just policy text), 2.3 (mechanical remediation planning) | `policy-as-code-engine`, `incident-correlation-rs`, `feature-flag-rs` |

The Suite is strongest at GOVERN and MAP (disclosure-heavy functions), reasonable at MEASURE (where it provides artifact carriers for test results), and explicitly limited at MANAGE (which requires operational tooling beyond static documents). **The implementation stack reduces the MEASURE and MANAGE gaps materially.** Section 7 quantifies which "Partial" cells move closer to "Full" when the stack is deployed; section 8 itemizes the gaps that remain regardless.

---

## 2. NIST AI RMF 1.0 — quick refresher

NIST published the AI RMF 1.0 in January 2023 ([NIST AI 100-1](https://www.nist.gov/itl/ai-risk-management-framework)) and the Generative AI Profile in July 2024 ([NIST AI 600-1](https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-generative-ai-profile)). The framework defines four functions:

| Function | Purpose | Typical artifact |
|---|---|---|
| **GOVERN** | Establish org-level AI risk management culture, policies, accountability. | AI policies, role descriptions, AUPs, accountability matrices. |
| **MAP** | Recognize and contextualize AI risks — what is this system, who uses it, what could go wrong. | System cards, intended-use statements, impact assessments. |
| **MEASURE** | Analyze, assess, benchmark identified risks. | Test results, evaluation reports, bias audits, performance metrics. |
| **MANAGE** | Allocate resources to risks, treat / accept / transfer / avoid. | Risk registers, incident response plans, mitigation tracking. |

Each function decomposes into categories (e.g., GOVERN 1, GOVERN 2…) and each category into subcategories (e.g., GOVERN 1.1, GOVERN 1.2…). The 1.0 framework has approximately 70 subcategories across the four functions.

The Kinetic Gain Protocol Suite is a *disclosure* and *attestation* framework. It produces machine-readable documents that an organization can publish and that buyers can validate. It does **not** by itself perform monitoring, training, or risk treatment. Wherever the framework calls for *evidence of practice*, the Suite provides the artifact; wherever it calls for *the practice itself*, additional operational tooling and process are required.

---

## 3. The eleven Kinetic Gain specs — one-line recap

| # | Spec | What it discloses | Typical publisher |
|---|---|---|---|
| 1 | **AEO Protocol** | AI service identity, authoritative claims, citation preferences | Vendor |
| 2 | **Prompt Provenance** | Versioned, lineaged, reviewable LLM prompts with evaluation results | Vendor |
| 3 | **Agent Card** | Agent capability + refusal taxonomy + authority scope | Vendor |
| 4 | **AI Evidence Format** | Structured citations for LLM-generated claims | Vendor |
| 5 | **MCP Tool Card** | Per-tool disclosure for MCP servers (data touched, side-effects) | Vendor |
| 6 | **AI Tutor Card** | EdTech pedagogical posture + age range + learning-science citations | Vendor (EdTech) |
| 7 | **Student AI Disclosure** | Student-side use of AI per artifact (FERPA/COPPA-relevant) | Student / school |
| 8 | **Classroom AI AUP** | District acceptable-use policy, machine-readable | District |
| 9 | **Clinical AI Card** | FDA/HIPAA posture, validation studies, bias audits, FHIR integration | Vendor (HealthTech) |
| 10 | **AI Incident Card** | Severity, root cause, regulatory filings for an AI incident | Vendor |
| 11 | **AI Procurement Decision Card** | Buyer's procurement review outcome of vendor declarations | Buyer |

The first ten are vendor-side declarations. **Spec #11 is the buyer-side artifact** and is uniquely well-suited to recording NIST RMF rubric outcomes — see section 6.

---

## 4. Crosswalk by NIST function

In each table below, the **"Suite coverage"** column uses one of three markers:

- **Full** — the named spec(s) carry all the evidence this subcategory expects.
- **Partial** — the spec(s) carry the disclosure portion; an operational gap remains.
- **Adjacent** — the spec(s) cover a closely related concern but not the exact subcategory.

### 4.1 GOVERN

| Subcategory | Description (paraphrased) | Suite specs | Suite coverage | Notes |
|---|---|---|---|---|
| **GOVERN 1.1** | Legal and regulatory requirements involving AI are understood. | AEO Protocol; Clinical AI Card; Classroom AI AUP | **Partial** | AEO declares the entity + jurisdiction; Clinical AI Card declares FDA SaMD class + HIPAA posture; AUP declares district/jurisdiction policy. The organizational understanding itself is process. |
| **GOVERN 1.2** | Risk management is integrated and documented. | Decision Card; Classroom AI AUP | **Partial** | The Decision Card encodes per-review risk-management outcomes; the AUP documents standing policy. Integration depth varies by org. |
| **GOVERN 1.4** | Organizational policies define and differentiate AI use cases. | Classroom AI AUP; AEO Protocol | **Partial** | The AUP differentiates permitted vs. prohibited uses explicitly. AEO scopes the entity's claimed use cases. |
| **GOVERN 2.1** | Roles and responsibilities are documented and assigned. | Decision Card (`decision_maker`); Classroom AUP | **Partial** | Decision Card names the role/authority of the deciding party. AUP can include enforcement responsibility. |
| **GOVERN 3.2** | Policies and procedures address AI risk management training. | — | **Not addressed** | Training is operational; no spec carries this. |
| **GOVERN 4.1** | Org practices encourage critical thinking and safety-first mindset. | Agent Card (refusal taxonomy); Tutor Card (pedagogy) | **Adjacent** | Refusal taxonomies and pedagogical disclosures encode some of the org's safety-first stance. |
| **GOVERN 5.1** | Organizational policies, procedures, and practices related to AI risks are continually reviewed. | Decision Card (`effective_until`, history); Incident Card | **Partial** | Decision Cards have expiry dates that force re-review. Incident Cards trigger ad-hoc review. |
| **GOVERN 6.1** | Policies and procedures address AI-related impacts to individuals, groups, communities. | Student AI Disclosure; Clinical AI Card (`patient_data`); Tutor Card (COPPA, age range) | **Full** | Each of these carries the population-impact disclosures. Clinical Card explicitly covers patient cohort demographics. |
| **GOVERN 6.2** | Procedures address transparency to those affected. | Student AI Disclosure; Classroom AUP; AEO Protocol | **Full** | Student Disclosure publishes per-artifact AI use to the educator/grader; AUP publishes policy to families; AEO publishes vendor claims publicly. |

### 4.2 MAP

| Subcategory | Description (paraphrased) | Suite specs | Suite coverage | Notes |
|---|---|---|---|---|
| **MAP 1.1** | Intended purposes and contexts of use are understood and documented. | AEO Protocol; Agent Card; Tutor Card; Clinical AI Card | **Full** | All four explicitly declare intended use, context, and audience. |
| **MAP 1.2** | Inter-organizational dependencies are understood. | Tool Card; Agent Card | **Partial** | Tool Cards declare which external tools/data sources are called; Agent Cards declare tool dependencies. |
| **MAP 2.1** | Mission objectives, performance, capabilities, and limitations are documented. | Agent Card (capability + refusal); Clinical AI Card (validation studies); Tutor Card | **Full** | Capabilities and limitations are the explicit subject of each. |
| **MAP 2.2** | Information about AI system capabilities, knowledge limits, and assumptions is documented. | Agent Card; Clinical AI Card; Prompt Provenance | **Full** | Limits are first-class fields. Prompt Provenance carries the prompts behind the system's behavior. |
| **MAP 3.1** | Benefits, costs, and trade-offs are documented. | Decision Card (rubric, conditions, rationale) | **Partial** | The Decision Card's rationale + rubric carry buyer-side trade-off analysis. Vendor-side trade-off disclosure is less standardized. |
| **MAP 4.1** | Approaches for mapping AI risks are followed. | Incident Card (categories); Clinical AI Card (bias audit) | **Partial** | The category taxonomies in these specs are de facto risk maps. |
| **MAP 5.1** | Likelihood and magnitude of potential impacts are identified. | Clinical AI Card (validation cohort, sensitivity/specificity); Incident Card (severity) | **Partial** | Clinical card has quantitative validation metrics. Incident card has post-hoc severity. Pre-deployment likelihood estimation is generally missing. |
| **MAP 5.2** | Risk benefits and costs are characterized for each context. | Decision Card (`criteria.rubric`, weights) | **Partial** | The Decision Card's weighted rubric is the natural carrier — but only the buyer publishes it. |

### 4.3 MEASURE

| Subcategory | Description (paraphrased) | Suite specs | Suite coverage | Notes |
|---|---|---|---|---|
| **MEASURE 1.1** | Approaches for measuring AI risk are documented. | AI Evidence Format; Prompt Provenance (eval suites) | **Partial** | The Evidence Format carries citation-grade evidence; Prompt Provenance carries eval suite definitions. The measurement *approach* description is partially covered. |
| **MEASURE 2.3** | Performance is measured against specified objectives. | Clinical AI Card (`evidence.validation_studies`); Prompt Provenance (evaluation_suites); AI Evidence Format | **Full** | Each carries quantitative performance data tied to specified objectives. |
| **MEASURE 2.5** | Risks of bias, fairness, demographic disparity, etc. are evaluated. | Clinical AI Card (`evidence.bias_audit_uri`); Incident Card (categories include bias) | **Partial** | Clinical AI Card requires bias_audit_uri for SaMD II+. Bias *audit existence* is disclosed; the audit content lives at the URI. |
| **MEASURE 2.7** | Security and resilience are evaluated. | Incident Card (prompt-injection, tool-abuse categories); Tool Card | **Adjacent** | Post-incident disclosure, plus tool-side disclosure of risky behaviors. Proactive testing is captured via Prompt Provenance eval suites if a vendor chooses to publish them. |
| **MEASURE 2.8** | Risks associated with transparency and accountability are evaluated. | AEO Protocol; Student Disclosure; Decision Card (`publication.is_public`) | **Partial** | Each disclosure spec carries transparency-vs-privacy trade-offs explicitly. |
| **MEASURE 3.1** | Approaches and metrics for monitoring deployed AI are documented. | Incident Card (status, history); Agent Card (refusal taxonomy) | **Partial** | Post-deployment monitoring outcomes (incidents) are disclosable. Pre-deployment monitoring plan is not directly carried. |

### 4.4 MANAGE

| Subcategory | Description (paraphrased) | Suite specs | Suite coverage | Notes |
|---|---|---|---|---|
| **MANAGE 1.2** | A determination is made as to whether an AI system achieves its intended purpose and is fit for deployment. | **Decision Card** | **Full** | The Decision Card *is* this determination, recorded in machine-readable form. |
| **MANAGE 1.3** | Plan responses to risks, including mitigations and conditions of use. | Decision Card (`conditions`); Classroom AUP | **Full** | The Decision Card's `conditions` array is the canonical carrier. AUP encodes standing policy responses. |
| **MANAGE 2.1** | Resources are allocated to risk-prioritized actions. | — | **Not addressed** | Resource allocation is operational; no spec captures it. |
| **MANAGE 2.3** | Procedures are followed to respond to and recover from previously unknown risks. | Incident Card (`mitigation`, `history`); Decision Card (`withdrawal`) | **Partial** | Incident Card records post-hoc response. Decision Card supports withdrawal of a prior approval. The *procedures themselves* are organizational. |
| **MANAGE 3.1** | AI risk and benefit are monitored. | Incident Card (registry pattern at `/.well-known/ai-incidents.json`) | **Partial** | The vendor's published incident registry is the visible part. |
| **MANAGE 3.2** | Procedures address third-party risks. | Decision Card (`subject.documents_reviewed`); Tool Card (third-party tools) | **Full** | Decision Card's per-document review is precisely a third-party risk record. |
| **MANAGE 4.1** | Post-deployment monitoring plans are documented. | Incident Card; Decision Card (`effective_until` for re-review trigger) | **Partial** | The disclosure portion is covered; the monitoring practice itself is operational. |

---

## 5. Crosswalk by Suite spec

This is the inverse view — for each spec, the NIST subcategories it can be used to attest. Use this when responding to an RFP that asks "which NIST controls does *this document* address?"

### AEO Protocol (`aeo_version`)
**Touches:** GOVERN 1.1, GOVERN 6.2, MAP 1.1, MEASURE 2.8.
**Best used for:** Vendor identity, jurisdiction, and authoritative claims at the entity level. The "Who are you and what do you claim?" document.

### Prompt Provenance (`provenance_version`)
**Touches:** MAP 2.2, MEASURE 1.1, MEASURE 2.3.
**Best used for:** Demonstrating that prompts are versioned, lineaged, and tied to evaluation results. Provides reproducibility of model behavior across releases.

### Agent Card (`agent_card_version`)
**Touches:** GOVERN 4.1, MAP 1.2, MAP 2.1, MAP 2.2, MEASURE 3.1.
**Best used for:** Capability + refusal taxonomy + tool/data dependencies. The "What can this agent do, what will it refuse to do, and what does it call?" document.

### AI Evidence Format (`evidence_version`)
**Touches:** MEASURE 1.1, MEASURE 2.3.
**Best used for:** Per-claim citation and verification records. Pairs naturally with auditor or regulator review processes.

### MCP Tool Card (`tool_card_version`)
**Touches:** MAP 1.2, MEASURE 2.7, MANAGE 3.2.
**Best used for:** Per-tool disclosure of side effects, data touched, and external systems called. The agent-side companion to MAP 1.2.

### AI Tutor Card (`tutor_card_version`)
**Touches:** GOVERN 4.1, GOVERN 6.1, MAP 1.1, MAP 2.1, MAP 2.2.
**Best used for:** EdTech vendor disclosure with COPPA, age range, pedagogical posture. The EdTech-specific extension of Agent Card.

### Student AI Disclosure (`disclosure_version`)
**Touches:** GOVERN 6.1, GOVERN 6.2, MEASURE 2.8.
**Best used for:** Per-artifact transparency in EdTech. FERPA-relevant. Pairs with Classroom AUP via the `aup_check_compliance` cross-spec tool.

### Classroom AI AUP (`aup_version`)
**Touches:** GOVERN 1.4, GOVERN 2.1, GOVERN 5.1, GOVERN 6.2, MANAGE 1.3.
**Best used for:** District-side standing policy. The clearest carrier of GOVERN 1.4 ("differentiated AI use cases").

### Clinical AI Card (`clinical_ai_card_version`)
**Touches:** GOVERN 1.1, GOVERN 6.1, MAP 1.1, MAP 2.1, MAP 2.2, MAP 5.1, MEASURE 2.3, MEASURE 2.5.
**Best used for:** Clinical AI deployments. The Suite's most NIST-aligned single document due to its bias_audit_uri requirement for SaMD class II+ and conditional-rule enforcement of regulatory ⇔ autonomy consistency.

### AI Incident Card (`incident_card_version`)
**Touches:** GOVERN 5.1, MAP 4.1, MAP 5.1, MEASURE 2.5, MEASURE 2.7, MEASURE 3.1, MANAGE 2.3, MANAGE 3.1, MANAGE 4.1.
**Best used for:** Post-hoc incident disclosure. The Incident Card's `regulatory.reported_to` field directly carries EU AI Act Article 73 filings and FDA MedWatch references. The widest MEASURE/MANAGE coverage of any single spec.

### AI Procurement Decision Card (`decision_card_version`)
**Touches:** GOVERN 1.2, GOVERN 2.1, GOVERN 5.1, MAP 3.1, MAP 5.2, **MANAGE 1.2** (in full), **MANAGE 1.3** (in full), MANAGE 2.3, MANAGE 3.2.
**Best used for:** Recording RMF-aligned procurement outcomes. **The Decision Card is the natural artifact for federal Approved Vendor List (AVL) decisions under OMB M-24-10.** See section 6.

---

## 6. Using the Decision Card to record RMF-aligned procurement decisions

This is the most actionable section for federal/enterprise procurement teams.

When an agency or enterprise reviews a vendor's Suite declarations (AEO, Tool Card, Clinical AI Card, etc.) and produces an AVL/procurement decision, the **AI Procurement Decision Card** is the canonical machine-readable artifact for that decision. Its `criteria.rubric` field is precisely shaped to carry per-NIST-subcategory pass/partial/fail results.

### Recommended rubric structure for NIST RMF-aligned decisions

```json
{
  "decision_card_version": "0.1",
  "decision_id": "AGENCY-AVL-2026-0042",
  "buyer": { "name": "U.S. Department of X", "type": "agency", "jurisdiction": "US" },
  "decision_maker": {
    "role": "AVL Review Board",
    "authority": "OMB Memorandum M-24-10"
  },
  "subject": {
    "vendor_name": "ExampleVendor Inc.",
    "documents_reviewed": [
      { "type": "aeo", "url": "..." },
      { "type": "tool-card", "url": "..." },
      { "type": "clinical-ai-card", "url": "..." },
      { "type": "ai-evidence", "url": "..." }
    ]
  },
  "criteria": {
    "policy_uris": [
      "https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf",
      "https://www.nist.gov/itl/ai-risk-management-framework"
    ],
    "rubric": [
      { "id": "GOVERN_1_1", "description": "Legal and regulatory requirements understood",                "weight": 1.0, "result": "pass" },
      { "id": "GOVERN_6_1", "description": "Procedures address AI-related impacts to individuals/groups", "weight": 1.0, "result": "pass" },
      { "id": "MAP_1_1",    "description": "Intended purposes and contexts documented",                   "weight": 1.0, "result": "pass" },
      { "id": "MAP_2_1",    "description": "Capabilities and limitations documented",                     "weight": 1.0, "result": "pass" },
      { "id": "MEASURE_2_3","description": "Performance measured against specified objectives",           "weight": 1.0, "result": "pass" },
      { "id": "MEASURE_2_5","description": "Bias / fairness / disparity evaluated",                       "weight": 1.0, "result": "partial",
        "notes": "Bias audit current but cohort underrepresents demographic X by 18%." },
      { "id": "MANAGE_1_2", "description": "Fitness-for-deployment determination made",                   "weight": 1.0, "result": "pass" }
    ]
  },
  "decision": {
    "status": "approved-with-conditions",
    "scope": "Non-rights-impacting use only, per OMB M-24-10 § 5",
    "effective_until": "2027-05-31"
  },
  "conditions": [
    {
      "id": "MEASURE_2_5-remediation",
      "description": "Vendor SHALL deliver refreshed bias audit with demographically-representative cohort by 2026-12-31.",
      "enforcement": "audit"
    }
  ],
  "rationale": "Vendor meets all hard NIST RMF requirements except MEASURE 2.5 (bias audit cohort gap). Approval contingent on the remediation condition above."
}
```

The Decision Card's standard fields (`buyer`, `subject.documents_reviewed`, `criteria.policy_uris`, `criteria.rubric`, `conditions`, `decision.status`, `decision.scope`, `decision.effective_until`) provide a natural carrier for every piece of an RMF-aligned procurement decision. Federal agencies publishing under OMB M-24-10 § 5(c) (public AI use inventory) can use the Decision Card as the machine-readable companion to their public inventory entries.

---

## 7. Implementation tooling: from disclosure to enforcement

The crosswalk above (sections 4–6) treats the Suite as a pure disclosure layer. That's the right framing for the *specs*. But the Kinetic Gain implementation stack — **fifteen open-source repos that consume Suite documents** — converts a number of "Partial" cells in the spec-side crosswalk into operational practice. This section maps those repos to the NIST subcategories they actively address at runtime.

All fifteen implementation repos are MIT-licensed, semver-tagged at v0.1.0, with CI-green test suites. They compose: every repo reads or writes Suite documents, and four explicit **cross-ecosystem hooks** chain them together.

### 7.1 The implementation stack

| Repo | Lang | Role |
|---|---|---|
| [`procurement-decision-api`](https://github.com/mizcausevic-dev/procurement-decision-api) | Python · FastAPI | Drafts Decision Cards from buyer rubric + vendor Suite docs. |
| [`policy-as-code-engine`](https://github.com/mizcausevic-dev/policy-as-code-engine) | Python · FastAPI | Runtime gate; converts Decision Card conditions into deny-by-default rules. |
| [`audit-stream-py`](https://github.com/mizcausevic-dev/audit-stream-py) | Python · FastAPI · SSE | Append-only governance event stream, hash-chained for tamper-evidence. |
| [`hash-attestation-rs`](https://github.com/mizcausevic-dev/hash-attestation-rs) | Rust · ed25519 | Sign + verify Suite documents over the canonical-hash convention. |
| [`aeo-validator-service`](https://github.com/mizcausevic-dev/aeo-validator-service) | Python · FastAPI | Always-on validator with content-hash drift tracking. |
| [`aeo-graph-explorer-rs`](https://github.com/mizcausevic-dev/aeo-graph-explorer-rs) | Rust · axum · petgraph | HTTP graph-query service over AEO crawls. |
| [`incident-correlation-rs`](https://github.com/mizcausevic-dev/incident-correlation-rs) | Rust · petgraph | Walks the Suite graph from an Incident Card to a remediation plan. |
| [`data-contract-registry`](https://github.com/mizcausevic-dev/data-contract-registry) | Python · FastAPI | Schema registry with semver + compatibility checks. |
| [`csv-data-quality-rs`](https://github.com/mizcausevic-dev/csv-data-quality-rs) | Rust · tokio · csv | Streaming CSV validator against a registered contract. |
| [`slo-budget-tracker`](https://github.com/mizcausevic-dev/slo-budget-tracker) | Python · Prometheus | SLO + error-budget with multi-window burn-rate alerts. |
| [`reliability-toolkit-rs`](https://github.com/mizcausevic-dev/reliability-toolkit-rs) | Rust · Tokio | Rate limiter · circuit breaker · retry · bulkhead. |
| [`feature-flag-rs`](https://github.com/mizcausevic-dev/feature-flag-rs) | Rust · Tokio | Server-side flags with sticky percentage rollouts. |
| [`request-shadow-rs`](https://github.com/mizcausevic-dev/request-shadow-rs) | Rust · Tokio | Async request mirroring with structured divergence diff. |
| [`mcp-kinetic-gain`](https://github.com/mizcausevic-dev/mcp-kinetic-gain) · [`mcp-reliability-toolkit`](https://github.com/mizcausevic-dev/mcp-reliability-toolkit) · [`mcp-decision-intelligence`](https://github.com/mizcausevic-dev/mcp-decision-intelligence) | TypeScript · MCP SDK | Three Claude-callable surfaces for Suite, reliability, and decision intelligence. |

### 7.2 Implementation repo × NIST subcategory

| Implementation | Operationalizes | What it adds beyond the disclosure layer |
|---|---|---|
| **procurement-decision-api** | GOVERN 5.1, MAP 3.1, MAP 5.2, MEASURE 2.5, MANAGE 1.2 | The service that *produces* the Decision Card. Inputs: buyer rubric + vendor Suite docs. Output: a signed determination. Closes the per-review portion of GOVERN 5.1 and MANAGE 1.2. |
| **policy-as-code-engine** | MANAGE 1.3 (runtime), MANAGE 3.2 | Headline: `POST /bundles/from-decision-card` turns every Decision Card `condition` into a deny-by-default runtime gate. Converts MANAGE 1.3 from "we wrote down the conditions" to "every request validates them." |
| **audit-stream-py** | GOVERN 1.5 (record-keeping), MEASURE 3.1 | Append-only, hash-chained event stream. Records every Decision Card draft, policy denial, contract promotion, watch drift, incident filing. The audit-trail leg of GOVERN that pure-disclosure documents can't reach. |
| **hash-attestation-rs** | MAP 2.2, MEASURE 2.8 | ed25519 signatures over the canonical hash of any Suite document. The "this AEO actually came from the vendor" layer. Tightens MAP 2.2's "knowledge limits and assumptions" with *non-repudiable* identity of who claimed what. |
| **aeo-validator-service** | MEASURE 3.1, MANAGE 3.1 | Always-on validator with content-hash drift tracking. When a vendor's published AEO / agent-card / tool-card changes, the service emits a structured `DriftReport`. The continuous-monitoring piece MEASURE 3.1 calls for and the disclosure layer doesn't carry. |
| **aeo-graph-explorer-rs** | MAP 1.2, MAP 4.1 | HTTP graph-query service over the AEO crawl. `GET /shortest-path?from=&to=` lets auditors answer "does a citation chain connect entity X to entity Y?" without re-walking the graph. Cross-org dependency mapping in seconds. |
| **incident-correlation-rs** | MAP 4.1, MANAGE 2.3, MANAGE 3.1 | Walks the Suite graph from an `IncidentCard` and emits a structured remediation plan: which agent-cards depend on the affected tool, which Decision Cards approved the affected vendor, which AEO entities reference the affected entity. Makes MANAGE 2.3 ("respond to and recover from previously unknown risks") mechanical. |
| **data-contract-registry** | GOVERN 1.4, MAP 1.2 | Data-side analog of the Suite's governance model. Semver-versioned contracts, backward/forward compatibility checks, declared owners. Cross-ecosystem hook to `procurement-decision-api`: owners extracted from Decision Card's `buyer` + `decision_maker`. |
| **csv-data-quality-rs** | MEASURE 1.1, MEASURE 2.3 | Streaming CSV validator against a registered contract. Producers prove their output matches the contract — mechanical proof, not "we wrote a test." |
| **slo-budget-tracker** | MEASURE 3.1, MANAGE 3.1 | SLO + error-budget library with multi-window burn-rate alerts. Pair with Incident Card filing to detect emerging deployment risks before they cross MANAGE 2.3's "previously unknown" threshold. |
| **reliability-toolkit-rs** | MEASURE 2.7 (security/resilience) | Rate limiter + circuit breaker + retry + bulkhead in Rust async. Operational resilience primitives. |
| **feature-flag-rs** | MANAGE 1.3 (staged rollout) | Sticky percentage rollouts (SHA-256 bucketing, no RNG). Per-rule rollout control supports MANAGE 1.3's "conditions of use" with concrete flag semantics. |
| **request-shadow-rs** | MEASURE 2.3 | Async request mirroring + structured response diff. Production performance comparison against a candidate — direct evidence for MEASURE 2.3's "measured against specified objectives." |
| **mcp-\* servers** | GOVERN 6.2 (transparency) | Three Claude-callable surfaces making Suite operations and reliability math observable to LLM-driven assistants. |

### 7.3 Which Section-4 "Partial" cells get reduced when the implementation stack is deployed

| Subcategory | Spec-layer coverage (Section 4) | Adds when implementation deployed |
|---|---|---|
| **GOVERN 5.1** — continuous policy review | Partial (Decision Card `effective_until` forces re-review) | **Closer to Full** via `procurement-decision-api` (scheduled review workflow) + `audit-stream-py` (re-review event records). |
| **MEASURE 3.1** — deployment monitoring | Partial (Incident Card carries monitoring outcomes only) | **Closer to Full** via `aeo-validator-service` (continuous drift detection) + `slo-budget-tracker` (SLO-based monitoring). |
| **MANAGE 1.3** — plan responses to risks | Full at the spec layer (Decision Card carries conditions) | **Full + enforced** via `policy-as-code-engine`. Conditions stop being aspirational text; they become deny-by-default gates. |
| **MANAGE 2.3** — respond to / recover from previously unknown risks | Partial (Incident Card records post-hoc response) | **Closer to Full** via `incident-correlation-rs` (mechanical remediation planning) + `audit-stream-py` (response timeline as a tamper-evident record). |
| **MANAGE 3.1** — risk + benefit monitoring | Partial (vendor incident registry only) | **Closer to Full** with `audit-stream-py` as the buyer-side tamper-evident registry alongside vendor disclosures. |

The Suite remains a **disclosure** framework; the implementation stack adds the operational tooling that procurement, compliance, and SRE teams would otherwise have to build themselves. **The two layers compose** — every implementation repo reads or writes Suite documents — but they're independently deployable.

### 7.4 What the implementation stack still doesn't address

Honest about gaps. No implementation repo claims to address these:

- **GOVERN 3.2** (AI risk management training) — workforce program, not software.
- **GOVERN 3.x** broadly (workforce diversity, accessible AI literacy) — operational.
- **MANAGE 2.1** (resource allocation to prioritized risks) — the audit stream records *what happened*, but doesn't allocate budget.
- **MANAGE 4.x** (continuous improvement loops) — scheduled re-review (Decision Card `effective_until` + audit-stream notifications) gets close, but the actual *improvement practice* is organizational.

Section 8 below covers these gaps in detail.

---

## 8. Gaps and explicit limitations

We are honest about what this crosswalk does **not** address. Buyers should not treat Suite-compliance as RMF-compliance.

### Subcategories the Suite does not address

- **GOVERN 3.2** (AI risk management training) — operational; requires training programs, not documents.
- **GOVERN 3.x** broadly (workforce diversity, accessible AI literacy) — operational.
- **MANAGE 2.1** (resource allocation to prioritized risks) — operational; the Suite carries the disclosure outputs but not the resource decision.
- **Continuous monitoring practices in MEASURE 3.x** — the Suite supports post-hoc disclosure (Incident Card) but does not by itself perform monitoring.
- **MANAGE 4.x** (continuous improvement loops) — the Decision Card's `effective_until` triggers re-review, but the improvement *practice* is operational.

### Where the Suite is "Partial" — what's missing

For subcategories marked "Partial" in section 4:

- **GOVERN 1.2, GOVERN 5.1** — the Decision Card carries the *outcome* of risk reviews, not the standing review *process*.
- **MAP 5.1** — the Clinical AI Card carries post-validation impact metrics. Pre-deployment likelihood estimation (e.g. fault-tree analysis) is not a Suite primitive.
- **MEASURE 2.7** (security/resilience) — Incident Card covers post-hoc disclosure of prompt-injection / tool-abuse successes; proactive testing artifacts can ride in Prompt Provenance evaluation suites but are not enforced.
- **MEASURE 3.1** (deployment monitoring plan) — Incident Card covers the *output* of monitoring; the monitoring *plan* is not directly carried by any spec.

### Generative AI Profile (NIST AI 600-1) coverage

The Generative AI Profile published July 2024 layers ~12 additional risk categories on top of the RMF (CBRN information, confabulation, dangerous/violent recommendations, data privacy, environmental, harmful bias, human-AI configuration, information integrity, information security, intellectual property, obscene/degrading content, value chain). The Suite addresses these in varying degree:

| GAI risk | Suite specs that touch it | Coverage |
|---|---|---|
| Confabulation / hallucination | AI Evidence Format; Incident Card categories | Partial |
| Data privacy | Clinical AI Card (PHI/HIPAA); Student AI Disclosure (FERPA/COPPA) | Strong in regulated verticals; weaker generally |
| Harmful bias | Clinical AI Card (`bias_audit_uri`); Incident Card (bias category) | Strong for clinical, weaker elsewhere |
| Information integrity | AEO Protocol (authoritative claims); AI Evidence Format | Partial |
| Information security | Tool Card; Agent Card; Incident Card | Partial |
| Intellectual property | Prompt Provenance (lineage) | Adjacent |
| Value chain / 3rd-party | Tool Card; Agent Card; Decision Card (`documents_reviewed`) | Strong |
| Human-AI configuration | Agent Card (refusal taxonomy + authority) | Strong |

The 4 GAI risks not represented above (CBRN, dangerous content, environmental, obscene content) are largely content/output concerns rather than artifact-disclosure concerns and are out of scope for the Suite.

---

## 9. How to use this crosswalk in procurement workflows

### For federal procurement teams (OMB M-24-10-aligned)

1. **Require vendors to publish at least the AEO Protocol, AI Tool Cards, and Agent Card** for the AI system being evaluated. For clinical AI: also require the Clinical AI Card.
2. **Use the Decision Card** to record your AVL determination, with `criteria.rubric` populated with NIST subcategory IDs as described in section 6.
3. **Publish the Decision Card** at `/.well-known/decisions/<id>.json` in compliance with OMB M-24-10 § 5(c)'s public-AI-use-inventory requirement.
4. **Set `effective_until`** to force scheduled re-review aligned with your agency's review cycle.

### For enterprise procurement teams

1. Same as federal, but `criteria.policy_uris` should point to your internal AI policy rather than OMB.
2. Use the Decision Card's `signatures` block to track formal approvals via your governance committee.
3. The `appeals` block is useful when vendors want to challenge rejection-with-remediation decisions.

### For AI vendors responding to RFPs

1. Publish the relevant Suite documents at well-known URLs before the RFP closes.
2. In your RFP response, **map your published documents to the NIST RMF subcategories** the buyer's rubric calls out. Use section 5 of this crosswalk as your starting reference.
3. If the buyer's rubric includes subcategories the Suite cannot address (e.g. GOVERN 3.2 training programs), provide operational evidence (training records, audit logs) alongside the Suite documents.

### For auditors

1. The Suite is the **evidence** layer, not the **process** layer. Treat Suite documents as point-in-time disclosures.
2. Use `content_hash` fields in Decision Cards' `documents_reviewed` to detect post-decision drift in vendor declarations.
3. Cross-reference Incident Cards against Decision Cards: a vendor with active Incidents should appear in `withdrawal` blocks of recent Decision Cards from any responsible buyer.

---

## 10. Versioning, feedback, and updates

- **This document is v0.2**, dated 2026-05-15 (was v0.1 / 2026-05-14; v0.2 adds Section 7 covering the fifteen-repo implementation stack).
- **License**: MIT.
- **Repository**: [kinetic-gain-suite-landing/docs/nist-rmf-crosswalk.md](https://github.com/mizcausevic-dev/kinetic-gain-suite-landing/blob/main/docs/nist-rmf-crosswalk.md)
- **Issues / contributions**: Open issues against the [kinetic-gain-protocol-suite meta-repo](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite) tagged `nist-rmf`.

When NIST publishes AI RMF 1.1 or a new Generative AI Profile revision, this crosswalk will be versioned to track it. Suite specs will get a `nist_rmf_alignment` advisory field in a future minor release to make the mapping queryable programmatically.

---

## Appendix A: Quick-reference tables

### A.1 Spec × NIST subcategory

| Spec | GOVERN | MAP | MEASURE | MANAGE |
|---|---|---|---|---|
| AEO Protocol | 1.1, 6.2 | 1.1 | 2.8 | — |
| Prompt Provenance | — | 2.2 | 1.1, 2.3 | — |
| Agent Card | 4.1 | 1.2, 2.1, 2.2 | 3.1 | — |
| AI Evidence Format | — | — | 1.1, 2.3 | — |
| MCP Tool Card | — | 1.2 | 2.7 | 3.2 |
| AI Tutor Card | 4.1, 6.1 | 1.1, 2.1, 2.2 | — | — |
| Student AI Disclosure | 6.1, 6.2 | — | 2.8 | — |
| Classroom AI AUP | 1.4, 2.1, 5.1, 6.2 | — | — | 1.3 |
| Clinical AI Card | 1.1, 6.1 | 1.1, 2.1, 2.2, 5.1 | 2.3, 2.5 | — |
| AI Incident Card | 5.1 | 4.1, 5.1 | 2.5, 2.7, 3.1 | 2.3, 3.1, 4.1 |
| **AI Procurement Decision Card** | 1.2, 2.1, 5.1 | 3.1, 5.2 | — | **1.2, 1.3**, 2.3, 3.2 |

Bold = "Full" coverage. Others = "Partial" or "Adjacent".

### A.2 Implementation repo × NIST subcategory

Companion to A.1 — what the deployed implementation tooling operationalizes at runtime. See Section 7 for full notes.

| Implementation | GOVERN | MAP | MEASURE | MANAGE |
|---|---|---|---|---|
| `procurement-decision-api` | 5.1 | 3.1, 5.2 | 2.5 | **1.2** |
| `policy-as-code-engine` | — | — | — | **1.3**, 3.2 |
| `audit-stream-py` | **1.5** | — | 3.1 | — |
| `hash-attestation-rs` | — | 2.2 | 2.8 | — |
| `aeo-validator-service` | — | — | 3.1 | 3.1 |
| `aeo-graph-explorer-rs` | — | 1.2, 4.1 | — | — |
| `incident-correlation-rs` | — | 4.1 | — | 2.3, 3.1 |
| `data-contract-registry` | 1.4 | 1.2 | — | — |
| `csv-data-quality-rs` | — | — | 1.1, 2.3 | — |
| `slo-budget-tracker` | — | — | 3.1 | 3.1 |
| `reliability-toolkit-rs` | — | — | 2.7 | — |
| `feature-flag-rs` | — | — | — | **1.3** |
| `request-shadow-rs` | — | — | 2.3 | — |
| `mcp-*` servers | 6.2 | — | — | — |

Bold = primary operationalization (the repo is the headline carrier of that subcategory's enforcement layer).

---

*Authored by Miz Causevic / Kinetic Gain LLC. Cross-referenced against [NIST AI 100-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) (AI RMF 1.0, January 2023) and [NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) (Generative AI Profile, July 2024). This crosswalk is independent and is not a NIST publication or endorsement.*
