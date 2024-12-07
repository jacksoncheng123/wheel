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
    catch(error => console.error("Error loading participants:", error));

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
    participants.forEach((participant) => {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        fish.dataset.name = participant.name;
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        
        // Randomize initial position and movement
        fish.style.left = `${Math.random() * (pool.clientWidth - 100)}px`;
        fish.style.top = `${Math.random() * (pool.clientHeight - 100)}px`;
        
        pool.appendChild(fish);
    });

    // Start fish animation
    animateFish();
}

// Animate fish to move freely in the pool
function animateFish() {
    const fishes = document.querySelectorAll('.fish');
    
    fishes.forEach(fish => {
        // Random movement parameters
        const speedX = (Math.random() - 0.5) * 4;
        const speedY = (Math.random() - 0.5) * 4;
        const rotationSpeed = (Math.random() - 0.5) * 10;

        function move() {
            const currentLeft = parseFloat(fish.style.left);
            const currentTop = parseFloat(fish.style.top);

            let newLeft = currentLeft + speedX;
            let newTop = currentTop + speedY;

            // Bounce off walls
            if (newLeft <= 0 || newLeft >= pool.clientWidth - 100) {
                speedX *= -1;
            }
            if (newTop <= 0 || newTop >= pool.clientHeight - 100) {
                speedY *= -1;
            }

            fish.style.left = `${newLeft}px`;
            fish.style.top = `${newTop}px`;
            fish.style.transform = `rotate(${rotationSpeed}deg)`;
        }

        // Continuous movement
        setInterval(move, 50);
    });
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
    
    participants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.innerHTML = `
            <label>
                <input type="checkbox" class="participant-checkbox" value="${participant.name}">
                ${participant.name}
            </label>
        `;
        participantList.appendChild(participantItem);
    });

    manageParticipantsPopup.classList.remove("hidden");
}

// Remove Selected Participants
function removeSelectedParticipants() {
    const selectedCheckboxes = document.querySelectorAll('.participant-checkbox:checked');
    
    selectedCheckboxes.forEach(checkbox => {
        participants = participants.filter(p => p.name !== checkbox.value);
    });

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

// Add listener for remove selected participants
const removeSelectedButton = document.createElement('button');
removeSelectedButton.textContent = 'Remove Selected';
removeSelectedButton.addEventListener('click', removeSelectedParticipants);
manageParticipantsPopup.appendChild(removeSelectedButton);
