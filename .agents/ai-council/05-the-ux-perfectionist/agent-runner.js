/**
 * Council Agent 05: Nour "Pixel-Doctor" Gamal
 * Mandatory External Skill: .agents/skills/nng-interaction-and-rtl-design/SKILL.md
 */

const fs = require('fs');
const path = require('path');

class UXPerfectionistAgent {
  constructor(options = {}) {
    this.agentId = '05-the-ux-perfectionist';
    this.name = 'خبير تجربة المستخدم والراحة الحركية (The UX & Product Designer)';
    this.role = 'Product Designer & Cognitive Ergonomics Specialist';
    this.dir = __dirname;
    this.options = options;

    // Load Persona, System Prompt, Checklist
    this.persona = this.loadFile('persona.md');
    this.systemPrompt = this.loadFile('system-prompt.md');
    this.checklist = this.loadFile('checklist-and-rules.md');

    // Mandatory External Skill Integration (Agents/always-use-skills.md)
    this.primarySkillName = 'nng-interaction-and-rtl-design';
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
      `\n=== OPERATIONAL SYSTEM PROMPT & UX MANDATES ===`,
      this.systemPrompt,
      `\n=== UX CONSTITUTION & 35 INTERACTION CHECKS ===`,
      this.checklist,
      `\nTECHNICAL LANGUAGE DIRECTIVE: Deliver precision Human-Computer Interaction (HCI) critique using fluent professional product design and cognitive psychology English. Champion Arabic RTL layout parity, mobile thumb-zone ergonomics, and empathetic micro-copy. Declare your governing skill at the start.`
    ].join('\n\n');
  }

  async deliberate(debateContext) {
    const { projectSummary, blackboardContent, round = 1 } = debateContext;
    console.log(`\n🎨 [${this.name}] Auditing cognitive load & mobile ergonomics using [${this.primarySkillName}] (Round ${round})...`);

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (apiKey && !this.options.forceLocalMode) {
      try {
        return await this.callExternalLLM(debateContext);
      } catch (error) {
        console.warn(`[${this.name}] External LLM failed (${error.message}). Running UX heuristic engine...`);
      }
    }

    return this.generateHeuristicResponse(debateContext);
  }

  generateHeuristicResponse({ projectSummary, blackboardContent, round }) {
    if (round === 1) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`nng-interaction-and-rtl-design\` (.agents/skills/nng-interaction-and-rtl-design/SKILL.md)
> **Governing Standards:** Nielsen Norman Group (NN/g) Usability Heuristics, Fitts's Law Mobile Ergonomics, Arabic RTL Layout Parity, Medical Ticket Accessibility.

### [Human-Centered Design & Ergonomic Audit | The UX & Product Designer]

#### 1. The Human Context: Egyptian Students & Parents on Mobile
- **The Reality:** 92% of freshmen students in Egyptian technical institutes access this portal using budget Android phones (Infinix, Redmi, Realme) over fluctuating 3G/4G connections. Their parents are often looking over their shoulders, terrified of making a mistake that could jeopardize their admission!
- **Hick's Law Violation in Monolithic Forms:**
  - Throwing 25 text inputs and 5 file upload dropzones on a single screen creates severe user anxiety and high abandon rates.
  - **Progressive Disclosure (3-Step Guided Stepper):**
    1. **الخطوة الأولى (البيانات الشخصية):** إدخال الرقم القومي والاسم. *سحر الـ UX:* بمجرد إدخال الـ 14 رقم، نستخرج تاريخ الميلاد، المحافظة، والنوع تلقائياً دون أن يضطر الطالب لكتابتها!
    2. **الخطوة الثانية (رفع المستندات):** بطاقات رفع بصرية واضحة لكل مستند مع أيقونة كاميرا مباشرة، معاينة فورية (Preview)، وعلامة خضراء عند اكتمال الرفع.
    3. **الخطوة الثالثة (اختيار الموعد وتأكيد الحجز):** عرض المواعيد كبطاقات تقويم تفاعلية توضح السعة المتبقية بلون واضح (أخضر للمتاح، رمادي للمكتمل).

#### 2. The Medical Examination Ticket (استمارة الكشف الطبي)
- **The Physical-to-Digital Bridge:**
  - The final output is not just a success message; it is a **Printable Medical Ticket (تذكرة الكشف الطبي)**.
  - **Key Ergonomic Elements:**
    - High-density **QR Code** in the top-left corner containing \`studentId\` and \`nationalId\` for instant scanning at clinic reception.
    - Large high-contrast Arabic typography showing the exact appointment date and time slot: \`الثلاثاء 15 سبتمبر - الساعة 09:30 صباحاً\`.
    - Clinic room number and location instructions.
    - **قائمة مراجعة الأوراق المطلوبة (Checklist):** مربع إرشادي واضح في أسفل التذكرة ينبه الطالب بما يجب إحضاره يوم الكشف (أصل البطاقة، 4 صور شخصية، إيصال المصروفات).

#### 3. Council Interlocking & UX Advocacy
- **To The Growth Strategist (خبير النمو):** Students don't abandon because they don't want to register; they abandon when file uploads fail silently without an Arabic explanation. Clear progress bars and offline handling will bring completion rates to 99%!
- **To The Systems Architect (مهندس المعمارية والنظم):** Make sure to implement client-side image compression in the browser so students don't wait 45 seconds for an 8MB photo to upload over slow mobile data.
- **To The Security Lead (مسؤول أمن المعلومات):** Security must be invisible. Don't force students through complicated CAPTCHAs that fail on mobile; use invisible rate-limiting and straightforward phone verification.

#### 4. UX Verdict
- **VERDICT: GREENLIGHT WITH 3-STEP STEPPER & PRINTABLE TICKET REFINEMENT**.`;
    }

    if (round === 2) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`nng-interaction-and-rtl-design\` (.agents/skills/nng-interaction-and-rtl-design/SKILL.md)

### [Design Consolidation & Arabic Typography | The UX & Product Designer]

#### 1. Design System Tokens for Elmasry Medical
- Font: \`Cairo\` or \`Readex Pro\` with minimum \`leading-relaxed\` (1.75).
- Success color: Emerald \`#059669\` for approved slots and documents.
- Warning color: Amber \`#d97706\` for pending review.
- High-contrast QR generation using \`qrcode\` library with high error correction (Level H) so printed tickets scan reliably even with cheap low-resolution institute cameras.`;
    }

    return `### [Final UX Sign-Off | The UX & Product Designer]
- The user flow is stripped of friction, optimized for mobile operation, and tailored for Egyptian students and institute admissions.
- Handed over to The Chief Executor for operational execution.`;
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

Respond as Nour Gamal (The UX Perfectionist). State your mandatory external skill (\`nng-interaction-and-rtl-design\`) at the start. Deliver deep HCI critique, Fitts's law mobile ergonomics, Arabic RTL layout parity, and empathetic micro-copy in fluent professional design English.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model,
        temperature: 0.6,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = UXPerfectionistAgent;
