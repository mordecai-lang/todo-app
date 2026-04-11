
// --------------------
// Add task function
// --------------------
window.addTask = async function(day) {
    const container = document.getElementById(day);
    const name = container.querySelector(".task-name").value.trim();
    const date = container.querySelector(".task-date").value;
    const time = container.querySelector(".task-time").value;

    if (!name || !date || !time) {
        alert("Please fill all task fields.");
        return;
    }

    const payload = {
        day: day,
        task_name: name,
        task_date: date,
        task_time: time
    };

    try {
        const response = await fetch("/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include"
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON from server");
        }

        console.log("Add task response:", data); // debug

        if (response.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            alert(data.error || "Failed to add task");
            return;
        }

        // Clear inputs
        container.querySelector(".task-name").value = "";
        container.querySelector(".task-date").value = "";
        container.querySelector(".task-time").value = "";

        loadTasks();

    } catch (err) {
        console.error("Add task error:", err);
        alert("Server error. Try again later.");
    }
};

// --------------------
// Load tasks
// --------------------
async function loadTasks() {
    try {
        const res = await fetch("/get-tasks", {   // ✅ FIXED
            method: "GET",
            credentials: "include"
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = "/login";
            return;
        }

        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid JSON from server");
        }

        console.log("Tasks:", data); // ✅ debug

        document.querySelectorAll(".task-list").forEach(ul => ul.innerHTML = "");

        data.tasks.forEach(t => {
            const ul = document.getElementById(t.day).querySelector(".task-list");
            const li = document.createElement("li");
            li.textContent = `${t.task_name} — ${t.task_date} ${t.task_time}`;
            ul.appendChild(li);
        });

    } catch (err) {
        console.error("Load tasks error:", err);
    }
}

// Run on page load
window.onload = loadTasks;
