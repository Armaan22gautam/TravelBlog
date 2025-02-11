const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DATA_FILE = "subscriptions.json";


app.use(express.json());
app.use(cors({
    origin: "*",  
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));


function generateTransactionID() {
    return crypto.randomBytes(8).toString("hex");
}


if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}


function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8") || "[]";
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
}


function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to JSON file:", error);
    }
}


app.post("/subscribe", (req, res) => {
    const { name, email, contact, plan, price } = req.body;

    if (!name || !email || !contact || !plan || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const transactionID = generateTransactionID();
    const newSubscription = { name, email, contact, plan, price, transactionID };

    let subscriptions = readData();
    subscriptions.push(newSubscription);
    writeData(subscriptions);

    console.log(`✅ Subscription successful for ${email} - Transaction ID: ${transactionID}`);
    
    res.json({ message: "Subscription successful", transactionID });
});


app.get("/subscriptions", (req, res) => {
    res.json(readData());
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});





