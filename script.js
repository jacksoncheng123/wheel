let participants = [];

// Fetch participants from JSON
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        renderPool();
        renderParticipantList();
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
const newName = document.getElementById("newName");
const newGender = document.getElementById("newGender");
const addParticipantButton = document.getElementById("addParticipantButton");
const participantList = document.getElementById("participantList");
const removeSelectedButton = document.getElementById("removeSelectedButton");

let fishes = [];

// Render the pool based on gender filter
function renderPool() {
    const selectedGender = genderFilter.value;
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

// Render participant list in the management section
function renderParticipantList() {
    participantList.innerHTML = participants.map(p => `
        <label>
            <input type="checkbox" value="${p.classNumber}">
            ${p.name} (${p.gender})
        </label><br>
    `).join("");
}

// Draw a random participant
function drawParticipant() {
    if (fishes.length === 0) {
        alert("No participants available for this gender!");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * fishes.length);
    const winner = fishes[winnerIndex];

    // Show winner in popup
    winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
    winnerDetails.textContent = `Name: ${winner.name}`;
    winnerPopup.classList.remove("hidden");

    // Remove winner from pool
    removeWinnerButton.onclick = () => {
        participants = participants.filter(p => p !== winner);
        renderPool();
        renderParticipantList();
        winnerPopup.classList.add("hidden");
    };

    // Close popup
    closePopupButton.onclick = () => {
        winnerPopup.classList.add("hidden");
    };
}

// Add a new participant
function addParticipant() {
    const name = newName.value.trim();
    const gender = newGender.value;

    if (!name) {
        alert("Please enter a name!");
        return;
    }

    participants.push({
        name,
        gender,
        classNumber: Math.max(...participants.map(p => p.classNumber), 0) + 1
    });

    newName.value = "";
    renderPool();
    renderParticipantList();
}

// Remove selected participants
function removeSelectedParticipants() {
    const selected = Array.from(participantList.querySelectorAll("input:checked"))
        .map(input => parseInt(input.value, 10));

    participants = participants.filter(p => !selected.includes(p.classNumber));
    renderPool();
    renderParticipantList();
}

// Event Listeners
genderFilter.addEventListener("change", renderPool);
drawButton.addEventListener("click", drawParticipant);
addParticipantButton.addEventListener("click", addParticipant);
removeSelectedButton.addEventListener("click", removeSelectedParticipants);
