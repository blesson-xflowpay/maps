import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Pin tracing to this app so a lockfile in a parent folder (e.g. ~/yarn.lock)
// does not become the inferred workspace root.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
