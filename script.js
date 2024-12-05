let participants = [];

// Load participants from the JSON file
fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
        console.log("Participants loaded:", participants);
    })
    .catch(error => console.error('Error loading participants:', error));

function createSegments(filteredParticipants) {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = ''; // Clear previous segments
    const totalSegments = filteredParticipants.length;
    const segmentAngle = 360 / totalSegments;

    filteredParticipants.forEach((participant, index) => {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.background = index % 2 === 0 ? 'lightblue' : 'lightcoral'; // Alternate colors
        segment.style.transform = `rotate(${index * segmentAngle}deg)`;
        segment.innerText = participant.name; // Optional: Add names
        segment.style.textAlign = 'center';
        segment.style.color = '#000';
        segment.style.fontSize = '12px';
        wheel.appendChild(segment);
    });
}

function spin() {
    const gender = document.getElementById('gender').value;

    // Filter participants by gender
    const filteredParticipants = (gender === 'all') 
        ? participants 
        : participants.filter(p => p.gender === gender);

    if (filteredParticipants.length === 0) {
        document.getElementById('result').innerText = 'No participants found';
        return;
    }

    // Create dynamic segments
    createSegments(filteredParticipants);

    // Randomly select a winner
    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    const wheel = document.getElementById('wheel');

    // Reset animation
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    // Spin the wheel
    setTimeout(() => {
        wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        const rotation = 360 * 5 + (winnerIndex * (360 / filteredParticipants.length));
        wheel.style.transform = `rotate(${rotation}deg)`;

        // Show result
        setTimeout(() => {
            document.getElementById('result').innerText = 
                `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
        }, 5000); // Match spin duration
    }, 100);
}
