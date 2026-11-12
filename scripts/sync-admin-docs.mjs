// Copies the admin app's status and testing docs into this site (Admin Software tab).
// Run after those docs change:  npm run sync:admin-docs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../mahisolarsolution-frontend/docs");
const target = resolve(here, "../src/features/admin-software/content");

const files = ["OVERALL_PROJECT_STATUS.md", "TESTING_MODULE_REPORT.md"];
for (const name of files) {
  const text = readFileSync(resolve(source, name), "utf8")
    // This site has no login — never publish sign-in details.
    .split("\n")
    .filter((line) => !/^\s*Login:/i.test(line))
    .join("\n")
    .replace(/\s*Sign in as [^.]*?\(phone \+ password\)\.?/gi, "")
    .replace(/`[6-9]\d{9}`/g, "(test login)");
  writeFileSync(resolve(target, name), text);
  console.log(`synced ${name} (${text.split("\n").length} lines)`);
}
