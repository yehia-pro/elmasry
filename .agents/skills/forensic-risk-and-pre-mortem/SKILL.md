---
name: forensic-risk-and-pre-mortem
description: "Forensic Risk Auditing, Failure Mode & Effects Analysis (FMEA), Pre-Mortem Stress Testing, and Disaster Recovery for Mission-Critical Web Applications."
---

# Forensic Risk Auditing & Pre-Mortem Stress Testing

## Core Principles
1. **The Pre-Mortem Heuristic**: Assume the deployment failed catastrophically on day 1 of student admissions. Trace backwards:
   - What broke first? (Database connection pool exhaustion, file upload storage limits, unindexed foreign key queries).
   - What was the human bottleneck? (Doctors overwhelmed by unpaginated tables, students locked out due to expired sessions).
2. **Concurrency Stampede Elimination**:
   - Ticket slot booking must be completely atomic. Never allow race conditions where 20 spots accept 50 applicants.
   - Idempotency guarantees: Submitting the booking button multiple times must never create duplicate records or double-decrement slots.
3. **Auditability & Non-Repudiation**:
   - Every status change (`PENDING_REVIEW` -> `APPROVED` -> `COMPLETED_FIT`) must have an audit log capturing who changed it, the exact timestamp, and doctor notes.
4. **Data Integrity & Document Fraud**:
   - Check file checksums, validate Egyptian National ID checksums (Luhn-variant algorithm for Egypt's 14 digits).
   - Prevent ID spoofing and document swaps after verification.

