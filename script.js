let participants = [];

fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
    })
    .catch(error => console.error('Error loading participants:', error));

function spin() {
    const gender = document.getElementById('gender').value;
    let filteredParticipants = participants;

    if (gender !== 'all') {
        filteredParticipants = participants.filter(p => p.gender === gender);
    }

    if (filteredParticipants.length === 0) {
        document.getElementById('result').innerText = 'No participants found';
        return;
    }

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    const wheel = document.getElementById('wheel');
    
    // Reset the animation
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    setTimeout(() => {
        // Spin the wheel
        wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        const rotation = 360 * 5 + (winnerIndex * (360 / filteredParticipants.length));
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            document.getElementById('result').innerText = `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
        }, 5000); // Match the duration of the spin
    }, 0);
}
let participants = [];

fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
    })
    .catch(error => console.error('Error loading participants:', error));

function spin() {
    const gender = document.getElementById('gender').value;
    let filteredParticipants = participants;

    if (gender !== 'all') {
        filteredParticipants = participants.filter(p => p.gender === gender);
    }

    if (filteredParticipants.length === 0) {
        document.getElementById('result').innerText = 'No participants found';
        return;
    }

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    const wheel = document.getElementById('wheel');
    
    // Reset the animation
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    setTimeout(() => {
        // Spin the wheel
        wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        const rotation = 360 * 5 + (winnerIndex * (360 / filteredParticipants.length));
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            document.getElementById('result').innerText = `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
        }, 5000); // Match the duration of the spin
    }, 0);
}
