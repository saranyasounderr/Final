document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const title = document.getElementById("category-title");
    const form = document.getElementById("selection-form");
    const readingsDiv = document.getElementById("readings");

    // Modal elements
    const modal = document.getElementById("rating-modal");
    const closeModal = document.getElementById("close-modal");
    const submitRatingButton = document.getElementById("submit-rating");
    const ratingInputs = document.getElementsByName("rating");

    title.textContent += category;

    // Event listener for the rating form submission
    submitRatingButton.addEventListener("click", async () => {
        let rating = 0;

        for (let i = 0; i < ratingInputs.length; i++) {
            if (ratingInputs[i].checked) {
                rating = ratingInputs[i].value;
                break;
            }
        }

        if (rating > 0) {
            console.log(`User rated: ${rating}`);

            const response = await fetch("/submit-rating", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rating, category })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            }

            modal.style.display = "none";
        } else {
            alert("Please select a rating.");
        }
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const numbers = document.getElementById("numbers").value.split(",").map(Number);

        if (numbers.length !== 3) {
            alert("Please enter exactly 3 numbers.");
            return;
        }

        const response = await fetch("/get-readings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, numbers }),
        });

        const data = await response.json();
        readingsDiv.innerHTML = `<p>${data.readings.join("<br>")}</p>`;

        // Delay rating modal by 7 seconds
        setTimeout(() => {
            modal.style.display = "block";
        }, 7000);
    });
});
