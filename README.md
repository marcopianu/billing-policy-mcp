# billing-policy-mcp

Small MCP server for a billing automation MVP.

It exposes one tool called `billing_policy_check`.

The tool receives invoice fields and returns one deterministic decision: `SEPA_ALLOWED`, `DUNNING_ALLOWED`, or `BLOCKED`.

The Make.com workflow uses this MCP server as a hard policy gate before running invoice automation.

The root page is only the default Next.js page. The actual MCP endpoint is:

https://billing-policy-mcp.vercel.app/api/mcp

## Policy logic

SEPA is allowed when the payment method is `SEPA`, the amount is positive, a mandate ID exists, and a debtor IBAN exists.

Dunning is allowed when the payment method is `INVOICE`, the amount is positive, and the invoice is at least 7 days overdue.

Everything else returns `BLOCKED`.

## Example output

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
