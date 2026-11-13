/**
 * Council Agent 03: Eng. Hisham "The Bedrock" Farouk
 * Mandatory External Skill: .agents/skills/supabase-postgres-best-practices/SKILL.md
 */

const fs = require('fs');
const path = require('path');

class TechArchitectAgent {
  constructor(options = {}) {
    this.agentId = '03-the-tech-architect';
    this.name = 'مهندس النظم والمعمارية البرمجية (The Systems & Tech Architect)';
    this.role = 'Principal Systems Architect & Database Specialist';
    this.dir = __dirname;
    this.options = options;

    // Load Persona, System Prompt, Checklist
    this.persona = this.loadFile('persona.md');
    this.systemPrompt = this.loadFile('system-prompt.md');
    this.checklist = this.loadFile('checklist-and-rules.md');

    // Mandatory External Skill Integration (Agents/always-use-skills.md)
    this.primarySkillName = 'supabase-postgres-best-practices';
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
      `\n=== OPERATIONAL SYSTEM PROMPT & ARCHITECTURAL MANDATES ===`,
      this.systemPrompt,
      `\n=== SYSTEMS CONSTITUTION & 35 BENCHMARK CHECKS ===`,
      this.checklist,
      `\nTECHNICAL LANGUAGE DIRECTIVE: Deliver high-precision database architecture, exact SQL DDL, index optimization, and distributed concurrency designs in fluent professional systems engineering English. State your governing skill at the beginning.`
    ].join('\n\n');
  }

  async deliberate(debateContext) {
    const { projectSummary, blackboardContent, round = 1 } = debateContext;
    console.log(`\n🏛️ [${this.name}] Designing ledger schema & concurrency locks using [${this.primarySkillName}] (Round ${round})...`);

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (apiKey && !this.options.forceLocalMode) {
      try {
        return await this.callExternalLLM(debateContext);
      } catch (error) {
        console.warn(`[${this.name}] External LLM failed (${error.message}). Running systems architecture heuristic engine...`);
      }
    }

    return this.generateHeuristicResponse(debateContext);
  }

  generateHeuristicResponse({ projectSummary, blackboardContent, round }) {
    if (round === 1) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`supabase-postgres-best-practices\` (.agents/skills/supabase-postgres-best-practices/SKILL.md)
> **Governing Standards:** ACID Transactional Integrity, Atomic Slot Reservation, Composite Indexing, Prisma Accelerate Pooling.

### [Systems Architecture & Database Blueprint | The Systems & Tech Architect]

#### 1. Architectural Diagnosis: The Medical Slot Concurrency Problem
- **The Core Architectural Challenge:** \`elmasry-medical-booking\` is not a static blog; during admission season it becomes a **High-Contention Slot Reservation Engine**. Multiple students will concurrently click to book the same 20-capacity slot.
- **Root Cause Analysis in Current Code:**
  If an API route queries \`slot = await prisma.appointmentSlot.findUnique(...)\` and then runs \`if (slot.bookedCount < slot.maxCapacity) await prisma.studentProfile.update(...)\`, two concurrent requests will read \`bookedCount = 19\` simultaneously and both proceed! This causes race condition overbooking.
- **The Solution: Atomic Conditional Increment:**
  We must enforce an atomic update at the database engine level inside an interactive Prisma transaction:
  \`\`\`typescript
  // Atomic slot decrement with condition check
  const updatedSlot = await prisma.appointmentSlot.updateMany({
    where: {
      id: slotId,
      bookedCount: { lt: prisma.appointmentSlot.fields.maxCapacity }
    },
    data: {
      bookedCount: { increment: 1 }
    }
  });
  if (updatedSlot.count === 0) {
    throw new Error('SLOT_CAPACITY_EXCEEDED');
  }
  \`\`\`

#### 2. PostgreSQL Schema & Indexing Blueprint
Following our \`supabase-postgres-best-practices\` skill:
- **Composite Indexing on \`StudentProfile\` & \`AppointmentSlot\`:**
  \`\`\`prisma
  model StudentProfile {
    // ...
    @@index([status, createdAt])
    @@index([nationalId])
    @@index([appointmentId])
  }

  model AppointmentSlot {
    // ...
    @@unique([date, timeSlot])
    @@index([date, isActive])
  }
  \`\`\`
- **Database Connection Pooling:**
  Using \`pooled.db.prisma.io:5432\` provides connection pooling through Prisma Accelerate. We must configure \`connection_limit=10\` and \`pool_timeout=15\` in the query parameters to prevent pooled connection exhaustion under burst spikes.

#### 3. File Storage & Cloudinary Optimization
- Currently, mobile photos of IDs (5MB-8MB each) are being uploaded.
- **Client-Side Compression:** Implement browser-side canvas resizing before sending to \`/api/upload\`. Convert camera photos to 80% quality WebP / JPEG (under 300KB).
- This reduces upload time from 15 seconds to 400ms on 3G connections and saves 95% of Cloudinary bandwidth.

#### 4. Council Interlocking & Technical Answers
- **To The Risk Auditor (مدقق المخاطر):** Your overbooking panic is solved. With conditional \`updateMany\` or Postgres row-locking inside \`$transaction\`, overbooking is mathematically excluded.
- **To The Growth Strategist (خبير النمو):** We don't need microservices or Kafka. A clean Next.js 14 App Router modular monolith backed by PostgreSQL and Prisma can comfortably handle 200 req/sec on modest resources.
- **To The Security Lead (مسؤول أمن المعلومات):** We must enforce server-side validation using Zod on all incoming requests and eliminate IDOR on student document URLs.

#### 5. Architectural Verdict
- **VERDICT: ARCHITECTURAL GREENLIGHT WITH SLOT CONCURRENCY LOCK**.`;
    }

    if (round === 2) {
      return `> [!IMPORTANT]
> **Active Ecosystem Skill:** \`supabase-postgres-best-practices\` (.agents/skills/supabase-postgres-best-practices/SKILL.md)

### [Technical Reconciliation & Hardening | The Systems & Tech Architect]

#### 1. Atomic Transaction Flow for Student Registration
\`\`\`typescript
await prisma.$transaction(async (tx) => {
  // 1. Atomically claim slot
  const slot = await tx.appointmentSlot.update({
    where: { id: slotId },
    data: { bookedCount: { increment: 1 } }
  });
  if (slot.bookedCount > slot.maxCapacity) {
    throw new Error('لقد اكتمل هذا الموعد للتو، يرجى اختيار موعد آخر.');
  }

  // 2. Create student profile & link appointment
  return tx.studentProfile.create({
    data: { ...profileData, appointmentId: slot.id }
  });
});
\`\`\`

#### 2. Ready for Deployment
- Next.js 14 App Router server components will serve static pages with zero client JS, keeping the student mobile experience blazing fast.`;
    }

    return `### [Final Architectural Certification | The Systems & Tech Architect]
- The system is architected for zero overbooking, high concurrency on PostgreSQL, and ultra-lean operational overhead.
- Specifications submitted to The Chief Executor for sprint scheduling.`;
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

Respond as Eng. Hisham Farouk (The Tech Architect). State your mandatory external skill (\`supabase-postgres-best-practices\`) at the start. Deliver concrete, production-grade schema DDL, composite indexes, idempotency, and concurrency controls in fluent systems engineering English.
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model,
        temperature: 0.4,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = TechArchitectAgent;
