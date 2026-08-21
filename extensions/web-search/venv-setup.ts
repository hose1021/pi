/**
 * Web-search venv-setup adapter.
 *
 * Resolves the venv and requirements relative to this extension's own home
 * (~/.pi), NOT the session/project cwd. The old code built paths from
 * _ctx.cwd, so a global install tried to create the venv in each project's
 * .pi/ and look for requirements.txt at <project>/.pi/extensions/... where
 * it never exists. Everything now lives under ~/.pi regardless of cwd.
 */

import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExecFn } from "./types.ts";
import { ensureVenv } from "../lib/ensureVenv.ts";

// Extension's own directory (global: ~/.pi/agent/extensions/web-search).
const EXT_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Ensure web-search Python virtual environment exists with ddgs installed.
 * Venv lives in ~/.pi/agent/.venvs/web-search (machine-local, under ~/.pi).
 * Returns path to venv python3 binary (throws on failure).
 *
 * @param exec — Exec function (typically pi.exec)
 * @param onUpdate — Optional progress update callback
 * @returns Path to python3 binary (never null — throws on failure)
 * @throws EnsureVenvError if venv creation or package installation fails
 */
export async function ensureWebSearchVenv(
	exec: ExecFn,
	onUpdate?: (u: { content: Array<{ type: "text"; text: string }>; details: unknown }) => void,
): Promise<string> {
	const result = await ensureVenv({
		exec,
		cwd: join(homedir(), ".pi", "agent", ".venvs"),
		venvName: "web-search",
		pipArgs: ["-r", join(EXT_DIR, "requirements.txt")],
		verifyCommand: "import ddgs; print('ok')",
		onUpdate,
		lockTimeoutMs: 120_000, // 2 min — pip install can take 30s+ when concurrent sessions exist
	});

	return result.pythonPath;
}
