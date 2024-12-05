let participants = [];
let fishes = [];
const pool = document.getElementById("pool");
const genderSelect = document.getElementById("gender");
const winnerContainer = document.getElementById("winnerContainer");
const winnerMessage = document.getElementById("winnerMessage");

// Fetch participants from participants.json
fetch("participants.json")
    .then(response => response.json())
    .then(data => {
        console.log("Participants loaded:", data);  // Debugging: Check participants data
        participants = data;
        renderPool();  // Call to render the pool after data is fetched
    })
    .catch(error => console.error("Error loading participants:", error));

// Render the pool with fishes
function renderPool() {
    pool.innerHTML = '';  // Clear previous pool contents
    fishes = [];  // Clear previous fishes array

    const filteredParticipants = 
        genderSelect.value === "all"
            ? participants
            : participants.filter(p => p.gender === genderSelect.value);

    if (filteredParticipants.length === 0) {
        pool.innerHTML = '<p>No participants in the pool!</p>';
        return;
    }

    console.log("Filtered Participants:", filteredParticipants);  // Debugging: Log filtered participants

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 90}%`;
        fish.style.left = `${Math.random() * 90}%`;
        fish.dataset.name = participant.name;
        fish.dataset.classNumber = participant.classNumber;
        pool.appendChild(fish);
        fishes.push(fish);

        // Add movement to fish
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 2000);

        // Event listener for catching a fish
        fish.addEventListener("click", () => catchFish(participant));
    });
}

// Handle catching a fish
function catchFish(participant) {
    displayWinner(participant);
}

// Display the winner
function displayWinner(participant) {
    winnerMessage.innerHTML = `Winner: ${participant.name}`;
    winnerContainer.classList.remove("hidden");
    winnerContainer.dataset.classNumber = participant.classNumber;
}

// Remove the winner from the pool
function removeWinner() {
    const classNumber = winnerContainer.dataset.classNumber;
    participants = participants.filter(p => p.classNumber !== classNumber);
    renderPool();  // Re-render the pool after removing a winner
    closeWinner();
}

// Keep the winner in the pool
function keepWinner() {
    closeWinner();
}

// Close the winner container
function closeWinner() {
    winnerContainer.classList.add("hidden");
}
