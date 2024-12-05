let participants = [];

// Load participants from the JSON file
fetch('participants.json')
    .then(response => response.json())
    .then(data => {
        participants = data;
    })
    .catch(error => console.error('Error loading participants:', error));

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

    const winnerIndex = Math.floor(Math.random() * filteredParticipants.length);
    const winner = filteredParticipants[winnerIndex];
    const wheel = document.getElementById('wheel');
    
    // Reset animation for a smooth spin
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    setTimeout(() => {
        // Spin the wheel with animation
        wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        
        // Calculate rotation angle for the winner
        const segments = filteredParticipants.length;
        const rotation = 360 * 5 + (winnerIndex * (360 / segments));
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            // Display the winner after the spin animation ends
            document.getElementById('result').innerText = 
                `Winner: ${winner.name}, Class Number: ${winner.classNumber}`;
        }, 5000); // Match the duration of the spin
    }, 100); // Small delay to reset the wheel before spinning
}
