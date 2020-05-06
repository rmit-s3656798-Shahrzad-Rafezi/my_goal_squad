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
                <a class="carousel-item">
                    <img src="${url}" alt="${imageRef.location.path}">
                </a>
                `;
                let entries = document.querySelector(".carousel");
                entries.innerHTML += html;

                $(document).ready(function () {
                    $('.carousel').carousel();
                });
            })

            // displayImage(imageRef);
        });
    }).catch(function (error) {
        // Handle any errors
    });
}

// `$(document).on('click', 'img', function () {
//     var wH = $(window).height();
//     $(this).animate({
//         height: "1000px",
//         width: "1000px"
//     });
// });`