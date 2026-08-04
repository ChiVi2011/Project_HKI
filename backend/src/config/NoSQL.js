const monogDB = require("mongoose");

async function connectNoSQL() {
  try {
    await monogDB.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (erro) {
    console.error("❌ MongoDB not connect");
    process.exit(1);
  }
}
module.exports = connectNoSQL;
