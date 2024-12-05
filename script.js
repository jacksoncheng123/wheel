const wheel = document.getElementById('wheel');
const genderSelect = document.getElementById('gender');
const resetBtn = document.getElementById('resetBtn');
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('nameInput');
const genderInput = document.getElementById('genderInput');
const winnerContainer = document.getElementById('winner-container');
const drawnParticipants = document.getElementById('record');

// Default participants
let participants = [
  { name: 'John', gender: 'male', classNumber: 1 },
  { name: 'Jane', gender: 'female', classNumber: 2 },
  { name: 'Smith', gender: 'male', classNumber: 3 },
  { name: 'Alice', gender: 'female', classNumber: 4 },
];

let drawn = [];
let currentAngle = 0;

// Function to render the wheel
function renderWheel() {
  wheel.innerHTML = '';
  const filteredParticipants =
    genderSelect.value === 'all'
      ? participants
      : participants.filter(p => p.gender === genderSelect.value);

  const segmentAngle = 360 / filteredParticipants.length;

  filteredParticipants.forEach((participant, index) => {
    const segment = document.createElement('div');
    segment.className = 'segment';
    segment.style.backgroundImage = `url(images/${participant.classNumber}.jpg)`;
    segment.style.transform = `rotate(${index * segmentAngle}deg) skewY(-${90 - segmentAngle}deg)`;
    wheel.appendChild(segment);
  });
}

// Function to spin the wheel
function spinWheel() {
  const randomSpin = Math.floor(Math.random() * 360) + 720;
  currentAngle += randomSpin;
  wheel.style.transform = `rotate(${currentAngle}deg)`;

  setTimeout(() => {
    const winnerIndex =
      Math.floor(((360 - (currentAngle % 360)) / (360 / participants.length)) %
        participants.length);
    const winner = participants[winnerIndex];
    displayWinner(winner);
  }, 5000); // Matches the animation duration
}

// Function to display the winner
function displayWinner(winner) {
  winnerContainer.innerHTML = `
    <p>Winner: ${winner.name}</p>
    <img src="images/${winner.classNumber}.jpg" alt="${winner.name}">
    <button onclick="removeWinner(${participants.indexOf(winner)})">Remove</button>
    <button onclick="closeWinner()">Keep</button>
  `;
}

// Function to remove a winner
function removeWinner(index) {
  participants.splice(index, 1);
  closeWinner();
  renderWheel();
}

// Function to close winner modal
function closeWinner() {
  winnerContainer.innerHTML = '<p>No winner yet!</p>';
}

// Add participant
addBtn.addEventListener('click', () => {
  const name = nameInput.value;
  const gender = genderInput.value;
  const classNumber = participants.length + 1; // Assign unique classNumber

  if (name) {
    participants.push({ name, gender, classNumber });
    nameInput.value = '';
    renderWheel();
  }
});

// Event Listeners
wheel.addEventListener('click', spinWheel);
resetBtn.addEventListener('click', () => {
  participants = [...drawn, ...participants];
  drawn = [];
  renderWheel();
});

genderSelect.addEventListener('change', renderWheel);

// Initial Render
renderWheel();
