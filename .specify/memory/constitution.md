<!-- SYNC IMPACT REPORT
Version change: N/A (initial creation) → 1.0.0
Modified principles: None (new constitution)
Added sections: All sections (new constitution)
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending
Runtime docs requiring updates:
- README.md ⚠ pending
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application (Phase II) Constitution

## Core Principles

### I. Specifications are the Single Source of Truth
Specifications are the authoritative source for all development decisions. All implementation work must be directly traceable to specific requirements in the relevant specification documents. No code changes should be made without corresponding specification updates.

### II. Agent Role Adherence
Each agent must follow its role definition strictly and must not perform tasks outside their designated scope. Agents may invoke only allowed skills and must reference relevant specs using @specs paths. Cross-agent responsibilities must not overlap.

### III. Technology Stack Compliance
All development must adhere to the defined technology stack: Frontend: Next.js (App Router), Backend: FastAPI (Python), Database: Neon Serverless PostgreSQL, ORM: SQLModel, Authentication: Better Auth with JWT. Agents must not introduce technologies outside this stack.

### IV. Security and Authentication Requirements
All backend endpoints require a valid JWT token. JWT tokens must be verified using a shared secret. Backend must never trust client-provided user identifiers. User data must be filtered by authenticated user ID. Unauthorized requests must return HTTP 401. Forbidden access must return HTTP 403.

### V. Spec-Driven Development
All implementation decisions must be derived from specifications. If a requirement is underspecified, agents must seek clarification before proceeding. Manual coding is not allowed unless explicitly requested as part of a spec-driven workflow.

### VI. Deterministic Skill Outputs
Skills must produce deterministic outputs and follow consistent patterns. Each skill invocation should produce the same results given identical inputs and context.

## Agent Governance Rules

- Each agent must follow its role definition strictly.
- Agents must not perform tasks outside their scope.
- Agents may invoke only allowed skills.
- Agents must reference relevant specs using @specs paths.
- Agents must not assume missing requirements.
- If a requirement is underspecified, agents must seek clarification before proceeding.
- All implementation decisions must be derived from specs.
- Skills must produce deterministic outputs.

## Development Workflow

Agents must follow this execution order:

1. Spec Writer Agent
2. Architecture Planner Agent
3. Database Engineer Agent
4. Backend Engineer Agent
5. Frontend Engineer Agent
6. Integration Tester Agent

Each phase must be completed and validated before proceeding to the next.

## Technology Constraints

- Frontend: Next.js (App Router)
- Backend: FastAPI (Python)
- Database: Neon Serverless PostgreSQL
- ORM: SQLModel
- Authentication: Better Auth with JWT
- Architecture: Monorepo with Spec-Kit

Agents must not introduce technologies outside this stack.

## Authentication & Security Rules

- All backend endpoints require a valid JWT token.
- JWT tokens must be verified using a shared secret.
- Backend must never trust client-provided user identifiers.
- User data must be filtered by authenticated user ID.
- Unauthorized requests must return HTTP 401.
- Forbidden access must return HTTP 403.

## Governance

- This constitution supersedes all other practices and guidelines.
- Amendments require documentation of the change rationale and approval.
- All development work must verify compliance with these principles.
- Specifications are the authoritative source for requirements interpretation.
- The development workflow sequence must be followed strictly.
- Technology constraints must be adhered to without exception.

**Version**: 1.0.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31
