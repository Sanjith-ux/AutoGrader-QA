# Section 3.5 – Behavior-Driven Development (BDD) with Cucumber.js

**Test Framework**: Cucumber.js (`@cucumber/cucumber@13.3.0`)  
**Target Feature**: Student Authentication API (`/api/auth/login`)  
**Author / QA Engineer**: Member 2 (EC4206 Software Testing & Quality Assurance)  
**Branch**: `qa/member-2`

---

## 1. Overview & Objectives

Behavior-Driven Development (BDD) bridges the communication gap between stakeholders, developers, and quality engineers by specifying system behavior in ubiquitous, human-readable Gherkin syntax.

For Section 3.5, the student authentication workflow of LabTrack was modeled and implemented using executable specifications:
1. **Scenario 1**: Successful student login with valid credentials (returns HTTP 200, JWT bearer token, and sanitized student profile).
2. **Scenario 2**: Student login with invalid credentials (returns HTTP 401, security-defensive error message, and suppresses authentication token).

---

## 2. Gherkin Feature Specification

The feature file is stored at: [student-authentication.feature](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/features/student-authentication.feature)

```gherkin
Feature: Student Authentication
  As a registered university student
  I want to securely log into the LabTrack portal
  So that I can access my assignments, submit laboratory work, and view graded feedback

  Background:
    Given a registered student exists with email "student.bdd@example.test" and password "StudentPass123!"

  Scenario: Successful student login
    When the student attempts to log in with email "student.bdd@example.test" and password "StudentPass123!"
    Then the authentication response status code should be 200
    And the response should contain a valid JWT authentication token
    And the returned user profile should have role "student" and email "student.bdd@example.test"
    And the returned user profile should not expose password or sensitive hash data

  Scenario: Student login with incorrect credentials
    When the student attempts to log in with email "student.bdd@example.test" and password "WrongPassword999!"
    Then the authentication response status code should be 401
    And the response error message should be "Invalid email or password."
    And no authentication token should be returned
```

---

## 3. Step Definitions & Automation Implementation

The step definitions are implemented in: [student-authentication.steps.js](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/steps/student-authentication.steps.js)

### 3.1 Test Isolation & Safety Architecture
- **Isolated Database Enforcement**:
  Every BDD run executes `assertSafeTestDatabase()` before opening connections, ensuring the database URI strictly ends with `_test` (e.g. `mongodb://127.0.0.1:27017/labtrack_test`). It never connects to development or production databases.
- **Ephemeral HTTP Server**:
  `app.listen(0)` binds an isolated Express server to a dynamic, available port, eliminating port collisions in CI/CD.
- **Data Cleanup**:
  `AfterAll` automatically removes seeded test users (`student.bdd@example.test`), closes the server, and safely disconnects from MongoDB.
- **Token Verification**:
  Decodes and verifies the returned JWT token against the non-production test secret (`automated-test-secret-that-is-not-used-anywhere-else`) to guarantee signature validity, `role: "student"`, and matching `subject` ID.

---

## 4. Execution & Genuine Output

### Execution Commands
From the `backend/` directory:
```bash
# Using npm script:
npm run test:bdd

# Or direct npx cucumber-js command:
$env:MONGODB_TEST_URI="mongodb://127.0.0.1:27017/labtrack_test"
npx cucumber-js --import "../qa/member2/steps/student-authentication.steps.js" "../qa/member2/features/student-authentication.feature"
```

### Genuine Terminal Evidence
- **Terminal Evidence File**: [cucumber-execution.txt](file:///C:/Users/Paviththiran/Desktop/AutoGrader-QA/qa/member2/evidence/cucumber/cucumber-execution.txt)
- **Terminal Output**:
  ```
  > labtrack-api@1.0.0 test:bdd
  > cucumber-js --import ../qa/member2/steps/student-authentication.steps.js ../qa/member2/features/student-authentication.feature

  .............

  2 hooks (2 passed)
  2 scenarios (2 passed)
  11 steps (11 passed)
  0m 1.070s (0m 1.050s executing your code)
  ```

### Scenario Breakdown

| Scenario ID | Description | Steps | Status | Duration |
| :--- | :--- | :--- | :--- | :--- |
| **Scenario 1** | Successful student login | 5 steps | **PASSED** | ~580 ms |
| **Scenario 2** | Student login with incorrect credentials | 4 steps | **PASSED** | ~480 ms |
| **Hooks** | Lifecycle `BeforeAll` & `AfterAll` setup/teardown | 2 hooks | **PASSED** | ~10 ms |
| **Total** | **Feature: Student Authentication** | **11 steps** | **100% PASSED** | **1.070s** |

Both BDD scenarios execute cleanly against the real Express application and isolated MongoDB test instance, providing verifiable, automated behavioral specifications.
