# billing-policy-mcp

Small MCP server for a billing automation MVP.

It exposes one MCP tool:

- `billing_policy_check`

The tool receives invoice fields and returns one deterministic billing decision:

- `SEPA_ALLOWED`
- `DUNNING_ALLOWED`
- `BLOCKED`

The Make.com workflow uses this MCP server as a hard policy gate before running invoice automation.

## Endpoint

`https://billing-policy-mcp.vercel.app/api/mcp`

The root page is only the default Next.js page. The actual MCP server is the `/api/mcp` route.

## Policy logic

### SEPA allowed

SEPA is allowed when:

- payment method is `SEPA`
- amount is positive
- mandate ID exists
- debtor IBAN exists

### Dunning allowed

Dunning is allowed when:

- payment method is `INVOICE`
- amount is positive
- invoice is at least 7 days overdue

### Blocked

Everything else returns:

- `BLOCKED`

## Example tool output

    {
      "allowed": true,
      "action": "SEPA_ALLOWED",
      "risk_level": "low",
      "rule_ids": ["SEPA_MANDATE_PRESENT", "IBAN_PRESENT", "AMOUNT_POSITIVE"],
      "reason": "SEPA collection is allowed because mandate and debtor account data are present."
    }

## Run locally

    npm install
    npm run dev

## Build

    npm run build

## Note

This is an MVP/demo policy server. A real company setup would put this behind authentication, internal networking, logging, and stricter policy governance.
