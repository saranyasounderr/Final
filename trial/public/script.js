document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const title = document.getElementById("category-title");
    const form = document.getElementById("selection-form");
    const readingsDiv = document.getElementById("readings");

    title.textContent += category;

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
    });
});
