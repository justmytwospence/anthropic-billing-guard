// OpenCode 2 terminal half: a warning toast, at most every 10 minutes, when the server half saw a
// request billed to Anthropic extra usage.
import { BillingGuardRpc } from "./rpc.js";

const REPEAT_MS = 10 * 60 * 1000;

export default {
  id: "anthropic-billing-guard.tui",
  setup(context) {
    let last = 0;
    const stop = context.client.rpc(BillingGuardRpc).events.on("overage", (event) => {
      if (Date.now() - last < REPEAT_MS) return;
      last = Date.now();
      context.ui.toast.show({
        title: "Anthropic extra usage",
        message: "This request was billed to EXTRA USAGE (pay per token), not your Claude plan. The plan limit is used up or the request was not shaped as Claude Code. claude.ai/settings/usage",
        variant: "warning",
        duration: 15000,
        sessionID: event.data?.sessionID,
      });
    });
    return () => stop();
  },
};
