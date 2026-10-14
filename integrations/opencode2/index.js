// OpenCode 2 server plugin: notice when an Anthropic request is billed to extra usage instead of
// the Claude plan (`anthropic-ratelimit-unified-representative-claim: overage`, or
// `-overage-in-use: true`), log it, and tell the terminal half, which shows a warning toast.
// Link this directory into ~/.config/opencode/plugins/.
import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { BillingGuardRpc } from "./rpc.js";

const CLAIM = "anthropic-ratelimit-unified-representative-claim";
const OVERAGE_IN_USE = "anthropic-ratelimit-unified-overage-in-use";
const LOG = join(process.env.XDG_STATE_HOME || join(homedir(), ".local", "state"), "anthropic-extra-usage.log");

export default {
  id: "anthropic-billing-guard",
  async setup(ctx) {
    const rpc = await ctx.rpc.register(BillingGuardRpc, {});
    await ctx.session.hook(
      "http.response",
      (event) => {
        const h = event.response.headers;
        if (!h.has(CLAIM)) return;
        if (h.get(CLAIM) !== "overage" && h.get(OVERAGE_IN_USE) !== "true") return;
        try {
          mkdirSync(join(LOG, ".."), { recursive: true });
          appendFileSync(LOG, `${new Date().toISOString()}\topencode\t${ctx.location.directory}\t${event.request.url}\n`);
        } catch {}
        void rpc.events.emit("overage", { sessionID: event.sessionID }).catch(() => undefined);
      },
      { providerID: "anthropic" },
    );
  },
};
