document.addEventListener("DOMContentLoaded", function() {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownContent = document.querySelector(".dropdown-content");

    console.log("Dropdown Button:", dropdownBtn);
    console.log("Dropdown Content:", dropdownContent);

    dropdownBtn.addEventListener("click", function() {
        console.log("Dropdown button clicked");
        dropdownContent.classList.toggle("show");
    });
});