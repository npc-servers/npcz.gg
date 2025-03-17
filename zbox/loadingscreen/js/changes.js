// Configuration for the Changes tab
const changesConfig = {
    headerTitle: "Server Updates",
    mainUpdate: {
        title: "Latest Update",
        date: "June 15, 2023",
        content: "Major server update with new features and improvements. Check out the details below!"
    },
    updates: [
        {
            title: "New Weapons",
            date: "June 10, 2023",
            content: "Added 5 new weapons to the arsenal including the Plasma Rifle and Quantum Blaster."
        },
        {
            title: "Map Updates",
            date: "June 5, 2023",
            content: "Redesigned the central plaza and added new secret areas to explore."
        }
    ]
};

// Function to update the Changes tab content
function updateChangesTab() {
    // Update header
    document.querySelector('.changes-header').textContent = changesConfig.headerTitle;
    
    // Update main change box
    document.querySelector('.changes-title').textContent = changesConfig.mainUpdate.title;
    document.querySelector('.changes-date').textContent = changesConfig.mainUpdate.date;
    document.querySelector('.changes-content').textContent = changesConfig.mainUpdate.content;
    
    // Update the smaller boxes
    const boxes = document.querySelectorAll('.changes-box');
    changesConfig.updates.forEach((update, index) => {
        if (index < boxes.length) {
            boxes[index].querySelector('.changes-box-title').textContent = update.title;
            boxes[index].querySelector('.changes-box-date').textContent = update.date;
            boxes[index].querySelector('.changes-box-content').textContent = update.content;
        }
    });
}

// Initialize the Changes tab
document.addEventListener('DOMContentLoaded', () => {
    updateChangesTab();
    
    // Optional: Add animation to make the tab slide in
    setTimeout(() => {
        document.querySelector('.changes-tab').style.opacity = '1';
    }, 500);
}); 