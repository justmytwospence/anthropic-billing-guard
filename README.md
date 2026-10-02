# anthropic-billing-guard

Warns the moment Anthropic bills a request to **extra usage** (pay per token) instead
of your Claude plan, in [pi](https://pi.dev) and [opencode](https://opencode.ai).

pi and opencode reach Claude through the Pro/Max subscription with community auth
plugins (`@gotgenes/pi-anthropic-auth`, `@ex-machina/opencode-anthropic-auth`). Any
request not shaped as Claude Code, or any request after the plan's limits run out,
is billed to extra usage. Every subscription response says which pool paid:
`anthropic-ratelimit-unified-representative-claim` is `five_hour`/`seven_day` when
the plan paid and `overage` when extra usage did
(`anthropic-ratelimit-unified-overage-in-use: true`).

Both integrations watch that header, warn (at most every ten minutes while it keeps
happening) and append one line per overage request to
`${XDG_STATE_HOME:-~/.local/state}/anthropic-extra-usage.log`. pi also shows
`extra usage xN` in the footer status. pi's own `warnings.anthropicExtraUsage` is a
static startup notice; this reports what Anthropic actually did.

## Install

- **pi:** `pi install git:github.com/justmytwospence/anthropic-billing-guard`, or add a
  checkout's path to `packages` in `~/.pi/agent/settings.json`
  (`integrations/pi/anthropic-billing-guard.ts`).
- **opencode:** link `integrations/opencode/anthropic-billing-guard.js` into
  `~/.config/opencode/plugins/`. It wraps the global `fetch`, which
  opencode-anthropic-auth calls for every Anthropic request.

## Development

```sh
npm install
npm run check   # tsc against pi's types
```
