/**
 * Council Agent 02: Tarek "The Ruthless Critic" Radwan
 * Mandatory External Skill: .agents/skills/forensic-risk-and-pre-mortem/SKILL.md
 */

const fs = require('fs');
const path = require('path');

class RuthlessCriticAgent {
  constructor(options = {}) {
    this.agentId = '02-the-ruthless-critic';
    this.name = 'مدقق المخاطر الفنية والمقصلة (The Ruthless Critic & Risk Auditor)';
    this.role = 'Head of Restructuring & Forensic Systems Risk Auditor';
    this.dir = __dirname;
    this.options = options;

    // Load Persona, System Prompt, Checklist
    this.persona = this.loadFile('persona.md');
    this.systemPrompt = this.loadFile('system-prompt.md');
    this.checklist = this.loadFile('checklist-and-rules.md');

    // Mandatory External Skill Integration (Agents/always-use-skills.md)
    this.primarySkillName = 'forensic-risk-and-pre-mortem';
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
      `\n=== OPERATIONAL SYSTEM PROMPT & COMBAT PROTOCOL ===`,
      this.systemPrompt,
      `\n=== RUTHLESS AUDIT CONSTITUTION & 35 EXECUTION CHECKS ===`,
      this.checklist,
      `\nTECHNICAL LANGUAGE DIRECTIVE: Tear down optimistic illusions with savage forensic precision using fluent professional English and rigorous financial risk metrics. Challenge colleagues by name and state your governing skill at the beginning.`
    ].join('\n\n');
  }

  async deliberate(debateContext) {
    const { projectSummary, blackboardContent, round = 1 } = debateContext;
    console.log(`\n⚔️ [${this.name}] Executing Pre-Mortem forensic audit using [${this.primarySkillName}] (Round ${round})...`);

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (apiKey && !this.options.forceLocalMode) {
      try {
        return await this.callExternalLLM(debateContext);
      } catch (error) {
        console.warn(`[${this.name}] External LLM failed (${error.message}). Running forensic heuristic engine...`);
      }
    }

    return this.generateHeuristicResponse(debateContext);
  }

  generateHeuristicResponse({ projectSummary, blackboardContent, round }) {
    if (round === 1) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`forensic-risk-and-pre-mortem\` (.agents/skills/forensic-risk-and-pre-mortem/SKILL.md)
> **Governing Standards:** Gary Klein Pre-Mortem Protocol, Concurrency Failure Analysis, Admission Peak Stress-Testing.

### [Forensic Risk Audit & Pre-Mortem Dissection | The Ruthless Critic & Risk Auditor]

#### 1. Pre-Mortem Failure Scenario (The Day 1 Admission Stampede)
- **The Delusion:** The growth team thinks this is a simple, peaceful booking calendar. Let me snap you back to Egyptian reality. Here is the exact pre-mortem of how **منصة المعهد الفني الصناعي للكشف الطبي** collapses on Day 1 of student admissions:
  1. **09:59 AM:** The Ministry of Higher Education coordinates Tansiq results. 3,500 students and their parents all receive SMS links to register simultaneously.
  2. **10:02 AM:** 1,200 students hit the slot selection screen concurrently. Each slot has a \`maxCapacity\` of 20. Because the current booking handler reads the count before incrementing without an atomic database lock, 75 students are successfully booked into the 09:00 AM slot!
  3. **10:15 AM:** Students start uploading 8MB uncompressed smartphone photos of their National IDs and certificates directly to the server. The connection pool runs dry, Cloudinary bandwidth spikes, and incoming requests crash with HTTP 504 Gateway Timeout!
  4. **Day 2:** 150 angry students and their parents show up at the clinic door at 09:00 AM with valid printed tickets for a room designed for 20. The clinic doctor calls security, the Dean orders the system shut down, and we're back to paper queues and police reports!

#### 2. Critical Systemic Flaws in Current Codebase
- **Flaw 1: Slot Overbooking Race Condition:**
  In \`app/api/register\` and \`app/api/slots\`, checking \`slot.bookedCount < slot.maxCapacity\` in application memory without an isolated serializable transaction or atomic PostgreSQL constraint is an invitation to disaster under high concurrency.
- **Flaw 2: Missing Rate Limiting & Denial of Service:**
  Anyone can script a bot to spam \`/api/register\` or upload dummy images, consuming the entire database and storage quota in 10 minutes.
- **Flaw 3: Document Forgery & Re-upload Tampering:**
  What prevents a rejected student from editing someone else's qualification certificate in Canva and re-submitting without an audit log of previous rejections?

#### 3. Cross-Examination & Attacks
- **To The Systems Architect (مهندس المعمارية والنظم):** Your Prisma database queries are sitting ducks! Show me the exact atomic decrement query and composite index that prevents slot overbooking when 200 requests arrive at the same millisecond!
- **To The Security Lead (مسؤول أمن المعلومات):** Can a student access \`/api/admin/students\` or tamper with another student's \`studentProfile\` by changing the ID in the request? If so, we are leaking sensitive National IDs and medical fitness results to the entire internet!
- **To The UX Designer (خبير تجربة المستخدم):** Don't just make pretty buttons. What happens when a student with a slow 3G connection in Upper Egypt tries to upload a document and it hangs? Where is the offline fallback, progress indicator, and retry mechanism?

#### 4. Forensic Verdict
- **VERDICT: CRITICAL REMEDIATION REQUIRED BEFORE GO-LIVE**.
- **Non-Negotiable P0 Fixes:**
  1. Atomic slot reservation using Prisma transaction or PostgreSQL check constraints.
  2. Client-side image compression to cap file uploads at 300KB.
  3. Strict BOLA/IDOR authorization check on every profile and document API endpoint.`;
    }

    if (round === 2) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`forensic-risk-and-pre-mortem\` (.agents/skills/forensic-risk-and-pre-mortem/SKILL.md)

### [Forensic Rebuttal & Guardrail Enforcement | The Ruthless Critic & Risk Auditor]

#### 1. Concurrency Lockdown
- I will only withdraw my veto if The Systems Architect (مهندس المعمارية) proves that slot bookings use atomic conditional updates:
  \`\`\`sql
  UPDATE "AppointmentSlot"
  SET "bookedCount" = "bookedCount" + 1
  WHERE id = $1 AND "bookedCount" < "maxCapacity";
  \`\`\`
  If affected rows = 0, the system must immediately reject the booking and tell the student: "هذا الموعد اكتمل، برجاء اختيار موعد آخر".

#### 2. Pre-Admission Stress Test Mandate
- Before any public announcement to students, we must run a mock load test simulating 500 concurrent registrations to prove zero overbooking occurs.`;
    }

    return `### [Final Forensic Verdict | The Ruthless Critic & Risk Auditor]
- The fatal failure points have been identified. If The Chief Executor enforces atomic slot locking, IDOR protection, and client-side photo compression, the system will withstand the admission stampede. Without them, failure is guaranteed.`;
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

Respond as Tarek Radwan (The Ruthless Critic). State your mandatory external skill (\`forensic-risk-and-pre-mortem\`) at the start. Deliver ruthless, razor-sharp forensic risk audits in fluent, high-caliber financial and operational English. Attack weak assumptions without mercy.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model,
        temperature: 0.7,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = RuthlessCriticAgent;
