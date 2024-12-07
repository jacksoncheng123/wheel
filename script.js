let participants = [];
let winners = [];
let filteredParticipants = [];

// Fetch participants
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        renderPool();
    })
    .catch(error => console.error("Error loading participants:", error));

// DOM Elements
const pool = document.getElementById("pool");
const genderFilter = document.getElementById("genderFilter");
const drawButton = document.getElementById("drawButton");
const viewPoolButton = document.getElementById("viewPoolButton");
const viewWinnersButton = document.getElementById("viewWinnersButton");
const addParticipantButton = document.getElementById("addParticipantButton");
const winnerPopup = document.getElementById("winnerPopup");
const winnerImage = document.getElementById("winnerImage");
const winnerDetails = document.getElementById("winnerDetails");
const manageParticipantsPopup = document.getElementById("manageParticipants");
const participantList = document.getElementById("participantList");
const winnerListPopup = document.getElementById("winnerListPopup");
const addParticipantPopup = document.getElementById("addParticipantPopup");

// Render Pool with Fish
function renderPool() {
    pool.innerHTML = ''; // Clear previous fishes
    
    // Filter participants based on gender
    const selectedGender = genderFilter.value;
    filteredParticipants = selectedGender === 'All' 
        ? participants 
        : participants.filter(p => p.gender.toLowerCase() === selectedGender.toLowerCase());

    filteredParticipants.forEach((participant, index) => {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        
        // Randomize initial position
        const maxWidth = pool.clientWidth - 100;
        const maxHeight = pool.clientHeight - 100;
        fish.style.left = `${Math.random() * maxWidth}px`;
        fish.style.top = `${Math.random() * maxHeight}px`;
        
        pool.appendChild(fish);
    });
}

// Draw Participant
function drawParticipant() {
    if (filteredParticipants.length === 0) {
        alert("No participants available!");
        return;
    }

    const fishes = Array.from(pool.children);
    let glowingIndex = 0;

    // Animate selection
    const interval = setInterval(() => {
        fishes.forEach(fish => {
            fish.classList.remove("drawing");
            fish.style.transform = 'scale(1)';
        });
        fishes[glowingIndex].classList.add("drawing");
        fishes[glowingIndex].style.transform = 'scale(1.2)';
        glowingIndex = (glowingIndex + 1) % fishes.length;
    }, 100);

    // Select winner
    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
        const winner = filteredParticipants[winnerIndex];
        
        winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
        winnerDetails.textContent = `Name: ${winner.name}`;
        winnerPopup.classList.remove("hidden");

        // Remove winner from participants
        participants = participants.filter(p => p.name !== winner.name);
        winners.push(winner);

        // Re-render pool
        renderPool();
    }, 3000);
}

// View Participants Pool
function viewParticipantsPool() {
    participantList.innerHTML = ''; // Clear previous list
    
    filteredParticipants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.textContent = `${participant.name} (${participant.gender})`;
        participantList.appendChild(participantItem);
    });

    manageParticipantsPopup.classList.remove("hidden");
}

// View Winners List
function viewWinnersList() {
    const winnerListContent = document.querySelector("#winnerListPopup");
    winnerListContent.innerHTML = `
        <h2>Winner List</h2>
        ${winners.map(winner => `<div>${winner.name}</div>`).join('')}
        <button onclick="document.getElementById('winnerListPopup').classList.add('hidden')">Close</button>
    `;
    winnerListPopup.classList.remove("hidden");
}

// Add New Participant
function addNewParticipant() {
    const nameInput = document.getElementById("participantName");
    const genderInput = document.getElementById("participantGender");
    
    if (nameInput.value && genderInput.value) {
        const newParticipant = {
            name: nameInput.value,
            classNumber: (participants.length + 1).toString(),
            gender: genderInput.value
        };
        
        participants.push(newParticipant);
        renderPool();
        
        // Close popup
        addParticipantPopup.classList.add("hidden");
        nameInput.value = '';
        genderInput.value = 'Male';
    } else {
        alert("Please fill in all fields.");
    }
}

// Close Popup
function closePopup(popupElement) {
    popupElement.classList.add("hidden");
}

// Event Listeners
genderFilter.addEventListener("change", renderPool);
drawButton.addEventListener("click", drawParticipant);
viewPoolButton.addEventListener("click", viewParticipantsPool);
viewWinnersButton.addEventListener("click", viewWinnersList);
addParticipantButton.addEventListener("click", () => addParticipantPopup.classList.remove("hidden"));
