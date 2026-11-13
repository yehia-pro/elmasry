---
name: owasp-api-security-top10
description: "OWASP API Security Top 10 guidelines for Next.js App Router, REST APIs, BOLA/IDOR prevention, JWT hardening, and sensitive data protection."
---

# OWASP API Security Top 10 Guidelines

## Mandatory Checklist
1. **API1:2023 - Broken Object Level Authorization (BOLA / IDOR)**:
   - Never trust student ID / user ID sent in request body or URL params.
   - Always verify that the authenticated session (`req.user.id`) owns the resource or has `ADMIN` / `DOCTOR` role before returning or updating profiles, documents, or medical records.
2. **API2:2023 - Broken Authentication**:
   - Secure HTTP-only, SameSite=Strict cookies with `secure: process.env.NODE_ENV === 'production'`.
   - Never expose `JWT_SECRET` or weak fallback keys.
   - Enforce rate limiting on `/api/auth/login` and `/api/register`.
3. **API3:2023 - Broken Object Property Level Authorization**:
   - Mass assignment prevention: Never pass unvalidated `req.body` directly into `prisma.studentProfile.update({ data: req.body })`.
   - Protect sensitive fields like `status`, `role`, and `doctorNotes` from student tampering.
4. **API4:2023 - Unrestricted Resource Consumption**:
   - Enforce strict file upload size limits (e.g. 5MB max).
   - Validate magic bytes / MIME types for uploaded image/PDF files, not just file extensions.
   - Enforce pagination on student list endpoints (`/api/admin/students`).
5. **API8:2023 - Security Misconfiguration & CORS**:
   - Strip stack traces from production error responses.
   - Mask National ID and phone numbers in shared logs.

