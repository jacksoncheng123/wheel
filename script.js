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
        renderPool(); // Call to render the pool after data is fetched
    })
    .catch(error => console.error("Error loading participants:", error));

// Render the pool with fishes
function renderPool() {
    pool.innerHTML = '';  // Clear previous pool contents
    fishes = [];  // Clear previous fishes array

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

        // Add movement to fish
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 2000);
    });
}

// Add new participant to the pool
addParticipantForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("participantName").value;
    const gender = document.getElementById("participantGender").value;
    const classNumber = document.getElementById("participantClassNumber").value || "99";

    const newParticipant = {
        name: name,
        gender: gender,
        classNumber: classNumber
    };

    participants.push(newParticipant);
    renderPool();  // Re-render the pool
    addParticipantForm.reset();  // Reset the form
});

// Randomly draw a participant when pool is clicked
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

// Display the winner and show the option to remove or keep
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
    winnerContainer.classList.remove("hidden");
    winnerContainer.dataset.classNumber = winner.classNumber;
}

// Remove the winner from the pool
function removeWinner() {
    const classNumber = winnerContainer.dataset.classNumber;
    participants = participants.filter(p => p.classNumber !== classNumber);
    renderPool();  // Re-render the pool after removing a winner
    closeWinner();
}

// Keep the winner in the pool
function keepWinner() {
    closeWinner();
}

// Close the winner container
function closeWinner() {
    winnerContainer.classList.add("hidden");
}
