require("dotenv").config();
const app = require("./app");
const { migrate } = require("./db/migrate");

const PORT = process.env.PORT || 5001;

async function main() {
  await migrate();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
