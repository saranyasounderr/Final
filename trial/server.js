const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3003;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/get-readings", (req, res) => {
    const { category, numbers } = req.body;

    // Load tarot readings from file
    const tarotData = JSON.parse(fs.readFileSync("./data/tarot.json", "utf8"));
    const readings = numbers.map((num) => {
        const card = tarotData.find(
            (card) => card.id === num && card.category === category
        );
        return card ? card.reading : `Card ${num} has no reading.`;
    });

    res.json({ readings });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
