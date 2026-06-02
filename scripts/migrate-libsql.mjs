import { createClient } from "@libsql/client";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");

function splitSqlStatements(sql) {
  const statements = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (!inSingle && !inDouble) {
      if (!inBlockComment && ch === "-" && next === "-") {
        inLineComment = true;
      }
      if (!inLineComment && ch === "/" && next === "*") {
        inBlockComment = true;
      }
    }

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      current += ch;
      continue;
    }

    if (inBlockComment) {
      current += ch;
      if (ch === "*" && next === "/") {
        current += "/";
        i += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (ch === "'" && !inDouble) inSingle = !inSingle;
    if (ch === '"' && !inSingle) inDouble = !inDouble;

    if (ch === ";" && !inSingle && !inDouble) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      continue;
    }

    current += ch;
  }

  const tail = current.trim();
  if (tail) statements.push(tail);
  return statements;
}

function normalizeStatement(statement) {
  return statement
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("--")) return "";
      return line;
    })
    .join("\n")
    .trim();
}

function shouldSkipStatement(statement) {
  const s = statement.trim().toUpperCase();
  return s.startsWith("PRAGMA ");
}

function checksum(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function ensureMigrationTable(client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS _manual_migrations (
      id TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getAppliedMap(client) {
  const result = await client.execute(
    "SELECT id, checksum FROM _manual_migrations ORDER BY id ASC"
  );
  return new Map(result.rows.map((r) => [String(r.id), String(r.checksum)]));
}

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.startsWith("libsql://")) {
    console.log("Skipping libsql migration runner (DATABASE_URL is not libsql).");
    return;
  }

  const client = createClient({ url: dbUrl });
  await ensureMigrationTable(client);
  const applied = await getAppliedMap(client);

  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const migrationNames = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  for (const name of migrationNames) {
    const filePath = path.join(migrationsDir, name, "migration.sql");
    let sql;
    try {
      sql = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }

    const hash = checksum(sql);
    const existing = applied.get(name);
    if (existing && existing === hash) {
      console.log(`Migration ${name} already applied.`);
      continue;
    }
    if (existing && existing !== hash) {
      throw new Error(`Migration checksum mismatch for ${name}.`);
    }

    const statements = splitSqlStatements(sql);
    console.log(`Applying migration ${name} (${statements.length} statements)...`);
    for (const rawStatement of statements) {
      const statement = normalizeStatement(rawStatement);
      if (!statement || shouldSkipStatement(statement)) continue;
      await client.execute(statement);
    }
    await client.execute({
      sql: "INSERT INTO _manual_migrations (id, checksum) VALUES (?, ?)",
      args: [name, hash],
    });
  }

  console.log("libsql migrations complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
