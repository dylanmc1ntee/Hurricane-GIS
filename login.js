document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the form submission
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent page refresh on form submission

        // Get values from the form fields
        const username = document.getElementById('username').value.trim(); // Trim to avoid extra spaces
        const password = document.getElementById('password').value;

        try {
            // Ensure username and password are not empty before making request
            if (!username || !password) {
                alert('Please fill in both username and password');
                return;
            }

            console.log({ username, password }); // For debugging

            // Send a POST request to the server for login
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Ensure the data is passed correctly
            });

            const data = await response.json();

            if (response.ok) {
                // If login is successful, display a success message
                alert('Login successful!');
                console.log('Received token:', data.token);
                
                // Store the JWT token in localStorage
                localStorage.setItem('token', data.token);  

                // Redirect to home page after login
                window.location.href = "index.html"; 
            } else {
                // Handle login failure
                alert(data.message || 'Login failed');
                console.error('Login Error:', data);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    });
});
