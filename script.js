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
        pool.appendChild(fish);
        fishes.push(participant);
    });
}

function drawParticipant() {
    if (fishes.length === 0) {
        alert("No participants available!");
        return;
    }

    const winnerIndex = Math.floor(Math.random() * fishes.length);
    const winner = fishes[winnerIndex];

    // Highlight winner with animation
    const winnerElement = pool.children[winnerIndex];
    winnerElement.classList.add("drawing");

    setTimeout(() => {
        winnerImage.style.backgroundImage = `url(images/${winner.classNumber}.jpeg)`;
        winnerDetails.textContent = `Name: ${winner.name}`;
        winnerPopup.classList.remove("hidden");

        winners.push(winner.name);

        // Remove winner if selected
        removeWinnerButton.onclick = () => {
            participants = participants.filter(p => p !== winner);
            renderPool();
            winnerPopup.classList.add("hidden");
        };

        closePopupButton.onclick = () => {
            winnerPopup.classList.add("hidden");
        };
    }, 2000); // Delay matches the animation
}

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
