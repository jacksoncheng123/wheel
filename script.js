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

const pool = document.getElementById("pool");
const genderFilter = document.getElementById("genderFilter");
const drawButton = document.getElementById("drawButton");
const viewPoolButton = document.getElementById("viewPoolButton");
const viewWinnersButton = document.getElementById("viewWinnersButton");
const addParticipantButton = document.getElementById("addParticipantButton");

// Render pool
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

// Draw participant
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
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const winner = participants[Math.floor(Math.random() * participants.length)];
        const winnerImage = document.getElementById("winnerImage");
        winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
        document.getElementById("winnerDetails").textContent = `Name: ${winner.name}`;
        document.getElementById("winnerPopup").classList.remove("hidden");

        winners.push(winner.name);
    }, 3000);
}

// Event Listeners
genderFilter.addEventListener("change", renderPool);
drawButton.addEventListener("click", drawParticipant);
