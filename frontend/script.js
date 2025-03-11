document.addEventListener("DOMContentLoaded", () => {
    const sortOrderSelect = document.getElementById("sort-order");

    // Function to fetch and display stores
    const fetchAndDisplayStores = (sortOrder = "asc") => {
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
                            // Sort stores based on the selected order
                            if (sortOrder === "asc") {
                                data.sort((a, b) => a.name.localeCompare(b.name));
                            } else {
                                data.sort((a, b) => b.name.localeCompare(a.name));
                            }

                            let currentLetter = "";

                            data.forEach(store => {
                                const firstLetter = store.name.charAt(0).toUpperCase();
                                
                                // Add a new letter heading if it's a different starting letter
                                if (firstLetter !== currentLetter) {
                                    currentLetter = firstLetter;
                                    const letterHeader = document.createElement("h3");
                                    letterHeader.textContent = currentLetter;
                                    list.appendChild(letterHeader);

                                    const separator = document.createElement("hr");
                                    separator.style.marginBottom = "10px";
                                    list.appendChild(separator);
                                }

                                const li = document.createElement("li");
                                li.innerHTML = `<a href="https://${store.url}" target="_blank">${store.name}</a> - ${store.district} - location ${store.location}`;

                                if (isLoggedIn) {
                                    const editButton = document.createElement("button");
                                    editButton.textContent = "Edit";
                                    editButton.addEventListener("click", () => {
                                        const form = document.createElement("form");
                                        form.classList.add("edit-form");

                                        form.innerHTML = `
                                            <input type="text" name="name" value="${store.name}" placeholder="Name" required>
                                            <input type="text" name="url" value="${store.url}" placeholder="URL">
                                            <input type="text" name="district" value="${store.district}" placeholder="District">
                                            <input type="text" name="location" value="${store.location || ''}" placeholder="Location">
                                            <button type="submit">Save</button>
                                            <button type="button" class="cancel-btn">Cancel</button>
                                        `;

                                        li.appendChild(form);

                                        form.addEventListener("submit", (e) => {
                                            e.preventDefault();
                                            const updatedName = form.querySelector('[name="name"]').value;
                                            const updatedUrl = form.querySelector('[name="url"]').value;
                                            const updatedDistrict = form.querySelector('[name="district"]').value;
                                            const updatedLocation = form.querySelector('[name="location"]').value;

                                            fetch("http://localhost:3000/update-stores", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                credentials: "include",
                                                body: JSON.stringify({
                                                    id: store.store_id,
                                                    name: updatedName,
                                                    url: updatedUrl,
                                                    district: updatedDistrict,
                                                    location: updatedLocation || null,
                                                }),
                                            })
                                                .then(response => response.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        alert("Store updated successfully");
                                                        location.reload();
                                                    } else {
                                                        alert("Failed to update store");
                                                    }
                                                });
                                        });

                                        form.querySelector(".cancel-btn").addEventListener("click", () => {
                                            form.remove();
                                        });
                                    });

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
    };

    // Initial fetch and display
    fetchAndDisplayStores();

    // Add event listener to the sort order select
    sortOrderSelect.addEventListener("change", (e) => {
        const sortOrder = e.target.value;
        fetchAndDisplayStores(sortOrder);
    });

    // Login functionality
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
            method: "GET",  // Ensure this matches backend
            credentials: "include"
        }).then(() => location.reload());
    });

    // Add store form functionality
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
