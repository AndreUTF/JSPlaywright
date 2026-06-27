---
name: web-test-agent
description: Analyzes any webpage dynamically, drafts a QA test plan, maps the DOM interactive elements, and implements standard Page Object Model (POM) classes and Playwright tests. Use when the user asks to write tests for a specific webpage or URL.
---

# Web Test Agent Skill

This skill guides Gemini CLI through the process of analyzing a live webpage, drafting a robust QA test plan, checking DOM interactive elements, and implementing those tests using the **Page Object Model (POM)** pattern.

## Core Workflow

Always follow these steps when asked to generate tests for a webpage or URL:

### 1. Extract Webpage DOM Elements
Before making assumptions about page IDs or classes, run the bundled script `scripts/fetch_dom.cjs` on the target URL. This launches a headless browser, waits for loading, and extracts only the interactive, visible elements (inputs, buttons, select menus, links) to keep token consumption low and selector matching 100% accurate.

Execute the script using the shell command:
```bash
node <path-to-skill-directory>/scripts/fetch_dom.cjs <target-url>
```

Analyze the JSON output to identify the exact page title, interactive elements, tag types, and critical attributes (such as `id`, `name`, `placeholder`, `role`, and `classes`).

### 2. Draft a Structured QA Test Plan
Review the extracted elements and define a clear QA test plan. The plan must cover:
* **Positive Flows:** Successful form submissions, search actions, navigations, or selections with expected success states.
* **Negative/Validation Flows:** Error message checks, blank inputs, invalid credentials, or improper selections.
* **Edge Cases:** Boundary values or dynamic content loading if applicable.

Present this test plan clearly to the user before writing code.

### 3. Implement Page Objects (POM)
Create a new Page Object file inside the `pages/` directory (e.g., `pages/ContactUsPage.js`):
* Extend `BasePage` if a shared base class exists in the workspace.
* In the `constructor`, declare Playwright locators using the exact `id`, `name`, `type`, or `classes` discovered in the DOM JSON output (e.g., `this.emailInput = page.locator('#email')`).
* Expose highly descriptive, reusable asynchronous methods for page actions (e.g., `async submitContactForm(email, message)`).

### 4. Implement Test Specifications
Create a new test spec file inside the `tests/` directory (e.g., `tests/contactUs.spec.js`):
* Import `test` and `expect` from `@playwright/test`.
* Import your new Page Object.
* Write clean, readable test blocks (`test(...)`) that instantiate the Page Object and execute your test plan steps.
* Always assert final states (e.g., landing page headers, successful alert banners, error messages).

### 5. Validate the Implementation
Run the test runner using:
```bash
npm test
```
Verify that all test cases execute cleanly and pass. If any tests fail, adjust your locators or waiting logic based on the DOM structure and retry.

---

## Example Workflow

If the user says: *"Write tests for the login page at https://example.com/login"*

1. **You run:**
   ```bash
   node ./web-test-agent/scripts/fetch_dom.cjs https://example.com/login
   ```
2. **You parse the DOM elements:**
   * Discovering: `input[id="username"]`, `input[id="password"]`, `button[type="submit"]`.
3. **You propose a plan:**
   * Test 1: login with valid credentials (assert dashboard header).
   * Test 2: login with empty username (assert validation alert).
4. **You write the Page Object (`pages/LoginPage.js`):**
   ```javascript
   import { BasePage } from './BasePage.js';
   export class LoginPage extends BasePage {
     constructor(page) {
       super(page);
       this.username = page.locator('#username');
       this.password = page.locator('#password');
       this.submit = page.locator('button[type="submit"]');
     }
     async login(u, p) {
       await this.fill(this.username, u);
       await this.fill(this.password, p);
       await this.click(this.submit);
     }
   }
   ```
5. **You write the spec (`tests/login.spec.js`) and run `npm test` to verify.**
