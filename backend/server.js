const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./dbSchema.js");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

const sessionSecret = crypto.randomBytes(32).toString("hex");
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

db.connectDB();
//db.createStoresTable();
//db.clearStoresTable();
// Call the function (only if you really want to drop the table)
//db.dropStoresTable();

app.use(cors({ 
    origin: "http://localhost:8086", 
    credentials: true 
}));

app.get("/", (req, res) => {
    res.send("Hello, Docker!");
});

async function insertStoresFromFile() {
    const filePath = path.join(__dirname, 'stores.json');
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const storesData = JSON.parse(data);
        await db.insertStoresData(storesData);
    } catch (err) {
        console.error('Error:', err);
    }
}
// Call the function to insert data on server startup
//insertStoresFromFile();

app.get('/stores', async (req, res) => {
    try {
        const stores = await db.getStores();
        res.json(stores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const VALID_USERNAME = "ahmad";
const VALID_PASSWORD = "ahmad";

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        req.session.user = username;
        res.cookie("auth", "true", { httpOnly: true });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get("/check-login", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("auth");
    req.session.destroy(() => res.json({ success: true }));
});

app.post("/add-stores", async (req, res) => {
    const { name, url, district, location } = req.body;
    try {
        const store = await db.add(name, url, district, location);
        res.json({ success: true, store });
    } catch (error) {
        console.error("Error inserting store:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post("/delete-stores", async (req, res) => {
    const { id } = req.body;
    try {
        await db.deleteStore(id);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting store:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post("/update-stores", async (req, res) => {
    const { id, name, url, district, location } = req.body;
    try {
        await db.edite(id, name, url, district, location);
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating store:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});