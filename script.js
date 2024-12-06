let participants = [];
let fishes = [];

// Elements
const pool = document.getElementById("pool");
const winnerContainer = document.getElementById("winnerContainer");
const winnerMessage = document.getElementById("winnerMessage");
const addParticipantModal = document.getElementById("addParticipantModal");
const participantsModal = document.getElementById("participantsModal");
const addParticipantButton = document.getElementById("addParticipantButton");
const viewPoolButton = document.getElementById("viewPoolButton");
const drawButton = document.getElementById("drawButton");

// Fetch participants
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        renderPool();
    })
    .catch(error => console.error("Error loading participants:", error));

// Render the pool
function renderPool() {
    pool.innerHTML = "";
    fishes = [];

    participants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 90}%`;
        fish.style.left = `${Math.random() * 90}%`;
        pool.appendChild(fish);
        fishes.push(fish);

        // Smooth movement
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 3000);
    });
}

// Add a participant
document.getElementById("addParticipantForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("participantName").value.trim();
    const gender = document.getElementById("participantGender").value;

    if (name) {
        participants.push({
            name,
            gender,
            classNumber: 99, // Default class number
        });
        renderPool();
        addParticipantModal.classList.add("hidden");
        event.target.reset();
    }
});

// Draw a random participant
drawButton.addEventListener("click", () => {
    if (participants.length === 0) {
        alert("No participants to draw from!");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];
    displayWinner(winner);
});

// Display the winner
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}`;
    winnerContainer.classList.remove("hidden");

    window.removeWinner = () => {
        participants = participants.filter(p => p !== winner);
        winnerContainer.classList.add("hidden");
        renderPool();
    };

    window.keepWinner = () => {
        winnerContainer.classList.add("hidden");
    };
}

// Modal interactions
addParticipantButton.addEventListener("click", () => {
    addParticipantModal.classList.remove("hidden");
});

viewPoolButton.addEventListener("click", () => {
    updateParticipantsList();
    participantsModal.classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
    addParticipantModal.classList.add("hidden");
});

document.getElementById("closeParticipantsModal").addEventListener("click", () => {
    participantsModal.classList.add("hidden");
});

// Update participants list in pool
function updateParticipantsList() {
    const list = document.getElementById("participantsList");
    list.innerHTML = "";

    participants.forEach((p, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" value="${index}"> ${p.name}`;
        list.appendChild(li);
    });
}

// Remove selected participants
document.getElementById("removeSelectedButton").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#participantsList input:checked");
    const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.value));
    participants = participants.filter((_, index) => !selectedIndexes.includes(index));
    updateParticipantsList();
    renderPool();
});
