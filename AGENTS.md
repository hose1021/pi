# RTK - Rust Token Killer (Codex CLI)

**Usage**: Token-optimized CLI proxy for shell commands.

## Rule

**MANDATORY**: every shell command (including agent tool calls) is prefixed with `rtk`
whenever the command supports it. This includes read-only tools (`ls`, `find`, `grep`,
`which`, `git status`) and build/test/run commands (`cargo test`, `npm run build`,
`pytest -q`).

`rtk` filters CLI output to the essential lines, cutting token usage. If a command's full
output is needed, use `rtk proxy <cmd>`. If `rtk` is unavailable, fall back to a raw
command and flag it.

Commands rtk does not support (interactive TUI, long-running streams like `watch`/`top`,
pipelines with side effects, commands where filtering would alter behavior): run raw and
flag it.

Examples:

```bash
rtk git status
rtk cargo test
rtk npm run build
rtk pytest -q
```

## Meta Commands

```bash
rtk gain            # Token savings analytics
rtk gain --history  # Recent command savings history
rtk proxy <cmd>     # Run raw command without filtering
```

## Verification

```bash
rtk --version
rtk gain
which rtk
```