require("dotenv").config();
const app = require("./app");
const { migrate } = require("./db/migrate");

const PORT = process.env.PORT || 5001;
const MIGRATION_RETRY_MS = 5_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runMigrationsWithRetry() {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await migrate();
      if (attempt > 1) {
        console.log(`Database migrations succeeded on attempt ${attempt}`);
      }
      return;
    } catch (err) {
      console.error(
        `Database migration attempt ${attempt} failed; retrying in ${MIGRATION_RETRY_MS}ms`,
        err,
      );
      await sleep(MIGRATION_RETRY_MS);
    }
  }
}

function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  void runMigrationsWithRetry();
}

main();
