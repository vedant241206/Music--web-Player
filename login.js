document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert('Please fill in both fields.');
        return;
    }

    // After successful login
    localStorage.setItem("loggedIn", "yes");
    window.location.href = "index.html";
});
