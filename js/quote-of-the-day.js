auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user.email, "has logged in");
        renderQuotes()
    } else {
        console.log("user has logged out");
    }
});

// Home Button
const home = document.querySelector("#home-btn");

home.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/pages/user-main-page.html";
});


// Render Quotes
function renderQuotes() {
    var storageRef = firebase.storage().ref("quotes");


    // Now we get the references of these images
    storageRef.listAll().then(function (result) {
        result.items.forEach(function (imageRef) {
            // And finally display them

            console.log(imageRef.location.path)

            imageRef.getDownloadURL().then((url) => {
                console.log(url)

                let html = `
                <a class="carousel-item" href="${url}" rel='lightbox'>
                    <img src="${url}" alt="${imageRef.location.path}">
                </a>
                `;
                let entries = document.querySelector(".carousel");
                entries.innerHTML += html;

                $(document).ready(function () {
                    $('.carousel').carousel();
                });
            })
        });
    }).catch(function (error) {
        // Handle any errors
        console.log(error);
    });
}

// Close when click outside of Lightbox 
$('#lightboxOverlay, #lightbox, .lb-outerContainer').on('click', function (event) {
    $("#lightbox, #overlay").hide();
});
