const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3003;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Helper function to read the ratings data from the JSON file
const getRatings = () => {
    const filePath = path.join(__dirname, "data", "ratings.json");
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading ratings file", err);
        return [];
    }
};

// Helper function to write the ratings data to the JSON file
const saveRatings = (ratings) => {
    const filePath = path.join(__dirname, "data", "ratings.json");
    fs.writeFileSync(filePath, JSON.stringify(ratings, null, 2), "utf8");
};

// Endpoint to submit a rating
app.post("/submit-rating", (req, res) => {
    const { rating, category } = req.body;

    // Fetch the current ratings from the JSON file
    const ratings = getRatings();

    // Create a new rating entry
    const newRating = {
        rating: parseInt(rating, 10),  // Convert to number
        category: category,
        timestamp: new Date().toISOString(),
    };

    // Add the new rating to the array
    ratings.push(newRating);

    // Save the updated ratings back to the JSON file
    saveRatings(ratings);

    // Respond to the client
    res.status(200).send({ message: "Rating received!" });
});

// Endpoint to fetch the tarot readings
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

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
