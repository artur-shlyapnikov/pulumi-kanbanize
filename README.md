# Pulumi Kanbanize Provider Issue

This repository is a minimal example demonstrating an issue with a custom Pulumi provider for managing Kanbanize boards. The purpose of this repo is to showcase the problem and seek assistance in resolving it.

## Problem Description

The custom Pulumi provider allows you to create, update, and delete Kanbanize boards.
While the create and update methods work as expected, the delete method has a problem.
Specifically, the delete method does not pass the API key to Kanbanize, causing a HTTP 401 error.

## Repository Contents

The repo contains the following files:

- `index.ts`: The main Pulumi program that demonstrates the usage of the custom `KanbanizeBoard` resource.
- `boards-scratch.ts`: In this file, there are successful calls using the Kanbanize client, including the delete method.
- `kanbanize-client`: A folder containing the Kanbanize API client implementation, generated from the OpenAPI specification.
- `README.md`: This file, which provides an overview of the repository and the issue.

## Steps to Reproduce

1. Clone this repository.
2. Install the required dependencies by running `yarn`.
3. Set up the Pulumi stack with the appropriate configuration values for your Kanbanize account, or choose existing values from the `Pulumi.dev.yaml` file.
4. Run `pulumi up --yes` to create and update the Kanbanize boards, which should work as expected.
5. Attempt to delete a Kanbanize board using the custom provider. You should encounter the HTTP 401 error.

Any help in resolving this issue would be greatly appreciated. Thank you for taking the time to review this problem.**
