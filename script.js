let participants = [];

// Fetch participants from JSON
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        renderPool();
    })
    .catch(error => console.error("Error loading participants:", error));

const genderFilter = document.getElementById("genderFilter");
const pool = document.getElementById("pool");
const drawButton = document.getElementById("drawButton");
const winnerPopup = document.getElementById("winnerPopup");
const winnerImage = document.getElementById("winnerImage");
const winnerDetails = document.getElementById("winnerDetails");
const removeWinnerButton = document.getElementById("removeWinnerButton");
const closePopupButton = document.getElementById("closePopupButton");

let fishes = [];

// Render the pool based on gender filter
function renderPool() {
    const selectedGender = genderFilter.value; // Get selected gender
    const filteredParticipants = participants.filter(p => 
        selectedGender === "all" || p.gender === selectedGender
    );

    pool.innerHTML = "";
    fishes = [];

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 80}%`;
        fish.style.left = `${Math.random() * 80}%`;
        pool.appendChild(fish);
        fishes.push(participant);
    });
}

// Draw a random participant
function drawParticipant() {
    if (fishes.length === 0) {
        alert("No participants available for this gender!");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * fishes.length);
    const winner = fishes[winnerIndex];

    // Show the winner popup
    winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
    winnerDetails.textContent = `Name: ${winner.name}`;
    winnerPopup.classList.remove("hidden");

    // Remove the winner from the pool if the button is clicked
    removeWinnerButton.onclick = () => {
        participants = participants.filter(p => p !== winner);
        renderPool();
        winnerPopup.classList.add("hidden");
    };

    // Close the popup
    closePopupButton.onclick = () => {
        winnerPopup.classList.add("hidden");
    };
}

// Update pool when gender changes
genderFilter.addEventListener("change", renderPool);

// Draw participant when the draw button is clicked
drawButton.addEventListener("click", drawParticipant);
