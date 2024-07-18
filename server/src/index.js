const app = require("./app.js");
const dotenv = require("dotenv").config();
const connectDB = require("./db/index.js");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    "MongoDB Connection Failed !!", err;
  });

