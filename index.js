const express = require("express");
const connectDb = require("./src/config/db");
const userRouter = require("./src/routes/main/user");
const adminRouter = require("./src/routes/main/admin");
const cookieParser = require("cookie-parser");
const seller = require("./src/routes/main/seller");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
      const developmentOrigins = [
        "http://localhost:5173", 
        "http://localhost:5175", 
        "https://frontend-chi-ashy-91.vercel.app"
      ];
      
      if (!origin || developmentOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
};
  
app.use(cors(corsOptions))
;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/seller", seller);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.json("home page");
});

const PORT = process.env.PORT;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
});
