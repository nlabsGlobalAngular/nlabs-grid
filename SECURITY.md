# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of @nlabs/grid seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly until it has been addressed

### Please DO:
1. **Report privately via GitHub Security Advisories**
   - Go to: https://github.com/nlabsGlobalAngular/nlabs-grid/security/advisories
   - Click "Report a vulnerability"
   - Fill in the details

2. **Or email directly**
   - Contact: [Create an issue with "SECURITY" label]
   - Include:
     - Description of the vulnerability
     - Steps to reproduce
     - Potential impact
     - Suggested fix (if any)

### What to Include:
- **Type of vulnerability** (XSS, injection, etc.)
- **Full path of affected source file(s)**
- **Location of the affected code** (tag/branch/commit/URL)
- **Special configuration required to reproduce**
- **Step-by-step instructions to reproduce**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability**

### Response Timeline:
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Release**: Depends on severity and complexity

### Severity Levels:
- **Critical**: Immediate attention, fix within 24-48 hours
- **High**: Fix within 1 week
- **Medium**: Fix within 2 weeks
- **Low**: Fix in next planned release

## Security Best Practices

When using @nlabs/grid:

1. **Keep Dependencies Updated**
   ```bash
   npm update @nlabs/grid
   ```

2. **Sanitize User Input**
   - The grid uses `bypassSecurityTrustHtml()` for trusted HTML
   - Never pass unsanitized user input to custom templates
   - Always validate data from external sources

3. **Content Security Policy**
   - Configure CSP headers appropriately
   - Allow inline styles if using dynamic theming

4. **Authentication & Authorization**
   - Implement proper auth for CRUD operations
   - Validate permissions on the server-side
   - Don't rely on client-side validation alone

## Known Security Considerations

### HTML Sanitization
The grid uses Angular's `DomSanitizer.bypassSecurityTrustHtml()` for developer-controlled HTML content. This is safe for:
- ✅ Static HTML templates
- ✅ Developer-defined content
- ✅ Trusted data sources

⚠️ **Never** pass user-generated content without sanitization.

### Custom Templates
When using custom cell templates:
```typescript
// ✅ SAFE - Static content
<ng-template gridCellTemplate="name" let-row>
  <strong>{{ row.name }}</strong>
</ng-template>

// ⚠️ UNSAFE - User-generated HTML
<ng-template gridCellTemplate="html" let-row>
  <div [innerHTML]="row.userGeneratedHtml"></div>  <!-- DON'T DO THIS -->
</ng-template>

// ✅ SAFE - Sanitized
<ng-template gridCellTemplate="html" let-row>
  <div [innerHTML]="sanitize(row.userGeneratedHtml)"></div>
</ng-template>
```

### Data Export
When exporting data:
- Validate data before export
- Be aware of formula injection in Excel/CSV
- Sanitize special characters

## Disclosure Policy

- Security issues will be disclosed publicly after a fix is released
- Credit will be given to reporters (unless they prefer to remain anonymous)
- We follow responsible disclosure practices

## Contact

For security concerns, please contact:

**Cuma Köse**
- LinkedIn: https://www.linkedin.com/in/turkmvc/
- GitHub: https://github.com/turkmvc

---

Thank you for helping keep @nlabs/grid and its users safe! 🔒
