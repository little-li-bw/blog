---
name: java-review-test-coverage
description: Use when reviewing Java or Spring Boot code, writing or supplementing unit tests, or checking test coverage gaps and Jacoco-style thresholds for backend modules, including 代码评审、单元测试编写、测试覆盖率分析.
---

# Java Review Test Coverage

## Overview

This skill covers three closely related tasks for Java and Spring Boot projects:

1. Code review
2. Unit test writing
3. Test coverage analysis

Keep the main workflow here concise. Load only the reference file needed for the current request.

## When to Use

Use this skill when the user asks to:

- review Java or Spring Boot code
- identify code risks, regressions, or missing tests
- write or补充 unit tests for services, controllers, mappers, or utilities
- check whether tests are complete enough
- analyze coverage gaps or Jacoco thresholds

Do not use this skill for frontend-only review or for broad architecture brainstorming with no code or test scope.

## Reference Selection

Read the matching reference file based on the request:

- Code review: [references/code-review.md](references/code-review.md)
- Unit test writing: [references/unit-test.md](references/unit-test.md)
- Coverage analysis: [references/test-coverage.md](references/test-coverage.md)

If the request spans multiple tasks, read only the relevant references and keep their roles separate.

## Workflow

### 1. Determine the mode

Choose one or more of:

- `review`
- `unit-test`
- `coverage`

### 2. Gather only the needed context

- Inspect the target files and their direct dependencies.
- For reviews, trace the critical call chain before judging behavior.
- For tests, inspect the production code and existing tests first.
- For coverage, inspect both code paths and existing test structure.

### 3. Apply the mode-specific rules

#### `review`

- Findings first, ordered by severity.
- Focus on bugs, regressions, security, performance, data consistency, thread safety, and maintainability.
- Cite concrete file locations.
- Do not rewrite code unless the user separately asks for implementation.

#### `unit-test`

- Follow test-first discipline where practical.
- Cover success, failure, boundary, and exception paths.
- Prefer JUnit 5, Mockito, and Spring Boot testing conventions already used by the project.
- Use `Given / When / Then`.
- Verify important collaborator interactions, not every trivial call.
- Keep tests deterministic and independent.

#### `coverage`

- Use actual reports when available. If no report exists, infer likely gaps from code branches and existing tests, and state that it is an inference.
- Check line, branch, method, and exception-path coverage expectations.
- Prioritize missing tests by production risk, not by raw percentage alone.
- Output missing scenarios and the next tests to add.

## Output Rules

### Review output

- List findings first.
- Use severity labels such as `Critical`, `Warning`, `Info`.
- Include file path and line when available.
- Keep the summary brief.

### Unit test output

- State the target class and test scope.
- Explain what paths are being covered.
- If code is changed, mention the new test files and the command used to run them.

### Coverage output

- Separate covered scenarios from missing scenarios.
- Call out high-risk uncovered branches first.
- Distinguish measured coverage from inferred coverage.

## Verification

- Run the narrowest relevant test command first.
- If you change tests or code, do not claim success without running verification.
- If tooling or environment blocks verification, state that explicitly.
