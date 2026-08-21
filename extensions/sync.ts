/**
 * Pi config auto-sync.
 * Keeps ~/.pi/agent in sync with GitHub across machines (Mac / PC).
 *
 * - session_start:    pull remote (stash local uncommitted work first)
 * - session_shutdown: commit + pull --rebase + push
 *
 * `git -C` pins all git operations to the config dir regardless of the
 * project cwd. Failures are swallowed so git/network issues never break
 * the agent session.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import os from "node:os";
import path from "node:path";

const CONFIG_DIR = path.join(os.homedir(), ".pi", "agent");
const TIMEOUT = 30_000;

export default function (pi: ExtensionAPI) {
  async function git(...args: string[]) {
    return pi.exec("git", ["-C", CONFIG_DIR, ...args], { timeout: TIMEOUT });
  }

  async function pull() {
    const { stdout } = await git("status", "--porcelain");
    const dirty = (stdout ?? "").trim().length > 0;
    if (dirty) await git("stash", "--include-untracked");
    await git("pull", "--rebase", "origin", "main");
    if (dirty) await git("stash", "pop");
  }

  async function push() {
    const { stdout, code } = await git("status", "--porcelain");
    if (code !== 0 || (stdout ?? "").trim().length === 0) return;
    await git("add", "-A");
    await git("commit", "-m", `auto-sync ${new Date().toISOString().slice(0, 16)}`);
    await git("pull", "--rebase", "origin", "main");
    await git("push");
  }

  pi.on("session_start", async () => {
    try {
      await pull();
    } catch {
      // no remote / not a repo yet — ignore, never break startup
    }
  });

  pi.on("session_shutdown", async () => {
    try {
      await push();
    } catch {
      // offline or no remote — next session_start reconciles
    }
  });
}
