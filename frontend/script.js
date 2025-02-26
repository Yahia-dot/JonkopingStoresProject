fetch("http://localhost:3000/check-login", {
    credentials: "include"
})
    .then(response => response.json())
    .then(data => {
        const isLoggedIn = data.loggedIn;

        fetch("http://localhost:3000/stores")
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById("store-list");
                list.innerHTML = ""; // Clear default loading text

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(store => {
                        const li = document.createElement("li");
                        li.innerHTML = `<a href="https://${store.url}" target="_blank">${store.name}</a> - ${store.district} - location ${store.location}`;

                        if (isLoggedIn) {
                            const editButton = document.createElement("button");
                            editButton.textContent = "Edit";

                            const deleteButton = document.createElement("button");
                            deleteButton.textContent = "Delete";
                            deleteButton.addEventListener("click", () => {
                                fetch("http://localhost:3000/delete-stores", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                    body: JSON.stringify({ id: store.store_id }),
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            alert("Store deleted successfully");
                                            location.reload();
                                        } else {
                                            alert("Failed to delete store");
                                        }
                                    });
                            });

                            li.appendChild(editButton);
                            li.appendChild(deleteButton);
                        }

                        list.appendChild(li);
                    });
                } else {
                    list.innerHTML = "No stores available.";
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    });


document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/check-login", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("login-form").style.display = "none";
                document.getElementById("user-info").style.display = "block";
                document.getElementById("username-display").textContent = data.username || "Admin";
            }
        });
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",  // Ensure cookies are sent
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert("Incorrect credentials!");
                }
            });
    });

    document.getElementById("logout").addEventListener("click", () => {
        fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        }).then(() => location.reload());
    });
});


document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/check-login", {
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("store-form").style.display = "block";
            }
        });
    const form = document.getElementById("store-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const url = document.getElementById("url").value;
        const district = document.getElementById("district").value;
        const location = document.getElementById("location").value;

        fetch("http://localhost:3000/add-stores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, url, district, location }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Store added successfully");
                    form.reset();
                    location.reload();
                } else {
                    alert("Failed to add store");
                }
            });
    });
});















// Mobile menu toggle
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");

    burger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});
