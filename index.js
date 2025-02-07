const express = require("express");
const connectDb = require("./config/db");
const userRouter = require("./routes/main/user");
const adminRouter = require("./routes/main/admin");
const cookieParser = require("cookie-parser");
const seller = require("./routes/main/seller");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: ['https://frondend-alpha.vercel.app',
        'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

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
