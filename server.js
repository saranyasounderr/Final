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


   try {
       // Load tarot readings from file
       const tarotData = JSON.parse(fs.readFileSync("./data/tarot.json", "utf8"));


       // Map the numbers to the corresponding card data
       const readings = numbers.map((num) => {
           const card = tarotData.find(
               (card) => card.id === num && card.category === category
           );
           if (card) {
               return {
                   id: card.id,
                   photourl: card.photourl,  // Add the photo URL to the response
                   reading: card.reading,
               };
           } else {
               return {
                   id: num,
                   photourl: null,
                   reading: `Card ${num} has no reading.`,
               };
           }
       });
       // Respond with the readings including photo URLs
       res.json({ readings });
   } catch (error) {
       console.error("Error fetching tarot readings:", error);
       res.status(500).send({ error: "Failed to fetch tarot readings." });
   }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));





