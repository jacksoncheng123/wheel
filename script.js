let participants = [];
let winners = [];
let originalParticipants = []; // Store original participants for reset

// Fetch participants
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        participants = data;
        originalParticipants = JSON.parse(JSON.stringify(data)); // Deep copy
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
const resetParticipantsButton = document.getElementById("resetParticipantsButton");
const winnerPopup = document.getElementById("winnerPopup");
const winnerImage = document.getElementById("winnerImage");
const winnerDetails = document.getElementById("winnerDetails");
const manageParticipantsPopup = document.getElementById("manageParticipants");
const participantList = document.getElementById("participantList");
const winnerListPopup = document.getElementById("winnerListPopup");
const addParticipantPopup = document.getElementById("addParticipantPopup");

// Reset Participants Function
function resetParticipants() {
    // Restore participants to the original list
    participants = JSON.parse(JSON.stringify(originalParticipants));
    
    // Clear winners
    winners = [];
    
    // Re-render the pool
    renderPool();

    // Close the manage participants popup
    manageParticipantsPopup.classList.add("hidden");

    // Alert user
    alert("Participants have been reset to the original list.");
}

// Render Pool with Fish (existing function remains the same)
function renderPool() {
    pool.innerHTML = ''; // Clear previous fishes
    
    // Animate fish movement within pool
    participants.forEach((participant, index) => {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        fish.dataset.name = participant.name;
        fish.dataset.index = index;
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        
        // Randomize initial position
        fish.style.left = `${Math.random() * (pool.clientWidth - 100)}px`;
        fish.style.top = `${Math.random() * (pool.clientHeight - 100)}px`;
        
        // Create unique animation for each fish
        const uniqueAnimation = createUniqueAnimation(index);
        fish.style.animationName = uniqueAnimation;
        
        pool.appendChild(fish);
    });
}

// Create unique animation for each fish (existing function remains the same)
function createUniqueAnimation(index) {
    const animationName = `swim-${index}`;
    
    // Create a style element for the unique animation
    const styleSheet = document.styleSheets[0];
    const keyframes = `@keyframes ${animationName} {
        0% { 
            transform: translate(0, 0) rotate(${Math.random() * 10 - 5}deg);
        }
        25% { 
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
        }
        50% { 
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
        }
        75% { 
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
        }
        100% { 
            transform: translate(0, 0) rotate(${Math.random() * 10 - 5}deg);
        }
    }`;
    
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    
    return animationName;
}

// Modify View Winners List to show more details
function viewWinnersList() {
    const winnerListPopup = document.getElementById("winnerListPopup");
    if (winners.length === 0) {
        winnerListPopup.innerHTML = `
            <h2>Winner List</h2>
            <p>No winners yet.</p>
            <button onclick="closePopup(document.getElementById('winnerListPopup'))">Close</button>
        `;
    } else {
        winnerListPopup.innerHTML = `
            <h2>Winner List</h2>
            ${winners.map((winner, index) => `
                <div>
                    ${index + 1}. ${winner.name} (${winner.gender})
                </div>
            `).join('')}
            <button onclick="closePopup(document.getElementById('winnerListPopup'))">Close</button>
        `;
    }
    winnerListPopup.classList.remove("hidden");
}

// Existing functions remain the same (drawParticipant, viewParticipantsPool, 
// removeSelectedParticipants, addNewParticipant, closePopup)

// Updated Event Listeners
drawButton.addEventListener("click", drawParticipant);
viewPoolButton.addEventListener("click", viewParticipantsPool);
viewWinnersButton.addEventListener("click", viewWinnersList);
addParticipantButton.addEventListener("click", () => addParticipantPopup.classList.remove("hidden"));
resetParticipantsButton.addEventListener("click", resetParticipants);
