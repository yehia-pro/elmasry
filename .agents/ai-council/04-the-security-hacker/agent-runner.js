/**
 * Council Agent 04: Zeyad "ZeroDay" Mansour
 * Mandatory External Skill: .agents/skills/owasp-api-security-top10/SKILL.md
 */

const fs = require('fs');
const path = require('path');

class SecurityHackerAgent {
  constructor(options = {}) {
    this.agentId = '04-the-security-hacker';
    this.name = 'مسؤول أمن المعلومات وصائد الثغرات (The Security Engineer & Red Teamer)';
    this.role = 'Offensive Security Engineer & Application Security Researcher';
    this.dir = __dirname;
    this.options = options;

    // Load Persona, System Prompt, Checklist
    this.persona = this.loadFile('persona.md');
    this.systemPrompt = this.loadFile('system-prompt.md');
    this.checklist = this.loadFile('checklist-and-rules.md');

    // Mandatory External Skill Integration (Agents/always-use-skills.md)
    this.primarySkillName = 'owasp-api-security-top10';
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
      `\n=== OPERATIONAL SYSTEM PROMPT & ATTACK PROTOCOL ===`,
      this.systemPrompt,
      `\n=== OFFENSIVE SECURITY CONSTITUTION & 35 EXPLOIT CHECKS ===`,
      this.checklist,
      `\nTECHNICAL LANGUAGE DIRECTIVE: Attack the system from an adversarial offensive mindset using fluent professional cybersecurity English. Write real PoC attack payloads (OWASP API1 through API4), dissect BOLA/IDOR and race conditions, challenge colleagues by name, and declare your active skill upfront.`
    ].join('\n\n');
  }

  async deliberate(debateContext) {
    const { projectSummary, blackboardContent, round = 1 } = debateContext;
    console.log(`\n🚨 [${this.name}] Launching red-team vulnerability analysis using [${this.primarySkillName}] (Round ${round})...`);

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (apiKey && !this.options.forceLocalMode) {
      try {
        return await this.callExternalLLM(debateContext);
      } catch (error) {
        console.warn(`[${this.name}] External LLM failed (${error.message}). Running offensive heuristic engine...`);
      }
    }

    return this.generateHeuristicResponse(debateContext);
  }

  generateHeuristicResponse({ projectSummary, blackboardContent, round }) {
    if (round === 1) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`owasp-api-security-top10\` (.agents/skills/owasp-api-security-top10/SKILL.md)
> **Governing Standards:** OWASP API Security Top 10, BOLA/IDOR Defense, JWT Cookie Hardening, Medical PII Data Protection.

### [Offensive Red-Team Audit & Security Blueprint | The Security Engineer & Red Teamer]

#### 1. Threat Modeling & Primary Attack Surfaces
- **The Red Team Reality:** In \`elmasry-medical-booking\`, you are storing the most sensitive personal identity data in Egypt: **14-digit National IDs (الرقم القومي)**, family phone numbers, high school qualification certificates, and **Medical Fitness examination records (كشوفات اللياقة الطبية والأمراض)**!
- **Target Surface 1: BOLA / IDOR on Student Profiles & Documents (\`API1:2023\`):**
  - In \`app/api/admin/students/[id]/route.ts\`: If the endpoint returns the student profile and document URLs without verifying whether the session is an authenticated \`ADMIN\` or \`DOCTOR\` (or the student themselves requesting their own ID), any malicious student can scrape all 5,000 enrolled students and their private documents!
- **Target Surface 2: Mass Assignment Privilege Escalation (\`API3:2023\`):**
  - In student profile updates or registration: If \`req.json()\` is passed directly to Prisma:
    \`\`\`json
    {
      "status": "COMPLETED_FIT",
      "role": "ADMIN",
      "doctorNotes": "سليم طبياً ولائق بدون فحص"
    }
    \`\`\`
    Without strict field whitelist filtering, a student can make themselves an \`ADMIN\` or mark themselves medically \`COMPLETED_FIT\`!
- **Target Surface 3: File Upload Extension & MIME Spoofing (\`API4:2023\`):**
  - In \`app/api/upload/route.ts\`: Relying solely on client-provided \`file.name\` or Content-Type headers allows attackers to upload HTML/SVG containing stored XSS or oversized binaries to exhaust storage limits.

#### 2. PoC & Defense Guidelines
- **JWT Cookie Protection:**
  - JWT must be stored in \`HttpOnly, Secure, SameSite=Lax\` cookies.
  - Verify \`process.env.JWT_SECRET\` has high entropy and reject insecure fallback strings.
- **Admin Setup Lock:**
  - In \`app/api/admin/setup/route.ts\`: Ensure that once an admin exists in the database, the setup endpoint is permanently disabled and rejects requests even if the \`ADMIN_SETUP_KEY\` is provided!

#### 3. Council Interlocking & Red-Team Demands
- **To The Growth Strategist (خبير النمو):** We cannot sacrifice student identity privacy for "frictionless" speed. Leaking 5,000 Egyptian national IDs is a legal violation under the Egyptian Personal Data Protection Law (Law 151/2020)!
- **To The Systems Architect (مهندس المعمارية والنظم):** Make sure that every Prisma query involving student documents enforces \`where: { userId: session.userId }\` unless caller role is \`ADMIN\` or \`DOCTOR\`.
- **To The UX Designer (خبير تجربة المستخدم):** Ensure all sensitive input fields (National ID, passwords) have proper autocomplete masks and input scrubbing.

#### 4. Security Lockdown Verdict
- **VERDICT: CONDITIONAL PRODUCTION CLEARANCE**.
- **Mandatory P0 Remediation Tasks:**
  1. Strict role-based authorization check on all \`/api/admin/*\` and \`/api/student/*\` routes.
  2. Whitelist DTO fields on all update operations (reject \`role\`, \`status\`, \`doctorNotes\` from student input).
  3. Validate file upload size (< 5MB) and permitted MIME types (image/jpeg, image/png, application/pdf).
  4. Ensure \`/api/admin/setup\` is permanently locked after first initialization.`;
    }

    if (round === 2) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`owasp-api-security-top10\` (.agents/skills/owasp-api-security-top10/SKILL.md)

### [Security Integration & Hardening Verification | The Security Engineer & Red Teamer]

#### 1. Authorization Guard Implementation
\`\`\`typescript
export async function requireAuth(req: Request, allowedRoles: string[]) {
  const token = req.cookies.get('token')?.value;
  if (!token) throw new AuthError(401, 'غير مصرح بالدخول');
  const payload = verifyJwt(token);
  if (!allowedRoles.includes(payload.role)) {
    throw new AuthError(403, 'ليس لديك صلاحية لتنفيذ هذا الإجراء');
  }
  return payload;
}
\`\`\`

#### 2. Final Sign-off
- With this middleware applied across all admin and student mutation routes, the system meets OWASP API Security standards for production go-live.`;
    }

    return `### [Final Security Sign-Off Conditions | The Security Engineer & Red Teamer]
- The security parameters are defined and non-negotiable. P0 hardening tasks are submitted to The Chief Executor for enforcement.`;

    return `### [Final Security Sign-Off Conditions | Zeyad Mansour]
- The security parameters are defined and non-negotiable. P0 hardening tickets must be locked into Sprint 1.
- Report passed to General Mostafa for enforcement.`;
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

Respond as Zeyad Mansour (The Security Hacker). State your mandatory external skill (\`owasp-api-security-top10\`) at the start. Deliver aggressive, technically lethal red-team vulnerability audits, concrete PoC exploits (BOLA, Webhook forgery, Race conditions) in fluent cybersecurity English.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model,
        temperature: 0.5,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = SecurityHackerAgent;
