require("dotenv").config();

const { migrate } = require("./migrate");

migrate()
  .then(() => {
    console.log("Migration completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed");
    console.error(err);
    process.exit(1);
  });
