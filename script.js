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

// Create unique animation for each fish
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

// Draw Participant based on selected gender
function drawParticipant() {
    const selectedGender = genderFilter.value;
    const genderFilteredParticipants = participants.filter(p => 
        selectedGender === 'All' || p.gender.toLowerCase() === selectedGender.toLowerCase()
    );

    if (genderFilteredParticipants.length === 0) {
        alert("No participants available for selected gender!");
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
        const winnerIndex = Math.floor(Math.random() * genderFilteredParticipants.length);
        const winner = genderFilteredParticipants[winnerIndex];
        
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
    
    participants.forEach((participant, index) => {
        const participantItem = document.createElement('div');
        participantItem.innerHTML = `
            <label>
                <input type="checkbox" class="participant-checkbox" value="${participant.name}" data-index="${index}">
                ${participant.name}
            </label>
        `;
        participantList.appendChild(participantItem);
    });

    // Update popup title
    const popupTitle = manageParticipantsPopup.querySelector('h2');
    popupTitle.textContent = 'Manage Participants';

    // Remove any existing buttons
    const existingButtons = manageParticipantsPopup.querySelectorAll('button:not(:last-child)');
    existingButtons.forEach(btn => btn.remove());

    // Add Remove Selected button
    const removeSelectedButton = document.createElement('button');
    removeSelectedButton.textContent = 'Remove Selected';
    removeSelectedButton.addEventListener('click', removeSelectedParticipants);
    manageParticipantsPopup.insertBefore(removeSelectedButton, manageParticipantsPopup.lastElementChild);

    manageParticipantsPopup.classList.remove("hidden");
}

// Remove Selected Participants
function removeSelectedParticipants() {
    const selectedCheckboxes = document.querySelectorAll('.participant-checkbox:checked');
    
    // Create a new participants array excluding selected participants
    participants = participants.filter(participant => 
        !Array.from(selectedCheckboxes).some(checkbox => 
            checkbox.value === participant.name
        )
    );

    // Re-render pool and close popup
    renderPool();
    manageParticipantsPopup.classList.add("hidden");
}

// View Winners List
function viewWinnersList() {
    const winnerListContent = document.querySelector("#winnerListPopup");
    winnerListContent.innerHTML = `
        <h2>Winner List</h2>
        ${winners.map(winner => `<div>${winner.name}</div>`).join('')}
        <button onclick="closePopup(document.getElementById('winnerListPopup'))">Close</button>
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
drawButton.addEventListener("click", drawParticipant);
viewPoolButton.addEventListener("click", viewParticipantsPool);
viewWinnersButton.addEventListener("click", viewWinnersList);
addParticipantButton.addEventListener("click", () => addParticipantPopup.classList.remove("hidden"));
