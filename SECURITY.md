# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

### Preferred: GitHub Security Advisories

1. Go to [Security Advisories](https://github.com/vllnt/eslint-config/security/advisories)
2. Click "Report a vulnerability"
3. Fill in the details

### Alternative: X / Twitter DM

Send a direct message to [@bntvllnt](https://bntvllnt.com/x) with:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment

## Response Timeline

- **Acknowledgment**: within 48 hours
- **Initial assessment**: within 1 week
- **Fix release**: within 2 weeks for critical/high severity

## Scope

This package is an ESLint configuration — it runs at development time only, not in production. Vulnerabilities in transitive dependencies are tracked and patched promptly (see [#11](https://github.com/vllnt/eslint-config/issues/11) for precedent).
