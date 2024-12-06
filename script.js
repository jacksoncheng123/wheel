// Render the pool based on the selected gender
function renderPool() {
    const selectedGender = genderFilter.value; // Get the current gender filter
    const filteredParticipants = participants.filter(p => 
        selectedGender === "all" || p.gender === selectedGender
    );

    pool.innerHTML = "";
    fishes = [];

    filteredParticipants.forEach(participant => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundImage = `url(images/${participant.classNumber}.jpeg)`;
        fish.style.top = `${Math.random() * 90}%`;
        fish.style.left = `${Math.random() * 90}%`;
        pool.appendChild(fish);
        fishes.push(fish);

        // Smooth movement
        setInterval(() => {
            fish.style.top = `${Math.random() * 90}%`;
            fish.style.left = `${Math.random() * 90}%`;
        }, 3000);
    });
}

// Update the pool whenever the gender filter changes
genderFilter.addEventListener("change", () => {
    renderPool();
});
