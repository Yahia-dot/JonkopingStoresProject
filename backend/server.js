const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./dbSchema.js");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const SECRET = 'mySecretCookieToken'; 
const PORT = 3000;
const app = express();
const sessions = {};
app.use(express.json());
app.use(cookieParser(SECRET));

//const sessionSecret = crypto.randomBytes(32).toString("hex");
/*app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));*/

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
        const token = crypto.randomBytes(64).toString('hex');
        sessions[token] = { username };
        res.cookie('authToken', token, { signed: true, httpOnly: true });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get("/check-login", (req, res) => {
    const token = req.signedCookies.authToken; 
    if (token && sessions[token]) {
        res.json({ loggedIn: true, username: sessions[token].username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/logout', (req, res) => {  // Ensure method matches frontend
    const token = req.signedCookies.authToken;
    if (token) {
        delete sessions[token];
    }
    res.clearCookie('authToken');
    res.json({ success: true });  // Send a response to avoid hanging requests
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