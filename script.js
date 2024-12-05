const pool = document.getElementById('pool');
const genderSelect = document.getElementById('gender');
const resetBtn = document.getElementById('resetBtn');
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('nameInput');
const genderInput = document.getElementById('genderInput');
const winnerContainer = document.getElementById('winner-container');

// Default participants
let participants = [
  { name: 'John', gender: 'male', classNumber: 1 },
  { name: 'Jane', gender: 'female', classNumber: 2 },
  { name: 'Smith', gender: 'male', classNumber: 3 },
  { name: 'Alice', gender: 'female', classNumber: 4 },
];

let fishes = [];
let drawn = [];

// Function to render the pool
function renderPool() {
  pool.innerHTML = '';
  const filteredParticipants =
    genderSelect.value === 'all'
      ? participants
      : participants.filter(p => p.gender === genderSelect.value);

  filteredParticipants.forEach(participant => {
    const fish = document.createElement('div');
    fish.className = 'fish';
    fish.style.backgroundImage = `url(images/${participant.classNumber}.jpg)`;
    fish.style.top = `${Math.random() * 90}%`;
    fish.style.left = `${Math.random() * 90}%`;
    fish.dataset.name = participant.name;
    fish.dataset.classNumber = participant.classNumber;
    fish.dataset.gender = participant.gender;
    pool.appendChild(fish);
    fishes.push(fish);

    // Add movement to fish
    setInterval(() => {
      fish.style.top = `${Math.random() * 90}%`;
      fish.style.left = `${Math.random() * 90}%`;
    }, 2000);
  });
}

// Function to catch a random fish
function catchFish() {
  const randomIndex = Math.floor(Math.random() * fishes.length);
  const fish = fishes[randomIndex];
  const name = fish.dataset.name;
  const classNumber = fish.dataset.classNumber;

  displayWinner({ name, classNumber });
}

// Function to display the winner
function displayWinner(winner) {
  winnerContainer.innerHTML = `
    <p>Winner: ${winner.name}</p>
    <img src="images/${winner.classNumber}.jpg" alt="${winner.name}">
    <button onclick="removeWinner(${winner.classNumber})">Remove</button>
    <button onclick="closeWinner()">Keep</button>
  `;
}

// Function to remove the winner
function removeWinner(classNumber) {
  participants = participants.filter(p => p.classNumber != classNumber);
  closeWinner();
  renderPool();
}

// Function to close winner modal
function closeWinner() {
  winnerContainer.innerHTML = '<p>No winner yet!</p>';
}

// Add participant
addBtn.addEventListener('click', () => {
  const name = nameInput.value;
  const gender = genderInput.value;
  const classNumber = participants.length + 1;

  if (name) {
    participants.push({ name, gender, classNumber });
    nameInput.value = '';
    renderPool();
  }
});

// Event Listeners
pool.addEventListener('click', catchFish);
resetBtn.addEventListener('click', () => {
  participants = [...drawn, ...participants];
  drawn = [];
  renderPool();
});

genderSelect.addEventListener('change', renderPool);

// Initial Render
renderPool();
