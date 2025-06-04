# Netherlands Visa Sponsorship Checker — IND List Extension

A browser extension that helps jobseekers and recruiters on LinkedIn quickly identify companies recognized by the Dutch Immigration and Naturalisation Service (IND) as visa sponsors for regular labor and highly skilled migrants.

---

## Features

- **Badge Injection:** Automatically adds a "has sponsorship" badge next to company names on LinkedIn job and company pages if the company is on the official IND sponsorship list.
- **Company Info Dialog:** Clicking the badge opens a dialog showing the company's full name and IND registration ID (KvnID).
- **Auto-Update Sponsor List:** Periodically fetches the latest IND recognized sponsors from the official public register.
- **Enable/Disable Toggle:** Popup UI toggle to enable or disable the extension's functionality.

---

## How it works

1. The extension fetches and caches a JSON list of recognized IND sponsors from [ind.nl](https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants).
2. On LinkedIn job listings and company pages, it scans company names.
3. If a company matches an IND sponsor, it injects a green sponsorship badge next to the company name.
4. Clicking the badge opens a modal with company sponsorship details.

---

## Installation

> **Note:** This extension is **not yet published on any browser store**.  
> To use it, you need to manually load the built extension into your browser.

### How to load the extension manually

#### Firefox
1. Download the extention from releases page or build it using the provided build scripts (`bunx wxt zip -b firefox`).
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on**.
4. Select the built `.zip` file or the extracted folder containing the extension manifest.

#### Chrome
1. Download the extention from releases page or build it using the provided build scripts (`bunx wxt zip`).
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle top-right).
4. Click **Load unpacked**.
5. Select the folder where the extension was built/extracted.

#### Microsoft Edge
1. Download the extension from releases page or build it using the provided build scripts (`bunx wxt zip`).
2. Open Edge and go to `edge://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the built extension folder.

---

Remember to reload the extension after any changes. The extension uses local browser storage and fetches updated data regularly.

---

## Additional Information

- The IND sponsor list is automatically **fetched and updated every hour** to ensure the extension uses the most recent data.
- This project includes **GitHub Actions workflows that build and release the extension**, providing a secure and automated build process.
- The extension is safe to use, with data fetching done transparently and securely through scheduled jobs and local browser storage.



## Development

- Built with [WXT](https://wxt.dev/) + [Svelte](https://svelte.dev/) + [TypeScript](https://www.typescriptlang.org/)
- Uses `fetch-and-update.cjs` to scrape and update `indList.json`.
- Data stored in browser local storage for caching.
- Automatic badge injection and modal dialog built with Svelte components.

---

## Directory structure

- `fetch-and-update.cjs`: Node script to scrape IND sponsors from official site and generate `indList.json`.
- `indList.json`: Cached list of IND sponsors.
- `src/`: Source files including Svelte components, entry points (background, content, popup), and utilities.
- `.github/workflows/`: GitHub Actions workflows for CI/CD.

---

## Permissions

- Access to LinkedIn domains for content injection.
- Access GitHub raw contents of this repo URLs to fetch sponsor data.
- Storage permission for local caching.

---

## Useful Links

- [IND Public Register of Sponsors](https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants)
- [GitHub Repository](https://github.com/amirrezaDev1378/ind-extention)
- [LinkedIn](https://www.linkedin.com/in/amirreza-h/)

---

## License

MIT License
