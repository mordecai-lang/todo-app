document.addEventListener("DOMContentLoaded", function() {
    var loginBtn = document.getElementById("loginBtn");
    var msg = document.getElementById("login-msg");

    loginBtn.addEventListener("click", function() {
        handleLogin();
    });

    async function handleLogin() {
        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value.trim();

        if (!username || !password) {
            msg.style.color = "red";
            msg.textContent = "Please enter both username and password.";
            return;
        }

        try {
            var response = await fetch("/login", {   // ✅ FIXED
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password }),
                credentials: "include"
            });

            let data;

            // ✅ Handle cases where response is not JSON (avoids crash)
            try {
                data = await response.json();
            } catch (e) {
                throw new Error("Invalid JSON response from server");
            }

            console.log("Response:", data); // ✅ Debug

            if (response.ok) {
                msg.style.color = "green";
                msg.textContent = data.message || "Login successful";

                setTimeout(function() {
                    window.location.href = "/dashboard";
                }, 1000);

            } else {
                msg.style.color = "red";
                msg.textContent = data.error || "Login failed";
            }

        } catch (err) {
            msg.style.color = "red";
            msg.textContent = "Server error, try again later.";
            console.error("Login error:", err);
        }
    }
});
