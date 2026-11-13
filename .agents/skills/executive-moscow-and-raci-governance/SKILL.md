---
name: executive-moscow-and-raci-governance
description: "High-Output Management, MoSCoW Prioritization Framework, RACI Matrix Governance, and Sprint Execution for Production Software."
---

# Executive MoSCoW Prioritization & RACI Governance

## Core Principles
1. **Ruthless MoSCoW Prioritization**:
   - **Must Have (M)**: Core medical appointment booking, student identity verification, race-condition-free slot capacity, QR ticket generation, admin review panel. Non-negotiable for go-live.
   - **Should Have (S)**: Bulk Excel export, SMS/WhatsApp confirmation, photo compression pipeline, doctor role-specific workflow.
   - **Could Have (C)**: Real-time clinic occupancy screens, multi-institute tenant switching, student feedback rating.
   - **Won't Have (W)**: Over-engineered microservices, complex billing if admission is state-funded, blockchain verification.
2. **Actionable Sprints & Definition of Done (DoD)**:
   - Code is not done when it works on localhost; it is done when database migrations run cleanly, edge cases have regression tests, and zero IDOR vulnerabilities exist.
3. **Execution Cadence**:
   - Short feedback loops. Cut non-essential scope ruthlessly to ensure the admission season launches on time without server crashes.

