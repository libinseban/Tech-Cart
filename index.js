const express = require("express");
const connectDb = require("./src/config/db");
const userRouter = require("./src/routes/main/user");
const adminRouter = require("./src/routes/main/admin");
const cookieParser = require("cookie-parser");
const seller = require("./src/routes/main/seller");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();


const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175", 
    "https://frontend-chi-ashy-91.vercel.app",
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { 
        callback(null, true);
    } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
    }
}
,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 204 
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/seller", seller);
app.use("/api/admin", adminRouter);

// Base route
app.get("/", (req, res) => {
    res.json("home page");
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
    res.json({ message: "CORS is working!" });
});

const PORT = process.env.PORT;


// Create HTTP server
const server = http.createServer(app);

// Socket.IO Configuration
const io = new Server(server, {
    cors: corsOptions
});

// Socket.IO event handlers
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on("sendMessage", (data) => {
        console.log("Message Received", data)
        socket.broadcast.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server
connectDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server + Socket.IO running at ${PORT}`);
    });
});

