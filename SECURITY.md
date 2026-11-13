# Security

This file explains how Umoja checks for security problems, what the checks have found, and what we did about each finding.

## Reporting a vulnerability

Please do not open a public GitHub issue for a security problem. Contact a team member listed in the [README](README.md#team-members) directly so it can be fixed before it is made public.

## Scans we run

All scans run in GitHub Actions on every pull request.

| Scan | Tool | What it checks | Status |
| --- | --- | --- | --- |
| Dependency scan | `npm audit` | npm packages in `package-lock.json`, including development tools | Active |
| Container image scan | Trivy | The app image built from `Dockerfile`; high/critical findings in the `postgres:17` Compose image are reported | App image blocks on high/critical; PostgreSQL is report-only |
| IaC scan | Trivy | Terraform files in `terraform/` | Active |


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

> Link to the CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42730079814/job/129545570207 

The 27 findings come from only **3 advisories**. The other entries are packages that depend on the affected ones (for example, `jest` is flagged because it uses `glob`).

| Advisory | Package | Severity | Brought in by | Status |
| --- | --- | --- | --- | --- |
| [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): AbortSignal cancellation bypass allows post-timeout filesystem traversal | `glob` 10.5.0, 13.0.6 | Moderate | Jest (`@jest/reporters`, `jest-config`, `jest-runtime`, `test-exclude`) | Accepted risk |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): potential denial of service via globparts amplification | `minimatch` 9.0.9, 10.2.6 | Moderate | Jest (through `glob`) and ESLint (`typescript-eslint`) | Accepted risk |
| [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4): `mergeObject()` allows prototype poisoning of returned objects | `deepmerge` 4.3.1 | Low | Jest (`jest-config`) | Accepted risk |

**Production packages:** `npm audit --omit=dev` reports **0 findings**. None of the affected packages are part of the running app or the production Docker image, which only contains the Next.js standalone build.

### Container image scan (Trivy)

Trivy scans the app image after it is built and before it is published. The image is only pushed to the GitHub Container Registry if the scan passes.

**Base image tested:** `node:22-alpine` (Alpine 3.24.4), digest `sha256:0e1754758c2df4cfa3e68d59e2e1b7374bb7fd9ea6328eaaacf15cc934af8202` at the time of the scan.

**First result: failed.** 24 findings: 0 critical, **10 high**, 13 medium, 1 low. The high/critical check failed and the image was not published.

> CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42733822411

23 of the 24 findings were in the copy of npm that comes pre-installed in the `node:22-alpine` base image (`/usr/local/lib/node_modules/npm`), not in Umoja's own code or packages. The 10 high findings were:

| CVE | Package inside npm | Installed | Fixed in |
| --- | --- | --- | --- |
| CVE-2026-102276, CVE-2026-102278, CVE-2026-13149, CVE-2026-14257, CVE-2026-69152 | `brace-expansion` | 2.0.2 | 2.1.6 |
| CVE-2026-69192 | `ip-address` | 10.1.0 | 10.3.1 |
| CVE-2026-9496 | `pacote` | 19.0.2, 20.0.1 | 21.5.1 |
| CVE-2026-33671 | `picomatch` | 4.0.3 | 4.0.4 |
| CVE-2026-48815 | `sigstore` | 3.1.0 | 4.1.1 |

**Result after the fix: passed.** 1 finding: 0 critical, 0 high, 1 medium. The image was published.

> CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42735704060

| CVE | Package | Severity | Status |
| --- | --- | --- | --- |
| CVE-2026-4738: improper restriction of operations within the bounds of a memory buffer | `zlib` 1.3.2-r1 (Alpine system package) | Medium | Accepted risk, below the CI threshold |

The Next.js standalone app files copied into the image (26 packages) had 0 findings.

CI also scans the `postgres:17` image used by Compose and reports its HIGH and
CRITICAL findings without failing the pull request. Trivy found upstream image
vulnerabilities and a self-signed Debian test key at
`/etc/ssl/private/ssl-cert-snakeoil.key`; the key is not an Umoja credential.
The blocking container scan remains on the app image.

## Fixes made

| Fix | Findings removed | Commit |
| --- | --- | --- |
| Removed npm, npx, and corepack from the final (`runner`) stage of the `Dockerfile`. The app only needs `node` to start (`node server.js`) and for its health check. npm is still used in the build stages, which are not part of the published image. | All 23 findings in the bundled npm: 10 high, 12 medium, 1 low | `03c7862` |
| Required session tokens for the instance metadata service (`metadata_options { http_tokens = "required" }`) in `terraform/modules/compute/main.tf` | AWS-0028 (high) | `2757d2c` |
| Encrypted the instance root disk (`root_block_device { encrypted = true }`) | AWS-0131 (high) | `2757d2c` |
| Disabled automatic public IP assignment at the subnet level (`map_public_ip_on_launch = false`). The demo EC2 instance still explicitly requests a public IP; see Accepted risks. | AWS-0164 (high) | `2757d2c` |
| Limited outbound traffic from all ports to TCP 80 and 443, and added rule descriptions | AWS-0124 (low); reduced AWS-0104 (critical) | `2757d2c` |


## Securing the scanners

