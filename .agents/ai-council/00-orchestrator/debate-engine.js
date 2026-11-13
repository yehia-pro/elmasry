/**
 * ============================================================================
 * AI COUNCIL ORCHESTRATOR & DEBATE ENGINE (ECOSYSTEM-SKILL ENABLED)
 * ============================================================================
 * Coordinates multi-agent deliberation between the 6 specialized council agents,
 * each backed by a mandatory external skill from .agents/skills/ per Agents/always-use-skills.md:
 *
 * 1. 01-the-visionary     -> reforge-unit-economics-and-pmf
 * 2. 02-the-ruthless-critic -> forensic-risk-and-pre-mortem
 * 3. 03-the-tech-architect  -> supabase-postgres-best-practices
 * 4. 04-the-security-hacker -> owasp-api-security-top10
 * 5. 05-the-ux-perfectionist -> nng-interaction-and-rtl-design
 * 6. 06-the-chief-executor   -> executive-moscow-and-raci-governance
 *
 * Manages live multi-turn rounds and persists output to SHARED_BLACKBOARD.md.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Dynamically load agent classes from their dedicated folders
const VisionaryAgent = require('../01-the-visionary/agent-runner');
const RuthlessCriticAgent = require('../02-the-ruthless-critic/agent-runner');
const TechArchitectAgent = require('../03-the-tech-architect/agent-runner');
const SecurityHackerAgent = require('../04-the-security-hacker/agent-runner');
const UXPerfectionistAgent = require('../05-the-ux-perfectionist/agent-runner');
const ChiefExecutorAgent = require('../06-the-chief-executor/agent-runner');

class CouncilDebateEngine {
  constructor(config = {}) {
    this.baseDir = path.resolve(__dirname, '..');
    this.rootDir = path.resolve(this.baseDir, '..');
    this.blackboardPath = path.join(__dirname, 'SHARED_BLACKBOARD.md');

    this.options = {
      rounds: config.rounds || 2,
      topic: config.topic || 'منصة المعهد الفني الصناعي للكشف الطبي وحجز مواعيد الطلاب المستجدين (Elmasry Medical Booking System - Next.js 14, Prisma, PostgreSQL, Cloudinary)',
      targetPath: config.targetPath || this.rootDir,
      forceLocalMode: config.forceLocalMode || false,
      delayBetweenTurnsMs: config.delayBetweenTurnsMs || 400
    };

    // Instantiate all 6 council agents
    this.agents = [
      new VisionaryAgent({ forceLocalMode: this.options.forceLocalMode }),
      new RuthlessCriticAgent({ forceLocalMode: this.options.forceLocalMode }),
      new TechArchitectAgent({ forceLocalMode: this.options.forceLocalMode }),
      new SecurityHackerAgent({ forceLocalMode: this.options.forceLocalMode }),
      new UXPerfectionistAgent({ forceLocalMode: this.options.forceLocalMode }),
      new ChiefExecutorAgent({ forceLocalMode: this.options.forceLocalMode })
    ];
  }

  gatherProjectContext() {
    console.log(`\n🔍 [Debate Engine] Scanning project context & active skills in: ${this.options.targetPath}`);
    const summary = [];
    summary.push(`# PROJECT UNDER COUNCIL REVIEW: ${this.options.topic}`);
    summary.push(`# WORKSPACE ROOT: ${this.options.targetPath}`);

    // Scan installed skills
    const skillsDir = path.join(this.rootDir, '.agents', 'skills');
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir);
      summary.push(`\n## MANDATORY ECOSYSTEM SKILLS LOADED (Agents/always-use-skills.md):`);
      skills.forEach(s => summary.push(`- .agents/skills/${s}`));
    }

    // Scan repo structure
    try {
      if (fs.existsSync(this.options.targetPath)) {
        const items = fs.readdirSync(this.options.targetPath, { withFileTypes: true });
        const dirList = items
          .filter(i => i.isDirectory() && i.name !== '.git' && i.name !== 'node_modules' && i.name !== 'ai-council')
          .map(i => `[DIR] ${i.name}`);
        const fileList = items
          .filter(i => !i.isDirectory())
          .map(i => `[FILE] ${i.name}`);

        summary.push(`\n## WORKSPACE ARCHITECTURE OVERVIEW:`);
        summary.push([...dirList, ...fileList].slice(0, 30).join('\n'));

        // Load Prisma Schema if available
        const prismaPath = path.join(this.options.targetPath, 'prisma', 'schema.prisma');
        if (fs.existsSync(prismaPath)) {
          summary.push(`\n## DATABASE SCHEMA (prisma/schema.prisma):`);
          summary.push(fs.readFileSync(prismaPath, 'utf8'));
        }

        // Load package.json scripts and dependencies
        const pkgPath = path.join(this.options.targetPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          summary.push(`\n## PACKAGE & STACK:`);
          summary.push(JSON.stringify({ name: pkg.name, dependencies: pkg.dependencies, scripts: pkg.scripts }, null, 2));
        }
      }
    } catch (err) {
      console.warn(`[Debate Engine] Warning scanning directories: ${err.message}`);
    }

    return summary.join('\n\n');
  }

  appendToBlackboard(round, agent, content) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const entry = `
---

### 🏛️ [Round ${round}] - ${agent.name}
**Timestamp:** \`${timestamp}\` | **Role & Specialization:** *${agent.role}*

${content.trim()}
`;

    try {
      fs.appendFileSync(this.blackboardPath, entry, 'utf8');
      console.log(`📝 [Blackboard] Recorded intervention for ${agent.name}`);
    } catch (err) {
      console.error(`[Blackboard Error] Failed writing to blackboard: ${err.message}`);
    }
  }

  initBlackboard(projectContext) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const header = `# THE HIGH COUNCIL ROUNDTABLE (SHARED BLACKBOARD)
## Multi-Agent Executive Review & Systems Dissection Board (\`ai-council\`)

---

### 1. Council Charter & Rules of Engagement
* **Mission:** Subject project architecture, unit economics, offensive security, and user ergonomics to exhaustive, high-stakes peer review.
* **Skill Mandate (Agents/always-use-skills.md):** Every council member MUST anchor their review in an approved ecosystem skill and state it explicitly.
* **The Six Council Members:**
  1. **خبير النمو واستراتيجيات السوق (The Growth & Market Strategist):** Reforge Growth Loops & Asymptotic LTV/CAC Modeling (\`reforge-unit-economics-and-pmf\`)
  2. **مدقق المخاطر الفنية والمقصلة (The Ruthless Critic & Risk Auditor):** Forensic Risk Auditing & Pre-Mortem Stress-Testing (\`forensic-risk-and-pre-mortem\`)
  3. **مهندس النظم والمعمارية البرمجية (The Systems & Tech Architect):** ACID Multi-Tenant Schema & Concurrency Optimization (\`supabase-postgres-best-practices\`)
  4. **مسؤول أمن المعلومات وصائد الثغرات (The Security Engineer & Red Teamer):** Offensive Red Teaming & BOLA/IDOR Elimination (\`owasp-api-security-top10\`)
  5. **خبير تجربة المستخدم والراحة الحركية (The UX & Product Designer):** NN/g Cognitive Ergonomics & Arabic RTL Parity (\`nng-interaction-and-rtl-design\`)
  6. **المدير التنفيذي للحوكمة والتنفيذ (The Chief Executor & Governance Lead):** High-Output Management & MoSCoW Prioritization (\`executive-moscow-and-raci-governance\`)

---

### 2. Active Session Metadata
* **Session Date:** \`${timestamp}\`
* **Project Under Review:** ${this.options.topic}
* **Deliberation Protocol:** ${this.options.rounds} Full Clashing Rounds
* **Execution Mode:** High-Precision Technical Bilingual Engine (English Technical Core + Executive Slang)

---

### 3. Project & Ecosystem Context
\`\`\`
${projectContext.slice(0, 1600)}
\`\`\`

---

## 4. Live Council Deliberation Ledger
`;

    fs.writeFileSync(this.blackboardPath, header, 'utf8');
    console.log(`✅ [Debate Engine] Initialized SHARED_BLACKBOARD.md with ecosystem skills.`);
  }

  getBlackboardContent() {
    try {
      if (fs.existsSync(this.blackboardPath)) {
        return fs.readFileSync(this.blackboardPath, 'utf8');
      }
    } catch (err) {
      console.warn(`[Debate Engine] Blackboard read error: ${err.message}`);
    }
    return '';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runCouncilSession() {
    console.log(`\n================================================================`);
    console.log(`🚀 [AI COUNCIL] HIGH COUNCIL DEBATE SESSION ACTIVATED`);
    console.log(`📋 Topic: "${this.options.topic}"`);
    console.log(`🔄 Scheduled Rounds: ${this.options.rounds}`);
    console.log(`⚡ Ecosystem Skills: Active (.agents/skills/*)`);
    console.log(`================================================================\n`);

    const projectContext = this.gatherProjectContext();
    this.initBlackboard(projectContext);

    for (let round = 1; round <= this.options.rounds; round++) {
      console.log(`\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
      console.log(`🔔 [ROUND ${round} OF ${this.options.rounds}]: ${this.getRoundTitle(round)}`);
      console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n`);

      for (const agent of this.agents) {
        console.log(`\n🎙️ Floor surrendered to: ${agent.name} [${agent.role}]`);

        const debateContext = {
          projectSummary: projectContext,
          blackboardContent: this.getBlackboardContent(),
          round: round
        };

        try {
          const response = await agent.deliberate(debateContext);
          this.appendToBlackboard(round, agent, response);

          if (this.options.delayBetweenTurnsMs > 0) {
            await this.sleep(this.options.delayBetweenTurnsMs);
          }
        } catch (err) {
          console.error(`❌ [Debate Engine] Error during ${agent.name}'s turn:`, err.message);
        }
      }
    }

    const finalizeNote = `
---

## 5. Official Session Adjournment & Executive Seal
* **Adjournment Timestamp:** \`${new Date().toISOString()}\`
* **Binding Order:** The Chief Executor's Executive MoSCoW Triage & RACI Matrix are officially ratified.
* **Next Action:** Sprint 1 implementation commences immediately under the P0 charter.
`;
    fs.appendFileSync(this.blackboardPath, finalizeNote, 'utf8');

    console.log(`\n================================================================`);
    console.log(`🏁 [AI COUNCIL] Session completed and fully persisted to SHARED_BLACKBOARD.md`);
    console.log(`📄 Path: ${this.blackboardPath}`);
    console.log(`================================================================\n`);
  }

  getRoundTitle(round) {
    switch (round) {
      case 1:
        return 'Round 1: Initial Dissection, Vulnerability Exposure & Pre-Mortem Clash';
      case 2:
        return 'Round 2: Cross-Fire Rebuttals, Concessions & Operational Trade-offs';
      case 3:
      default:
        return 'Round 3: Final Binding Executive MoSCoW Verdict & RACI Sign-Off';
    }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let rounds = 2;
  let topic = 'منصة المعهد الفني الصناعي للكشف الطبي وحجز مواعيد الطلاب المستجدين (Elmasry Medical Booking System)';
  let targetPath = path.resolve(__dirname, '..', '..');
  let forceLocalMode = false;

  args.forEach(arg => {
    if (arg.startsWith('--rounds=')) rounds = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--topic=')) topic = arg.split('=')[1];
    if (arg.startsWith('--target=')) targetPath = path.resolve(arg.split('=')[1]);
    if (arg === '--local') forceLocalMode = true;
  });

  const engine = new CouncilDebateEngine({
    rounds,
    topic,
    targetPath,
    forceLocalMode
  });

  engine.runCouncilSession().catch(err => {
    console.error('Fatal engine crash:', err);
    process.exit(1);
  });
}

module.exports = CouncilDebateEngine;
