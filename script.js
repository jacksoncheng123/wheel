let participants = [];

fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
    })
    .catch(error => console.error('Error loading participants:', error));

function draw() {
    const gender = document.getElementById('gender').value;
    let filteredParticipants = participants;

    if (gender !== 'all') {
        filteredParticipants = participants.filter(p => p.gender === gender);
    }

    if (filteredParticipants.length === 0) {
        document.getElementById('result').innerText = 'No participants found';
        return;
    }

    const winner = filteredParticipants[Math.floor(Math.random() * filteredParticipants.length)];
    document.getElementById('result').innerText = `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
}
