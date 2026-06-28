# Add unit tests for token-loader.ts

## Description
This PR adds comprehensive unit test coverage for `design-system/src/utils/token-loader.ts`, addressing the lack of automated testing for token loading operations. 

The added tests ensure that regressions in token loading—such as missing files, malformed JSON, or merge collisions—are detected. The tests utilize `jest.mock('fs')` to maintain hermetic behavior, independent of the actual file system state.

## Changes
- Created `design-system/src/__tests__/token-loader.test.ts`.
- Implemented tests for `loadTokens`:
    - Valid JSON parsing.
    - Error handling for missing files.
    - Error handling for malformed JSON.
- Implemented tests for `getAllTokens`:
    - Successful merging of all token files.
    - Resilient handling of failed file loads (ensuring the function continues and logs a warning).
    - Resilient handling of malformed JSON in a single file (ensuring the function continues and logs a warning).

## Verification
- Ran `npm test -- --coverage` within the `design-system/` directory.
- Confirmed that all new tests pass.
- Verified test coverage requirements (>95%) are met for `token-loader.ts`.

## Checklist
- [x] Hermetic tests using `jest.mock`
- [x] Coverage for valid and failure paths
- [x] Console.warn verified in failure cases
- [x] >95% test coverage achieved
