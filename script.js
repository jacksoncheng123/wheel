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

// Draw Button
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

// Add a new participant
document.getElementById("addParticipantForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("participantName").value.trim();
    const gender = document.getElementById("participantGender").value;

    if (name) {
        const newParticipant = {
            name,
            gender,
            classNumber: 99, // Default class number for new participants
        };

        participants.push(newParticipant);
        renderPool();
        addParticipantModal.classList.add("hidden");
        document.getElementById("addParticipantForm").reset();
    }
});

// Draw a random participant
function drawRandomParticipant() {
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
}

// Display winner
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}`;
    winnerContainer.classList.remove("hidden");

    // Handle removal decision
    window.removeWinner = () => {
        participants = participants.filter(p => p !== winner);
        winnerContainer.classList.add("hidden");
        renderPool();
    };

    window.keepWinner = () => {
        winnerContainer.classList.add("hidden");
    };
}

// Draw button click
drawButton.addEventListener("click", drawRandomParticipant);

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

    participants.forEach((p, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" value="${index}"> ${p.name}`;
        list.appendChild(li);
    });
}

// Remove selected participants
document.getElementById("removeSelectedButton").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#participantsList input:checked");
    const selectedIndexes = Array.from(checkboxes).map(box => parseInt(box.value));

    participants = participants.filter((_, index) => !selectedIndexes.includes(index));
    updateParticipantsList();
    renderPool();
});
