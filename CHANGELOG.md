# Changelog

This file records repository changes and what has been verified in AWS.

## Formative 1 — Project foundation

- Set up the Umoja Next.js application and PostgreSQL-backed event creation and listing.
- Connected the event list, event form, and RSVP flow to the API, including capacity checks.
- Added Jest coverage and local setup instructions.

## Formative 2 — Containers and CI

- Added a Dockerfile and Docker Compose setup for the app and PostgreSQL.
- Added container health checks and pull-request CI for type checking, linting, Jest, and image builds.

## Formative 3 — Infrastructure and security

- Added modular Terraform for AWS networking, security groups, and compute resources, with variables, outputs, and setup documentation.
- Added Ansible roles for host setup, Docker, deployment, firewall rules, and SSH hardening, with EC2 inventory support.
- Added dependency, Terraform, and container image scans to pull-request CI; recorded findings and accepted risks in `SECURITY.md`.
- Added attendance check-in and volunteer history API and dashboard support.

## Summative — Production pipeline

- Extended Terraform for private app and database subnets, a bastion host, a private app VM, managed PostgreSQL, and private ECR.
- Added GitHub OIDC for AWS access and a `main`-branch deployment workflow that builds and scans the image, pushes it to ECR, and runs Ansible through the bastion.
- PR #92 added safe health-check diagnostics. The failed deployment exposed an RDS certificate trust error (`SELF_SIGNED_CERT_IN_CHAIN`).
- PR #94 promoted the RDS CA bundle and full certificate verification to `main`.
- Production run [#45700951448](https://github.com/DphenomenalALU/Umoja-app/actions/runs/45700951448) passed CI, image build and push, and Ansible deployment, including the app and database health task. The public URL still needs an independent check.
