import Sandbox from "@e2b/code-interpreter";
import type { Sandbox as SandboxType } from "@e2b/code-interpreter";

export async function getSandbox(sandboxId: string): Promise<SandboxType> {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}
