let participants = [];
let drawnParticipants = [];

// Load participants from a JSON file
fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
        createSegments(participants);
    })
    .catch(error => console.error('Error loading participants:', error));

// Generate the wheel segments dynamically
function createSegments(participantList) {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = ''; // Clear previous segments
    const totalSegments = participantList.length;

    participantList.forEach((participant, index) => {
        const segment = document.createElement('div');
        const sliceAngle = 360 / totalSegments;

        segment.className = 'segment';
        segment.style.background = participant.gender === 'male' ? 'blue' : 'red';
        segment.style.transform = `rotate(${index * sliceAngle}deg)`;
        segment.style.clipPath = 'circle(50%)';

        const text = document.createElement('div');
        text.className = 'segment-text';
        text.innerText = participant.name;
        text.style.transform = `rotate(${sliceAngle / 2}deg)`;

        segment.appendChild(text);
        wheel.appendChild(segment);
    });
}

// Spin the wheel when clicked or tapped
function spin() {
    const gender = document.getElementById('gender').value;

    const filteredParticipants = gender === 'all'
        ? participants
        : participants.filter(p => p.gender === gender);

    if (filteredParticipants.length === 0) {
        alert('No participants found for the selected gender.');
        return;
    }

    createSegments(filteredParticipants);

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    const wheel = document.getElementById('wheel');

    // Spin animation
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    setTimeout(() => {
        wheel.style.transition = 'transform 5s ease-out';
        const rotation = 360 * 5 + (360 / filteredParticipants.length) * winnerIndex;
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            displayWinner(winner, winnerIndex, filteredParticipants);
        }, 5000);
    }, 100);
}

// Display winner and ask to remove
function displayWinner(winner, winnerIndex, filteredParticipants) {
    const winnerContainer = document.getElementById('winner-container');
    winnerContainer.innerHTML = `
        <p>Winner: <strong>${winner.name}</strong></p>
        <button id="remove-btn" class="btn btn-danger">Remove from Pool</button>
        <button id="keep-btn" class="btn btn-secondary">Keep in Pool</button>
    `;

    document.getElementById('remove-btn').addEventListener('click', () => {
        participants = participants.filter(p => p.name !== winner.name);
        drawnParticipants.push(winner.name);
        updateDrawnRecord();
        winnerContainer.innerHTML = '<p>Winner decision recorded!</p>';
        createSegments(participants);
    });

    document.getElementById('keep-btn').addEventListener('click', () => {
        drawnParticipants.push(winner.name);
        updateDrawnRecord();
        winnerContainer.innerHTML = '<p>Winner decision recorded!</p>';
    });
}

// Update the drawn participants record
function updateDrawnRecord() {
    const record = document.getElementById('record');
    record.innerHTML = 'Drawn Participants:<br>';
    drawnParticipants.forEach((name, i) => {
        record.innerHTML += `${i + 1}. ${name}<br>`;
    });
}

// Add a new participant
function addParticipant() {
    const name = document.getElementById('nameInput').value;
    const gender = document.getElementById('genderInput').value;

    if (!name) {
        alert('Please enter a name.');
        return;
    }

    participants.push({ name, gender, classNumber: 99 });
    createSegments(participants);
    document.getElementById('nameInput').value = '';
}

// Reset the wheel and participants
function resetWheel() {
    fetch('participants.json')
        .then(response => response.json())
        .then(data => {
            participants = data;
            drawnParticipants = [];
            updateDrawnRecord();
            createSegments(participants);
            document.getElementById('winner-container').innerHTML = '<p>No winner yet!</p>';
        })
        .catch(error => console.error('Error resetting participants:', error));
}

// Add event listeners for both tap and click to spin
const wheel = document.getElementById('wheel');
wheel.addEventListener('click', spin); // For desktop users
wheel.addEventListener('touchstart', spin); // For touchscreens

document.getElementById('resetBtn').addEventListener('click', resetWheel);
document.getElementById('addBtn').addEventListener('click', addParticipant);
