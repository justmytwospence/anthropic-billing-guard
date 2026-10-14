export const BillingGuardRpc = {
  id: "anthropic-billing-guard",
  methods: {},
  events: {
    overage: {
      schema: { type: "object", properties: { sessionID: { type: "string" } }, required: ["sessionID"], additionalProperties: false },
    },
  },
};
