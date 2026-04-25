# billing-policy-mcp

Small MCP server for a billing automation MVP.

It exposes one tool:

`billing_policy_check`

The tool receives invoice fields and returns a deterministic billing decision:

- `SEPA_ALLOWED`
- `DUNNING_ALLOWED`
- `BLOCKED`

This is used by a Make.com workflow as a policy gate before any invoice automation runs.

## Endpoint

```txt
https://billing-policy-mcp.vercel.app/api/mcp
