const express = require('express');
const cors = require("cors");
const helmet = require("helmet")
const morgan = require("morgan");
const {config} = require("dotenv");
const database = require("./config/database")
// require('dotenv').config();

const app = express();

config();

database();

app.use("/image", express.static("./uploads"))
app.use(cors({
  exposedHeaders: ['Autorization'],
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());



app.use("/api/users", require("./routes/userRoute"))

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})