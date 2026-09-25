function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("active");

}


// Close mobile menu when a link is clicked

document.querySelectorAll("#navMenu a").forEach(function(link) {

    link.addEventListener("click", function() {

        document
            .getElementById("navMenu")
            .classList.remove("active");

    });

});


// Event message

function showMessage() {

    alert(
        "BREAKTHROUGH CONFERENCE 2026\n\n" +
        "October 2026\n" +
        "Nalerigu Perez Chapel International\n\n" +
        "More event information will be available soon."
    );

}