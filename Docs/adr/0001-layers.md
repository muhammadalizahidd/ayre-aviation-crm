# ADR 0001: Four separated layers

Status: accepted. Date: 31 Oct 2026.

## Context

The product needs UI, business logic, backend and database to be separable. Today only the UI is built; the backend and database are mocked with a JSON file. A real backend (not yet chosen) will replace the mocks later.

## Decision

One Next.js app with four layers as folders and one swap point:

| Layer | Folder | Rule |
|---|---|---|
| UI | `src/app`, `src/features`, `src/ui` | Renders and collects input. No business rules. Talks to `src/bll` only |
| Business logic | `src/bll` | Plain TypeScript. No React, no Next. Uses the API client contract |
| API client | `src/api-client` | The only door to data. Today calls the in-process mock; later calls HTTP |
| Backend | `src/backend` | Endpoint-style handlers, authorization, error mapping. Uses `src/database` |
| Database | `src/database` | Repository interfaces and the JSON implementation |

`src/shared` (schemas, DTO types, roles) is a leaf every layer may import. `src/theme` is UI only.

Rules are enforced by `dependency-cruiser` (`.dependency-cruiser.cjs`, `pnpm check:layers`) and fail `pnpm verify`.

## Consequences

- Replacing the mock with a real server touches only `src/backend`, `src/database` and the transport in `src/api-client`.
- Business rules that must be authoritative on a server stay duplicated on purpose until the real backend exists; they are marked in code and the server will own them.
- Mock authentication and the in-process backend are **not security**. The UI never claims they are.
