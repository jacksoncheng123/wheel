let participants = [];
let fishes = [];
const pool = document.getElementById("pool");
const genderSelect = document.getElementById("gender");
const winnerContainer = document.getElementById("winnerContainer");
const winnerMessage = document.getElementById("winnerMessage");
const addParticipantForm = document.getElementById("addParticipantForm");

// Fetch participants from participants.json
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        renderPool();
    })
    .catch(error => console.error("Error loading participants:", error));

// Render the pool with fishes
function renderPool() {
    pool.innerHTML = '';  // Clear the pool
    fishes = [];  // Clear the fishes array

    const filteredParticipants = 
        genderSelect.value === "all"
            ? participants
            : participants.filter(p => p.gender === genderSelect.value);

    if (filteredParticipants.length === 0) {
        pool.innerHTML = '<p>No participants in the pool!</p>';
        return;
    }

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 90}%`;
        fish.style.left = `${Math.random() * 90}%`;
        fish.dataset.name = participant.name;
        fish.dataset.classNumber = participant.classNumber;
        pool.appendChild(fish);
        fishes.push(fish);

        // Add fish movement
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 2000);
    });
}

// Add new participant
addParticipantForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("participantName").value;
    const gender = document.getElementById("participantGender").value;
    const classNumber = participants.length + 1; // Auto-increment class number

    const newParticipant = {
        name: name,
        gender: gender,
        classNumber: classNumber
    };

    participants.push(newParticipant);
    renderPool();
    addParticipantForm.reset();
});

// Random draw on pool click
pool.addEventListener("click", () => {
    const filteredParticipants = 
        genderSelect.value === "all"
            ? participants
            : participants.filter(p => p.gender === genderSelect.value);

    if (filteredParticipants.length === 0) {
        winnerMessage.innerHTML = "No participants available!";
        winnerContainer.classList.remove("hidden");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    displayWinner(winner);
});

// Display winner and options
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
    winnerContainer.classList.remove("hidden");
    winnerContainer.dataset.classNumber = winner.classNumber;
}

// Remove winner
function removeWinner() {
    const classNumber = winnerContainer.dataset.classNumber;
    participants = participants.filter(p => p.classNumber !== classNumber);
    renderPool();
    closeWinner();
}

// Keep winner
function keepWinner() {
    closeWinner();
}

// Close winner container
function closeWinner() {
    winnerContainer.classList.add("hidden");
}
