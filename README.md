# TS Broadband Static Website

TS Broadband is a fully static marketing and lead-generation website built with plain HTML, CSS, and vanilla JavaScript. It includes the homepage, five service detail pages, two legal pages, and a thank-you page for successful form submissions.

## Project Overview

- Fully static website with no build step
- Shared design system across all pages
- Responsive layouts for desktop, tablet, and mobile
- Web3Forms-powered enquiry form on the homepage
- Vanilla JavaScript for mobile navigation, reveal animations, year injection, and form validation

## Full Page List

- `index.html`
- `home-broadband.html`
- `business-leased-lines.html`
- `corporate-internet.html`
- `event-connectivity.html`
- `network-security.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `thankyou.html`

## Folder Structure

```text
/project
  /css
    style.css
  /js
    script.js
  /images
    favicon.svg
    og-card.svg
  index.html
  home-broadband.html
  business-leased-lines.html
  corporate-internet.html
  event-connectivity.html
  network-security.html
  privacy-policy.html
  terms-of-service.html
  thankyou.html
  README.md
```

## Web3Forms Setup Note

The homepage enquiry form submits to Web3Forms and should remain static-friendly.

Current items to keep in place on `index.html`:

- `action="https://api.web3forms.com/submit"`
- hidden `access_key`
- hidden `redirect`
- honeypot field: `name="botcheck"`

If you deploy the site on a different production domain, update the redirect URL in the homepage form so it points to your live `thankyou.html` page.

## Deployment Instructions

This project can be deployed to any static hosting provider, including:

- Netlify
- Vercel static hosting
- GitHub Pages
- cPanel hosting
- Amazon S3 + CloudFront

Deployment steps:

1. Upload the full project folder contents.
2. Make sure `index.html` is served as the site entry point.
3. Verify that all HTML files remain in the site root.
4. Confirm that `/css`, `/js`, and `/images` are uploaded without path changes.
5. Test the Web3Forms submission flow on the live domain.

No Node.js runtime, package manager, backend, or build command is required.

## Testing Checklist

- Homepage loads with the original design intact
- All service pages use the same header, footer, fonts, colors, buttons, shadows, and spacing
- Privacy Policy and Terms of Service pages match the site styling
- Thank You page loads correctly after form submission
- Header navigation works from inner pages back to homepage anchors
- Footer service links work across all pages
- Footer legal links work across all pages
- CTA buttons on inner pages point to `index.html#apply-now`
- Mobile menu opens and closes correctly
- Reveal animations load without JavaScript errors
- Homepage form validates required fields correctly
- Web3Forms action, hidden key, redirect, and honeypot field remain present
- Layout is checked at `1440px`, `1366px`, `1024px`, `768px`, `390px`, and `360px`

## Browser Testing Checklist

- Test in current Chrome
- Test in current Edge
- Test in current Firefox
- Confirm form submission and redirect in at least one production browser
- Confirm tel and mailto links open correctly on desktop and mobile

## Responsive Testing Checklist

- Check homepage hero spacing at `1440px` and `1366px`
- Check navigation collapse and card stacking at `1024px` and `768px`
- Check legal page readability and footer wrapping at `390px` and `360px`
- Confirm no horizontal scrolling at all listed breakpoints
- Confirm CTA buttons remain aligned and tappable on mobile
