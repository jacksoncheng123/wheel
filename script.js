let participants = [];
let winners = [];

// Fetch participants
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
const addParticipantButton = document.getElementById("addParticipantButton");
const addParticipantPopup = document.getElementById("addParticipantPopup");
const newParticipantName = document.getElementById("newParticipantName");
const newParticipantGender = document.getElementById("newParticipantGender");
const addParticipantConfirmButton = document.getElementById("addParticipantConfirmButton");
const closeAddParticipantButton = document.getElementById("closeAddParticipantButton");

function renderPool() {
    const selectedGender = genderFilter.value;
    const filteredParticipants = participants.filter(
        p => selectedGender === "all" || p.gender === selectedGender
    );

    pool.innerHTML = "";

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        pool.appendChild(fish);
    });
}

function drawParticipant() {
    const fishes = Array.from(pool.children);
    if (fishes.length === 0) {
        alert("No participants available!");
        return;
    }

    let glowingIndex = 0;

    const interval = setInterval(() => {
        fishes.forEach(fish => fish.classList.remove("drawing"));
        fishes[glowingIndex].classList.add("drawing");
        glowingIndex = (glowingIndex + 1) % fishes.length;
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        const winner = participants.find(
            p => p.classNumber == fishes[glowingIndex].style.backgroundImage.match(/(\d+)\.jpeg/)[1]
        );

        // Winner Popup
        document.getElementById("winnerImage").style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
        document.getElementById("winnerDetails").textContent = `Name: ${winner.name}`;
        document.getElementById("winnerPopup").classList.remove("hidden");

        winners.push(winner.name);
    }, 3000);
}

// Add Participant Logic
addParticipantButton.onclick = () => {
    addParticipantPopup.classList.remove("hidden");
};

addParticipantConfirmButton.onclick = () => {
    const name = newParticipantName.value.trim();
    const gender = newParticipantGender.value;

    if (!name) {
        alert("Please enter a name!");
        return;
    }

    participants.push({ name, gender, classNumber: 99 });
    newParticipantName.value = "";
    renderPool();
    addParticipantPopup.classList.add("hidden");
};

closeAddParticipantButton.onclick = () => {
    addParticipantPopup.classList.add("hidden");
};

// Event Listeners
genderFilter.addEventListener("change", renderPool);
drawButton.addEventListener("click", drawParticipant);
