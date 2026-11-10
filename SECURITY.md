# Security

This file explains how Umoja checks for security problems, what the checks have found, and what we did about each finding.

## Reporting a vulnerability

Please do not open a public GitHub issue for a security problem. Contact a team member listed in the [README](README.md#team-members) directly so it can be fixed before it is made public.

## Scans we run

All scans run in GitHub Actions on every pull request.

| Scan | Tool | What it checks | Status |
| --- | --- | --- | --- |
| Dependency scan | `npm audit` | npm packages in `package-lock.json`, including development tools | Planned |
| Container image scan | Trivy | The Docker image built from `Dockerfile`: Alpine system packages and Node.js | Planned |
| IaC scan | TBD (Trivy config or Checkov) | Terraform files in `terraform/` | Planned, after Terraform is merged |


## Severity thresholds

Each finding has a severity: low, moderate (medium), high, or critical.

| Severity | What CI does |
| --- | --- |
| Critical | It fails the check and blocks the pull request |
| High | It fails the check and blocks the pull request |
| Moderate | Reported in the CI log, meaning it doesn't fail the check |
| Low | Reported in the CI log, meaning it doesn't fail the check |

**Why this level:** high and critical findings are the ones most likely to be exploited and usually have an available fix , so blocking on them is worth the friction. Blocking on moderate or low would stop every pull request for findings that currently have no safe fix (see the dependency findings below). Moderate and low findings are still recorded in this file and reviewed.

The dependency scan checks development packages as well as production packages. Development tools such as Jest and ESLint do not ship in the app, but they do run in CI, where the workflow has permission to publish container images.

## Findings

### Dependency scan (`npm audit`)

**Result:** 27 findings: 0 critical, 0 high, 23 moderate, 4 low. With the high/critical threshold, this scan passes.

> Source: local run of `npm audit` on 2026-11-10 (Node 22.16.0, npm 11.6.0) against the `dev` branch. Replace with a link to the first CI run once the scan is in the workflow, and update the numbers if they differ.

The 27 findings come from only **3 advisories**. The other entries are packages that depend on the affected ones (for example, `jest` is flagged because it uses `glob`).

| Advisory | Package | Severity | Brought in by | Status |
| --- | --- | --- | --- | --- |
| [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): AbortSignal cancellation bypass allows post-timeout filesystem traversal | `glob` 10.5.0, 13.0.6 | Moderate | Jest (`@jest/reporters`, `jest-config`, `jest-runtime`, `test-exclude`) | Accepted risk |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): potential denial of service via globparts amplification | `minimatch` 9.0.9, 10.2.6 | Moderate | Jest (through `glob`) and ESLint (`typescript-eslint`) | Accepted risk |
| [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4): `mergeObject()` allows prototype poisoning of returned objects | `deepmerge` 4.3.1 | Low | Jest (`jest-config`) | Accepted risk |

**Production packages:** `npm audit --omit=dev` reports **0 findings**. None of the affected packages are part of the running app or the production Docker image, which only contains the Next.js standalone build.

## Fixes made

None yet.

## Accepted risks

We accept the three dependency advisories above for now. Each acceptance has a reason and a review date.

| Advisory | Why we accept it | Fix we considered | Review |
| --- | --- | --- | --- |
| `glob` GHSA-3g3m-2fjr-6pw4 | Only used by Jest to find our own test files. The issue needs an attacker to control the paths `glob` searches, and Jest only searches this repository. | Fixed in `glob` 14.0.2, but Jest uses `glob` 10 and 13. Forcing 14 with npm `overrides` is a major-version jump Jest has not been tested with. `npm audit fix --force` would downgrade Jest to version 25, which is worse. | 2026-12-10, or when Jest releases an update |
| `minimatch` GHSA-g3hv-75wg-m249 | Only used by Jest and ESLint to match file patterns that we write. The issue needs an attacker to supply a crafted pattern. | Fixed in `minimatch` 11.0.1, with the same major-version problem as `glob`. `npm audit fix --force` would downgrade `eslint-config-next` to 15, which does not match our Next.js 16 version. | 2026-12-10, or when Jest or `typescript-eslint` release an update |
| `deepmerge` GHSA-gcqx-w48m-w2h4 | Only used by Jest to merge its own config. The issue needs an attacker to control the objects being merged, and Jest only reads our `jest.config.cjs`. | No fixed version exists yet; 4.3.1 is the latest release. | 2026-12-10 |

## Container image scan (Trivy)


## Infrastructure-as-code scan


## Run the scans locally

```bash
# All dependencies, failing at the CI threshold
npm audit --audit-level=high

# Only the packages the running app uses
npm audit --omit=dev
```

