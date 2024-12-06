let participants = [];
let fishes = [];
const pool = document.getElementById("pool");
const genderSelect = document.getElementById("gender");
const winnerContainer = document.getElementById("winnerContainer");
const winnerMessage = document.getElementById("winnerMessage");

// Modals
const addParticipantModal = document.getElementById("addParticipantModal");
const participantsModal = document.getElementById("participantsModal");
const closeModal = document.getElementById("closeModal");
const closeParticipantsModal = document.getElementById("closeParticipantsModal");
const addParticipantButton = document.getElementById("addParticipantButton");
const viewPoolButton = document.getElementById("viewPoolButton");

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

    const filteredParticipants =
        genderSelect.value === "all"
            ? participants
            : participants.filter(p => p.gender === genderSelect.value);

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 90}%`;
        fish.style.left = `${Math.random() * 90}%`;
        pool.appendChild(fish);
        fishes.push(fish);

        // Smooth animation
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 3000);
    });
}

// Draw a random participant
pool.addEventListener("click", () => {
    const filteredParticipants =
        genderSelect.value === "all"
            ? participants
            : participants.filter(p => p.gender === genderSelect.value);

    if (filteredParticipants.length === 0) {
        winnerMessage.innerText = "No participants in the pool!";
        winnerContainer.classList.remove("hidden");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    displayWinner(winner);
});

// Display winner
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}`;
    winnerContainer.classList.remove("hidden");
}

// Modals for Add/View Participants
addParticipantButton.addEventListener("click", () => {
    addParticipantModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
    addParticipantModal.classList.add("hidden");
});

viewPoolButton.addEventListener("click", () => {
    updateParticipantsList();
    participantsModal.classList.remove("hidden");
});

closeParticipantsModal.addEventListener("click", () => {
    participantsModal.classList.add("hidden");
});

// Update participants list in view modal
function updateParticipantsList() {
    const list = document.getElementById("participantsList");
    list.innerHTML = "";

    participants.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" value="${p.classNumber}"> ${p.name}`;
        list.appendChild(li);
    });
}

// Remove selected participants
document.getElementById("removeSelectedButton").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#participantsList input:checked");
    checkboxes.forEach(box => {
        const classNumber = box.value;
        participants = participants.filter(p => p.classNumber !== classNumber);
    });

    updateParticipantsList();
    renderPool();
});
