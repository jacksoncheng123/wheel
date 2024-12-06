let participants = [];
let winners = []; // To store the winner list

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
const viewPoolButton = document.getElementById("viewPoolButton");
const viewWinnersButton = document.getElementById("viewWinnersButton");
const winnerPopup = document.getElementById("winnerPopup");
const winnerImage = document.getElementById("winnerImage");
const winnerDetails = document.getElementById("winnerDetails");
const removeWinnerButton = document.getElementById("removeWinnerButton");
const closePopupButton = document.getElementById("closePopupButton");
const manageParticipants = document.getElementById("manageParticipants");
const participantList = document.getElementById("participantList");
const removeSelectedButton = document.getElementById("removeSelectedButton");
const closeManageButton = document.getElementById("closeManageButton");
const winnerListPopup = document.getElementById("winnerListPopup");
const winnerList = document.getElementById("winnerList");
const closeWinnerListButton = document.getElementById("closeWinnerListButton");

let fishes = [];

// Render the pool based on gender filter
function renderPool() {
    const selectedGender = genderFilter.value;
    const filteredParticipants = participants.filter(
        p => selectedGender === "all" || p.gender === selectedGender
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
    participantList.innerHTML = participants
        .map(
            p => `
        <label>
            <input type="checkbox" value="${p.classNumber}">
            ${p.name} (${p.gender})
        </label><br>
    `
        )
        .join("");
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

    // Add to winners list
    winners.push(winner.name);

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

// Manage participants
function openManageParticipants() {
    renderParticipantList();
    manageParticipants.classList.remove("hidden");

    closeManageButton.onclick = () => {
        manageParticipants.classList.add("hidden");
    };

    removeSelectedButton.onclick = () => {
        const selected = Array.from(participantList.querySelectorAll("input:checked")).map(
            input => parseInt(input.value, 10)
        );

        participants = participants.filter(p => !selected.includes(p.classNumber));
        renderPool();
        renderParticipantList();
    };
}

// Show Winner List
function openWinnerList() {
    winnerList.innerHTML = winners.map(name => `<li>${name}</li>`).join("");
    winnerListPopup.classList.remove("hidden");

    closeWinnerListButton.onclick = () => {
        winnerListPopup.classList.add("hidden");
    };
}

// Event Listeners
genderFilter.addEventListener("change", renderPool);
drawButton.addEventListener("click", drawParticipant);
viewPoolButton.addEventListener("click", openManageParticipants);
viewWinnersButton.addEventListener("click", openWinnerList);
