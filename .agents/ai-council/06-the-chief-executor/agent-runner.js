/**
 * Council Agent 06: General Mostafa "The Enforcer" Amin
 * Mandatory External Skill: .agents/skills/executive-moscow-and-raci-governance/SKILL.md
 */

const fs = require('fs');
const path = require('path');

class ChiefExecutorAgent {
  constructor(options = {}) {
    this.agentId = '06-the-chief-executor';
    this.name = 'المدير التنفيذي للحوكمة والتنفيذ (The Chief Executor & Governance Lead)';
    this.role = 'Chief Operating Officer & VP of Engineering Governance';
    this.dir = __dirname;
    this.options = options;

    // Load Persona, System Prompt, Checklist
    this.persona = this.loadFile('persona.md');
    this.systemPrompt = this.loadFile('system-prompt.md');
    this.checklist = this.loadFile('checklist-and-rules.md');

    // Mandatory External Skill Integration (Agents/always-use-skills.md)
    this.primarySkillName = 'executive-moscow-and-raci-governance';
    this.skillPath = path.resolve(this.dir, '..', '..', '.agents', 'skills', this.primarySkillName, 'SKILL.md');
    this.skillContent = this.loadExternalSkill();
  }

  loadFile(fileName) {
    const filePath = path.join(this.dir, fileName);
    try {
      if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`[${this.agentId}] Error loading ${fileName}:`, err.message);
    }
    return '';
  }

  loadExternalSkill() {
    try {
      if (fs.existsSync(this.skillPath)) {
        return fs.readFileSync(this.skillPath, 'utf8');
      }
    } catch (err) {
      console.warn(`[${this.agentId}] Warning loading external skill:`, err.message);
    }
    return '';
  }

  getCompiledSystemInstructions() {
    return [
      `=== MANDATORY EXTERNAL SKILL LOADED (Agents/always-use-skills.md) ===`,
      `Active Ecosystem Skill: ${this.primarySkillName}`,
      this.skillContent,
      `\n=== IDENTITY & PERSONA ===`,
      this.persona,
      `\n=== OPERATIONAL SYSTEM PROMPT & EXECUTIVE MANDATES ===`,
      this.systemPrompt,
      `\n=== GOVERNANCE CONSTITUTION & 35 EXECUTION LAWS ===`,
      this.checklist,
      `\nTECHNICAL LANGUAGE DIRECTIVE: Exercise absolute executive authority using commanding, decisive professional executive operations English. Synthesize debates, break deadlocks, enforce strict P0/P1/P2 MoSCoW prioritization, define the RACI matrix, and issue the binding operational order. Declare your governing skill at the start.`
    ].join('\n\n');
  }

  async deliberate(debateContext) {
    const { projectSummary, blackboardContent, round = 1 } = debateContext;
    console.log(`\n⚖️ [${this.name}] Arbitrating council conflicts & issuing binding directives via [${this.primarySkillName}] (Round ${round})...`);

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (apiKey && !this.options.forceLocalMode) {
      try {
        return await this.callExternalLLM(debateContext);
      } catch (error) {
        console.warn(`[${this.name}] External LLM failed (${error.message}). Running executive governance heuristic engine...`);
      }
    }

    return this.generateHeuristicResponse(debateContext);
  }

  generateHeuristicResponse({ projectSummary, blackboardContent, round }) {
    if (round === 1) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`executive-moscow-and-raci-governance\` (.agents/skills/executive-moscow-and-raci-governance/SKILL.md)
> **Governing Standards:** High-Output Management (Grove Protocol), Deterministic MoSCoW Feature Triage, Single DRI Accountability, Definition of Done (DoD).

### [Executive Arbitration & Binding Governance Order | The Chief Executor]

#### 1. Executive Synthesis & Strategic Trade-off Decisions
- **Council Order:** Quiet in the room! The deliberation on **منصة المعهد الفني الصناعي للكشف الطبي (Elmasry Medical Booking)** is hereby resolved.
  - **The Growth Strategist's (خبير النمو)** commercial vision is validated: This platform turns seasonal admissions chaos into an automated, paperless appointment engine.
  - **The Risk Auditor's (مدقق المخاطر)** pre-mortem correctly diagnosed the lethal risks: Slot overbooking during peak results release, file upload bandwidth saturation, and physical clinic over-crowding.
  - **The Systems Architect's (مهندس المعمارية)** atomic transaction model for slot booking eliminates race conditions.
  - **The Security Lead's (مسؤول أمن المعلومات)** red-team audit mandates BOLA/IDOR protection and strict admin setup locking.
  - **The UX Designer's (خبير تجربة المستخدم)** 3-step Arabic RTL mobile flow and printable QR medical ticket bridge the physical-digital gap.

#### 2. Deterministic MoSCoW Priority Triage for Elmasry Medical
- **[P0 - Launch-Critical Must Haves]:**
  1. **Atomic Slot Reservation:** Interactive Prisma transaction with conditional updates preventing \`bookedCount > maxCapacity\` (Owner: The Systems Architect).
  2. **BOLA/IDOR Elimination & Role Guards:** Enforce strict session checks on \`/api/admin/students/[id]\` and document viewing (Owner: The Security Lead).
  3. **Printable Medical Ticket with QR Code:** High-contrast Arabic ticket with QR verification and physical document checklist (Owner: The UX Designer).
  4. **Client-Side Image Compression:** Compress National ID and certificate photos to < 300KB before upload (Owner: The UX Designer & The Systems Architect).
  5. **Admin & Doctor Verification Queue:** Single-click approve/needs-correction workflow with student feedback notes (Owner: The Systems Architect & The Growth Strategist).
- **[P1 - Should Have]:**
  - Bulk student export to Excel (\`xlsx\`) for institute administration archives.
  - WhatsApp notification webhook integration for appointment confirmation and correction notices.
  - Doctor medical fitness entry screen (Fit / Unfit with clinical notes).
- **[P2 - Could Have]:**
  - Clinic reception barcode scanner PWA mode.
  - Real-time waiting room TV display screen.
- **[P3 - Won't Have (Now)]:**
  - Microservices or payment gateways (admission registration is administrative).

#### 3. RACI Accountability Matrix
| Workstream / Deliverable | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
| :--- | :--- | :--- | :--- | :--- |
| **Slot Concurrency & Prisma Transactions** | Systems Architect | Chief Executor | Risk Auditor | Growth Strategist |
| **IDOR Lockdown & Role Middleware** | Security Lead | Chief Executor | Systems Architect | Council |
| **Mobile RTL Stepper & Printable Ticket** | UX Designer | Chief Executor | Growth Strategist | Students |
| **Admin Review Queue & Doctor Workflow** | Systems Architect | Chief Executor | Security Lead | Doctors |

#### 4. Binding Executive Order
- **VERDICT: APPROVED FOR SPRINT EXECUTION**. All team leads will execute their assigned P0 workstreams immediately. Meeting adjourned!`;
    }

    if (round === 2) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`executive-moscow-and-raci-governance\` (.agents/skills/executive-moscow-and-raci-governance/SKILL.md)

### [Executive Operational Alignment & Sign-off | The Chief Executor]

#### 1. Ratification of Council Concessions
- Atomic slot concurrency lock: **Ratified**.
- IDOR lockdown on student medical records: **Ratified**.
- Client-side image compression: **Ratified**.
- High-contrast printable QR medical ticket: **Ratified**.
- Single-click admin review queue: **Ratified**.

#### 2. Final Operational Directives
- Sprint kicks off immediately.
- Zero feature additions are permitted without operational deviation order.
- Meeting adjourned!`;
    }

    return `### [Final Executive Adjournment | General Mostafa Amin]
- The Council has achieved full tactical alignment. The debate is closed. Execution begins now.`;
  }

  async callExternalLLM(debateContext) {
    const endpoint = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.COUNCIL_MODEL || 'gpt-4o';

    const systemPrompt = this.getCompiledSystemInstructions();
    const userPrompt = `
[PROJECT SPECIFICATION]:
${debateContext.projectSummary || 'Project HyperVault: B2B Credit & Factoring Engine.'}

[ACCUMULATED BLACKBOARD DEBATE]:
${debateContext.blackboardContent || 'Round 1 beginning.'}

[ROUND]: Round ${debateContext.round}

Respond as General Mostafa Amin (The Chief Executor). State your mandatory external skill (\`executive-moscow-and-raci-governance\`) at the start. Deliver decisive, binding executive arbitration, MoSCoW P0/P1/P2 priorities, the RACI matrix, and the 60-day Kill Switch in commanding, battle-hardened executive English.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model,
        temperature: 0.3,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = ChiefExecutorAgent;
