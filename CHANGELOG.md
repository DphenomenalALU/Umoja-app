# Changelog

All notable changes to Umoja, grouped by course milestone. Pull request numbers refer to this repository.

## Summative: Complete DevOps pipeline (Nov 2026)

### Added
- Continuous deployment workflow (`.github/workflows/cd.yml`) that runs only on pushes to `main`: reuses all CI checks, builds and scans the image with Trivy, pushes an immutable `umoja:<commit SHA>` tag to private ECR, then runs the Ansible playbook on the private VM through the bastion (#85, #89).
- GitHub Actions OIDC deploy role, so no long-lived AWS keys are stored in GitHub (#85, #89).
- Public access through an nginx reverse proxy on the bastion host, exposed as the `application_url` Terraform output (#85).
- Health-check diagnostics: `/api/health` logs the PostgreSQL error code, and Ansible prints it when the container health check fails (#92).

### Changed
- Removed the planned load balancer module and routed public traffic through the bastion proxy instead (#85).
- Database routes now run at request time instead of during the build (#90).
- The app connection uses `sslmode=verify-full` (#94).

### Fixed
- Production containers failed their health check with `SELF_SIGNED_CERT_IN_CHAIN` because Node did not trust the Amazon RDS certificate authority. Ansible now installs the RDS CA bundle and sets `NODE_EXTRA_CA_CERTS` (#91, #94).
- AWS CLI v2 install on Ubuntu hosts, the OIDC subject claim, and the RDS backup retention period for free-tier accounts (#88, #89).

## Formative 3: Infrastructure as Code and DevSecOps (Nov 2026)

### Added
- Modular Terraform in `terraform/` (networking, security, compute, database, ecr, github-deploy): VPC with public and private subnets, private application VM, bastion host, managed PostgreSQL on RDS, security groups, and a private ECR repository (#59).
- Ansible playbook in `ansible/` with base, docker, security and app roles, dynamic EC2 inventory, and Ansible Vault for secrets (#59).
- Trivy IaC scanning of Terraform in CI that fails on HIGH/CRITICAL findings, plus documented findings, fixes and accepted risks (#59, #63).
- Ansible syntax check in CI (#63).
- Organizer access control for attendance and volunteer records (#59).

### Fixed
- Aligned infrastructure variables with the scans, kept SSH on port 22, and stopped rebuilding containers on every Ansible run (#59, #63).

## Formative 2: Containerization and CI (Nov 2026)

### Added
- Multi-stage `Dockerfile` that runs the Next.js standalone server as a non-root user, with a built-in health check (#24).
- `docker-compose.yml` local stack with PostgreSQL, a health-gated startup, and automatic schema migration (#24).
- `GET /api/health` readiness endpoint that checks the database connection (#24).
- CI workflow on every pull request: dependency audit, type check, ESLint, Jest, image build, and Trivy container scanning that fails on HIGH/CRITICAL (#24, #59).
- Jest coverage for check-in and volunteer profiles (#24).

## Formative 1: Project planning and baseline app (Oct 2026)

### Added
- Initial Next.js application, UI and project setup (#1).
- Event creation, listing and RSVP APIs connected to the dashboard (#23).
- Jest tests for event input validation, capacity, signups and the events route (#23).
- README aligned with the Formative 1 template, project board, and branch protection on `main` (#1, #23).
