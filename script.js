let map;
let clickLocation; // Store the clicked location for later use

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map = new google.maps.Map(document.getElementById("map"), {
                    center: userLocation,
                    zoom: 15,
                });

                // Fetch and render pins from the database
                fetchPins();

                // Map click event listener
                map.addListener("click", (e) => {
                    clickLocation = e.latLng; // Store the clicked location
                    openModal(); // Open the modal to collect info
                });
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        handleLocationError(false);
    }
}

// Fetch pins from MongoDB and display them on the map
function fetchPins() {
    fetch("http://localhost:3000/api/pins")  // Adjust this URL if needed
        .then(response => response.json())
        .then(data => {
            data.forEach(pin => {
                const marker = new google.maps.Marker({
                    position: { lat: pin.lat, lng: pin.lng },
                    map: map,
                    title: pin.description
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<p>${pin.description}</p>`
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });
        })
        .catch(error => console.error("Error fetching pins:", error));
}

// Open the modal
function openModal() {
    closeAbout(); // closes About panel if open
    document.getElementById("pinModal").style.display = "block";
}

// Close the modal
document.querySelector(".close").onclick = function() {
    document.getElementById("pinModal").style.display = "none";
};

// Add event listener for the form submit event, not the button
document.getElementById("pinForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    // Ensure that the map click location is set before submitting
    if (!clickLocation) {
        alert("Please select a location on the map first.");
        return;
    }

    const description = document.getElementById("description").value; // Get description from modal
    const token = localStorage.getItem('token');  // Get JWT token from localStorage

    // Check if user is authenticated
    if (!token) {
        alert('You need to log in before adding a pin.');
        return;
    }

    // Prepare the pin data
    const pinData = {
        lat: clickLocation.lat(),  // Use the clickLocation's latitude
        lng: clickLocation.lng(),  // Use the clickLocation's longitude
        description: description   // Include the description entered in the modal
    };

    // Send the pin data to the backend API to save in MongoDB
    try {
        const response = await fetch("http://localhost:3000/api/pins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // Include the JWT token in the request
            },
            body: JSON.stringify(pinData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Pin saved:", data);

            // Add a marker at the clicked location with the provided description
            const marker = new google.maps.Marker({
                position: clickLocation,
                map: map,
                title: description
            });

            // Attach an info window to display the description when the pin is clicked
            const infoWindow = new google.maps.InfoWindow({
                content: `<p>${description}</p>`
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            // Close the modal after saving the pin
            document.getElementById("pinModal").style.display = "none";
        } else {
            console.error("Error saving pin:", data.error);
            alert("Error saving pin: " + data.error);
        }

    } catch (error) {
        console.error("Error saving pin:", error);
    }

    // Reset the form
    document.getElementById("pinForm").reset();
});

// Close About
function closeAbout() {
    const about = document.getElementById('about-panel');

        about.style.transition = 'transform 0.3s ease'; 
        about.style.transform = 'translateY(0)'; 

}

document.getElementById('about-toggle').addEventListener('click', function() {
    const about = document.getElementById('about-panel');
    
    // Get current transform value
    const currentTransform = getComputedStyle(about).transform;

    // Check if the about panel is currently moved
    if (currentTransform === 'none' || currentTransform === 'matrix(1, 0, 0, 1, 0, 0)') {
        about.style.transition = 'transform 0.3s ease'; 
        about.style.transform = 'translateY(14.6em)'; 
    } else {
        about.style.transition = 'transform 0.3s ease'; 
        about.style.transform = 'translateY(0)'; 
    }
});