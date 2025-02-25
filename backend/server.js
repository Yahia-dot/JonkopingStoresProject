const express = require("express");
const app = express();

const cors = require("cors");

const path = require("path");

const fs = require("fs");

const PORT = 3000;


app.use(cors({
    origin: 'http://localhost:8084'//Allow only this origin to access the backend
  }));

app.get("/", (req, res) => {
  res.send("Hello, Docker!");
});

app.get("/stores", (req, res) => {
    console.log("anropas");
  
    const filePath = path.join(__dirname, "stores.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);  // Log the actual error
        res.status(500).json({ error: "Failed to read file" });
      } else {
        res.json(JSON.parse(data));
      }
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  