auth.onAuthStateChanged((user) => {
    if (user) {
        // console.log(user.email, "has logged in");
        var userPicture;

        if (user.photoURL == null) {
            userPicture = "/img/empty-profile.png";
        } else {
            console.log('test2: ' + user.uid)

            let path = 'users/' + user.uid + "/profilePicture.png"
            // var starsRef = storageRef.child('images/stars.jpg');

            var test = storage.ref(path);

            console.log('test3: ' + test)

            test.getDownloadURL().then(function (url) {
                console.log('test4: ' + url)
                userPicture = url;
                renderUserData(url, user.displayName, user.email)

            }).catch(function (error) {
                console.log(error)
            });
        }

        function renderUserData(userPicture, userName, userEmail) {
            let navLi = `
            <a href="/pages/user-profile-page.html"><img class="circle" src="${userPicture}"></a>
            <a href="/pages/user-profile-page.html"><span class="white-text name">${userName}</span></a>
            <a href="/pages/user-profile-page.html"><span class="white-text email">${userEmail}</span></a>
            `;


            let userPanel = document.querySelector(".user-view");
            userPanel.innerHTML += navLi;
        }

    } else {
        // console.log("user has logged out");
    }
});

$(document).ready(function () {
    $('.sidenav').sidenav();

    let taskPage = "/pages/user-main-page.html"
    let journalPage = "/pages/gratitude-journal.html"
    let quotePage = "/pages/quote-of-the-day.html"
    let userPage = "/pages/user-profile-page.html"

    if (window.location.pathname == taskPage) {
        $("#task-nav").addClass('disabled');
    } else if (window.location.pathname == journalPage) {
        $("#journal-nav").addClass('disabled');
    } else if (window.location.pathname == quotePage) {
        $("#quote-nav").addClass('disabled');
    } else if (window.location.pathname == userPage) {
        $("#userTab").addClass('unclickable');
    }

});
