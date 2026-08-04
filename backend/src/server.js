require("dotenv").config();
const app = require("./app"); 
const connectDB = require("./config/database");
const connectNoSQL = require("./config/NoSQL")

connectDB(); // Connect to SQL Server
connectNoSQL(); // Connect to MongoDB

const PORT = process.env.PORT; // Cổng chạy của Server

// Start Express server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
