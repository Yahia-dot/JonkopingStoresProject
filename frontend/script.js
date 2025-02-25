// Fetch store data and display it
fetch("http://localhost:3000/stores")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const list = document.getElementById("store-list");
        list.innerHTML = ""; // Clear default loading text

        data.forEach(store => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="https://${store.url}" target="_blank">${store.name}</a> - ${store.district}`;
            list.appendChild(li);
        });
    })
    .catch(error => console.error("Error fetching data:", error));

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
