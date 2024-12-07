let participants = [];
let winners = [];
const ORIGINAL_PARTICIPANTS_URL = "participants.json";

// Fetch participants
function loadParticipants() {
    fetch(ORIGINAL_PARTICIPANTS_URL)
        .then(response => response.json())
        .then(data => {
            participants = data;
            renderPool();
        })
        .catch(error => console.error("Error loading participants:", error));
}

// Initial load
loadParticipants();

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
const removeFromPoolButton = document.querySelector("#winnerPopup button:first-of-type");
const manageParticipantsPopup = document.getElementById("manageParticipants");
const participantList = document.getElementById("participantList");
const winnerListPopup = document.getElementById("winnerListPopup");
const addParticipantPopup = document.getElementById("addParticipantPopup");

// Render Pool
function renderPool() {
    pool.innerHTML = ''; // Clear previous images

    const fishPositions = []; // Store positions of each image

    participants.forEach((participant, index) => {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        fish.dataset.name = participant.name;
        fish.dataset.gender = participant.gender;
        fish.dataset.index = index;
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;

        // Filter by gender
        if (genderFilter.value !== 'All' && genderFilter.value !== participant.gender) {
            return;
        }

        // Calculate a position that avoids overlap
        let left, top, tooClose;
        const fishWidth = 100;
        const fishHeight = 100;

        do {
            tooClose = false;
            left = Math.random() * (pool.clientWidth - fishWidth);
            top = Math.random() * (pool.clientHeight - fishHeight);

            for (const pos of fishPositions) {
                const distance = Math.sqrt((left - pos.left) ** 2 + (top - pos.top) ** 2);
                if (distance < fishWidth) {
                    tooClose = true;
                    break;
                }
            }
        } while (tooClose);

        fishPositions.push({ left, top });

        fish.style.left = `${left}px`;
        fish.style.top = `${top}px`;

        // Create unique animation for each fish
        const uniqueAnimation = createUniqueAnimation(index);
        fish.style.animationName = uniqueAnimation;

        pool.appendChild(fish);
    });
}

// Create unique animation for each fish
function createUniqueAnimation(index) {
    const animationName = `swim-${index}`;
    const styleSheet = document.styleSheets[0];
    const keyframes = `@keyframes ${animationName} {
        0% { transform: translate(0, 0); }
        25% { transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px); }
        50% { transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px); }
        75% { transform: translate(${Math.random() * 30}px, ${Math.random() * 30}px); }
        100% { transform: translate(0, 0); }
    }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    return animationName;
}

// Draw Participant
function drawParticipant() {
    const selectedGender = genderFilter.value;
    const genderFilteredParticipants = participants.filter(p =>
        selectedGender === 'All' || p.gender === selectedGender
    );

    if (genderFilteredParticipants.length === 0) {
        alert("No participants available for the selected gender!");
        return;
    }

    const fishes = Array.from(pool.children);
    let glowingIndex = 0;

    // Animate selection
    const interval = setInterval(() => {
        fishes.forEach(fish => fish.classList.remove("drawing"));
        fishes[glowingIndex].classList.add("drawing");
        glowingIndex = (glowingIndex + 1) % fishes.length;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * genderFilteredParticipants.length);
        const winner = genderFilteredParticipants[winnerIndex];

        if (!winners.find(w => w.name === winner.name)) {
            winners.push(winner);
        }

        fishes.forEach(fish => {
            if (fish.dataset.name === winner.name) {
                fish.classList.add("winner-glow");
            } else {
                fish.classList.remove("drawing");
            }
        });

        winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
        winnerDetails.textContent = `Name: ${winner.name}`;
        removeFromPoolButton.dataset.winnerName = winner.name;
        winnerPopup.classList.remove("hidden");
    }, 3000);
}

// Reset Participants
function resetParticipants() {
    fetch(ORIGINAL_PARTICIPANTS_URL)
        .then(response => response.json())
        .then(data => {
            participants = data; // Reset participants
            renderPool();
        })
        .catch(error => console.error("Error resetting participants:", error));
    manageParticipantsPopup.classList.add("hidden");
}

// View Participants Pool
function viewParticipantsPool() {
    participantList.innerHTML = '';

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

    const popupTitle = manageParticipantsPopup.querySelector('h2');
    popupTitle.textContent = 'Manage Participants';

    const existingButtons = manageParticipantsPopup.querySelectorAll('button:not(:last-child)');
    existingButtons.forEach(btn => btn.remove());

    const removeSelectedButton = document.createElement('button');
    removeSelectedButton.textContent = 'Remove Selected';
    removeSelectedButton.addEventListener('click', removeSelectedParticipants);
    manageParticipantsPopup.insertBefore(removeSelectedButton, manageParticipantsPopup.lastElementChild);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Participants';
    resetButton.addEventListener('click', resetParticipants);
    manageParticipantsPopup.insertBefore(resetButton, manageParticipantsPopup.lastElementChild);

    manageParticipantsPopup.classList.remove("hidden");
}

// Remove Selected Participants
function removeSelectedParticipants() {
    const selectedCheckboxes = document.querySelectorAll('.participant-checkbox:checked');

    participants = participants.filter(participant =>
        !Array.from(selectedCheckboxes).some(checkbox =>
            checkbox.value === participant.name
        )
    );

    renderPool();
    manageParticipantsPopup.classList.add("hidden");
}

// View Winners List
function viewWinnersList() {
    winnerListPopup.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = "Winner List";
    winnerListPopup.appendChild(title);

    if (winners.length === 0) {
        const noWinnersMessage = document.createElement('p');
        noWinnersMessage.textContent = "No winners yet!";
        winnerListPopup.appendChild(noWinnersMessage);
    } else {
        winners.forEach(winner => {
            const winnerItem = document.createElement('div');
            winnerItem.textContent = `${winner.name}`;
            winnerListPopup.appendChild(winnerItem);
        });
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => closePopup(winnerListPopup));
    winnerListPopup.appendChild(closeButton);

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
removeFromPoolButton.addEventListener("click", () => closePopup(winnerPopup));
