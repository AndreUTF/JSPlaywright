# JS Playwright Testing Framework

A simple, straightforward automated testing framework built with Playwright and JavaScript. It demonstrates **UI testing** with direct Playwright locators and **REST API testing** using Playwright's native request capabilities.

## Directory Structure

```text
JSPlaywright/
├── tests/                    # Playwright Test Specs
│   ├── auth.spec.js          # Authentication flow test suite (UI)
│   ├── ui.spec.js            # General UI components test suite (UI)
│   ├── heroku.spec.js        # Heroku homepage E2E test suite (UI)
│   └── api.spec.js           # REST API test suite using Playwright request
├── playwright.config.js      # Global Playwright Configuration
└── package.json              # NPM Package configuration and scripts
```

## Architectural Design

### 1. UI Testing
Tests interact directly with Playwright locators (e.g. `page.locator('#username')`) inside each spec file. There is no Page Object abstraction layer — each test is self-contained and easy to read top to bottom.

### 2. API Testing
We utilize Playwright's built-in `request` fixture (an instance of `APIRequestContext`) in `tests/api.spec.js` to execute REST API tests directly.
* Tests validate `GET`, `POST`, `PUT`, and `DELETE` requests against a public, standard endpoint (`https://jsonplaceholder.typicode.com`).
* Asserts response status, success status flags (`response.ok()`), and schema/body properties.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or above recommended)

## Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

## Running Tests

We have configured several convenient NPM scripts inside `package.json`:

* **Run all tests (headless):**
  ```bash
  npm test
  ```

* **Run tests in headed mode (visible browser):**
  ```bash
  npm run test:headed
  ```

* **Run tests in Playwright interactive UI mode:**
  ```bash
  npm run test:ui
  ```

* **Show the last test execution HTML report:**
  ```bash
  npm run test:report
  ```

---

## Test Coverage Summary

### UI Test Cases (`tests/auth.spec.js`, `tests/ui.spec.js`, `tests/heroku.spec.js`)
* **Successful Login & Logout:** Navigates to the login page, logs in with valid credentials, asserts landing page heading, logs out, and validates redirection message.
* **Failed Login:** Navigates to the login page, attempts login with invalid credentials, and asserts the correct warning alert is visible.
* **Checkboxes:** Navigates to `/checkboxes`, asserts default check states, checks checkbox 1, unchecks checkbox 2, and validates state changes.
* **Dropdown Selection:** Navigates to `/dropdown`, selects different options by their values, and asserts that the corresponding text matches the selection.
* **Heroku Homepage:** Verifies the page title and key interactive elements, navigation to the pricing page, and redirection to the sign-up page.

### API Test Cases (`tests/api.spec.js`)
* **Fetch Post (GET):** Validates retrieval of a specific resource.
* **Create Post (POST):** Validates resource creation with JSON payload and proper status code `201`.
* **Update Post (PUT):** Validates modifications to resource values.
* **Delete Post (DELETE):** Validates removal of resources with proper status code `200`.
