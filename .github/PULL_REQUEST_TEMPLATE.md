Please provide enough information so that others can review your pull request.

**Motivation**

Explain the **motivation** for making this change. What existing problem does the pull request solve?

If this pull request addresses an existing issue, link to the issue. If an issue is not present, describe the issue here.

**Test plan**

Describe the **steps to test this change** so that a reviewer can verify it. Provide screenshots or videos if the change affects UI.

The change must pass lint, typescript and tests.

When the proposed change is going to be included in the npm package make sure to [add a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) (`yarn changeset`). Documentation and CI improvements need an empty changeset (`yarn changeset --empty`) to satisfy the CI check.