The scanning tools themselves can be attacked. In March 2026, attackers took over `aquasecurity/trivy-action` and moved its version tags to code that stole CI credentials ([GHSA-69fq-xp46-6x23](https://github.com/advisories/GHSA-69fq-xp46-6x23)). To protect against this:

- The workflow uses `trivy-action` by its full commit SHA (`ed142fd…`, release v0.36.0, published after the incident was fixed). A tag can be moved to different code; a commit SHA cannot.
- Trivy itself is pinned to v0.76.2, which is published as an immutable GitHub release.
- The workflow's own permissions are limited to reading the repository and publishing packages.

## Accepted risks

We accept the advisories below for now. 

| Advisory | Why we accept it | Fix we considered | Review |
| --- | --- | --- | --- |
| `glob` GHSA-3g3m-2fjr-6pw4 | Only used by Jest to find our own test files. The issue needs an attacker to control the paths `glob` searches, and Jest only searches this repository. | Fixed in `glob` 14.0.2, but Jest uses `glob` 10 and 13. Forcing 14 with npm `overrides` is a major-version jump Jest has not been tested with. `npm audit fix --force` would downgrade Jest to version 25, which is worse. | 2026-12-10, or when Jest releases an update |
| `minimatch` GHSA-g3hv-75wg-m249 | Only used by Jest and ESLint to match file patterns that we write. The issue needs an attacker to supply a crafted pattern. | Fixed in `minimatch` 11.0.1, with the same major-version problem as `glob`. `npm audit fix --force` would downgrade `eslint-config-next` to 15, which does not match our Next.js 16 version. | 2026-12-10, or when Jest or `typescript-eslint` release an update |
| `deepmerge` GHSA-gcqx-w48m-w2h4 | Only used by Jest to merge its own config. The issue needs an attacker to control the objects being merged, and Jest only reads our `jest.config.cjs`. | No fixed version exists yet; 4.3.1 is the latest release. | 2026-12-10 |
| `zlib` CVE-2026-4738 | Medium severity, below the CI threshold. It is part of the Alpine base system, and Umoja does not call it directly. | Fixed in Alpine package `zlib` 1.4-r0. It will arrive with the next `node:22-alpine` base image update. If it has not by the review date, we will upgrade it in the `Dockerfile` with `apk upgrade`. | 2026-12-10 |
| `AWS-0104` (Terraform) | Critical. The instance needs outbound web access to download system updates, Docker, and the app image. Outbound TCP is limited to the configured HTTP and HTTPS ports (80 and 443 by default). Listed in `.trivyignore` so CI passes. | An egress proxy or VPC endpoints would remove the need for public outbound access, but add cost and setup beyond this demo environment. | 2026-12-10, or before any real-community deployment |
| Public EC2 address and HTTP app port | The coursework demo needs a reachable app endpoint. The instance explicitly receives a public IPv4 address and serves HTTP on port `app_port` (3000 by default); SSH is restricted to `ssh_cidr`. Do not use real community data on this host. | Put the app behind HTTPS on a private instance and restrict app ingress to the intended audience. | 2026-12-10, or before any real-community deployment |
| `AWS-0178` (Terraform) | Medium, below the CI threshold. Flow logs record network traffic for investigations; they do not block attacks. | Add an `aws_flow_log` for rejected traffic, sent to CloudWatch Logs. This needs a log group and an IAM role, and adds cost. | 2026-12-10, or before any real-community deployment |


## Infrastructure-as-code scan

Trivy checks the Terraform configuration on each pull request. CI reports all findings and fails on high or critical findings.

**First result: failed.** 6 findings: 1 critical, 3 high, 1 medium, 1 low.

> CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42870300344

| Check | Problem | Severity | Status |
| --- | --- | --- | --- |
| AWS-0104 | Security group allows outbound traffic to any IP address on all ports | Critical | Reduced to ports 80 and 443, then accepted (see Accepted risks) |
| AWS-0028 | Instance metadata service does not require session tokens (IMDSv2) | High | Fixed |
| AWS-0131 | Instance root disk is not encrypted | High | Fixed |
| AWS-0164 | Public subnet gives instances a public IP address by default | High | Fixed at subnet level; the demo instance explicitly has a public IP (see Accepted risks) |
| AWS-0178 | VPC Flow Logs are not enabled | Medium | Accepted risk, below the CI threshold |
| AWS-0124 | Security group rule has no description | Low | Fixed |

**Second result: failed.** After the first fixes, 2 findings remained: AWS-0104 (critical) and AWS-0178 (medium).

> CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42871049391

**Final result: passed.** 1 finding: 0 critical, 0 high, 1 medium (AWS-0178). AWS-0104 is listed in `.trivyignore`.

> CI run: https://github.com/DphenomenalALU/Umoja-app/actions/runs/42871393918
 

The EC2 instance requires outbound web access to download system updates and application dependencies. Its security group allows outbound TCP on the configured HTTP and HTTPS ports only. Trivy still flags the public destination range as AWS-0104, so that finding is listed in `.trivyignore` and recorded here for review. Replace it with a narrower egress path if the deployment later adds a proxy or managed endpoints. AWS security groups cannot block DNS requests to the VPC resolver, so a separate port 53 rule is not required for this configuration.


## Run the scans locally

```bash
# All dependencies, failing at the CI threshold
npm audit --audit-level=high

# Only the packages the running app uses
npm audit --omit=dev

# Build the image, then scan it the same way CI does (requires Docker and Trivy v0.76.2)
docker build -t umoja:local .
trivy image umoja:local
trivy image --severity HIGH,CRITICAL --exit-code 1 umoja:local

# Report high and critical findings in the database image used by Compose
docker pull postgres:17
trivy image --severity HIGH,CRITICAL postgres:17

# Terraform configuration, reporting all findings
trivy config terraform/

# Terraform configuration, failing on high or critical findings
trivy config --severity HIGH,CRITICAL --exit-code 1 terraform/
```

