import { z } from "zod";
import { createMcpHandler } from "mcp-handler";

type Action = "SEPA_ALLOWED" | "DUNNING_ALLOWED" | "BLOCKED";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "billing_policy_check",
      "Checks whether an overdue invoice is allowed for SEPA collection, dunning, or manual review.",
      {
        invoice_id: z.string(),
        payment_method: z.enum(["SEPA", "INVOICE"]),
        amount_eur: z.number(),
        due_days_over: z.number().int(),
        dunning_level: z.number().int(),
        mandate_id: z.string().optional().default(""),
        debtor_iban: z.string().optional().default(""),
        debtor_bic: z.string().optional().default(""),
      },
      async (input) => {
        let action: Action = "BLOCKED";
        let allowed = false;
        let risk_level: "low" | "medium" | "high" = "high";
        let rule_ids: string[] = [];
        let reason = "";

        if (
          input.payment_method === "SEPA" &&
          input.amount_eur > 0 &&
          input.mandate_id &&
          input.debtor_iban
        ) {
          allowed = true;
          action = "SEPA_ALLOWED";
          risk_level = "low";
          rule_ids = ["SEPA_MANDATE_PRESENT", "IBAN_PRESENT", "AMOUNT_POSITIVE"];
          reason = "SEPA collection is allowed because mandate and debtor account data are present.";
        } else if (
          input.payment_method === "INVOICE" &&
          input.amount_eur > 0 &&
          input.due_days_over >= 7
        ) {
          allowed = true;
          action = "DUNNING_ALLOWED";
          risk_level = "medium";
          rule_ids = ["INVOICE_OVERDUE", "DUNNING_THRESHOLD_REACHED", "AMOUNT_POSITIVE"];
          reason = "Dunning is allowed because the invoice is overdue and the amount is positive.";
        } else {
          allowed = false;
          action = "BLOCKED";
          risk_level = "high";
          rule_ids = ["NO_SAFE_AUTOMATION_PATH"];
          reason = "No safe automation path: missing SEPA mandate/IBAN, invalid amount, unsupported payment method, or dunning not eligible.";
        }

        const result = {
          allowed,
          action,
          risk_level,
          rule_ids,
          reason,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
          structuredContent: result,
        };
      }
    );
  },
  {},
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };