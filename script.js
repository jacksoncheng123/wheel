let participants = [];
let fishes = [];

// Elements
const pool = document.getElementById("pool");
const winnerContainer = document.getElementById("winnerContainer");
const winnerMessage = document.getElementById("winnerMessage");
const winnerImage = document.getElementById("winnerImage");
const genderFilter = document.getElementById("genderFilter");
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

// Draw a random participant with animation
drawButton.addEventListener("click", () => {
    const selectedGender = genderFilter.value;
    let filteredParticipants = participants;

    if (selectedGender !== "all") {
        filteredParticipants = participants.filter(p => p.gender === selectedGender);
    }

    if (filteredParticipants.length === 0) {
        alert("No participants matching the criteria!");
        return;
    }

    // Simulate selection animation
    let counter = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
        const index = counter % fishes.length;
        fishes.forEach(fish => fish.classList.remove("highlight"));
        fishes[index].classList.add("highlight");

        counter++;
        if (counter >= maxSpins) {
            clearInterval(interval);

            // Select the winner
            const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
            const winner = filteredParticipants[winnerIndex];

            // Display winner
            displayWinner(winner);

            // Highlight winner fish
            const winnerFish = fishes[winnerIndex];
            if (winnerFish) winnerFish.classList.add("highlight");
        }
    }, 100);
});

// Display the winner
function displayWinner(winner) {
    winnerMessage.innerHTML = `Winner: ${winner.name}`;
    winnerImage.src = `images/${winner.classNumber}.jpeg`;
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
