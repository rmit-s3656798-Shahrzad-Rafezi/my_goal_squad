auth.onAuthStateChanged((user) => {
    if (user) {
        CURRENTUSER = user;
        console.log(user.email, "has logged in");

        db.collection('users').doc(user.uid).collection('journal').orderBy("timestamp_raw", "asc").onSnapshot(snapshot => {
            if (snapshot.size == 0) {
                document.querySelector("#no-entries").style.display = "block";
            } else {
                document.querySelector("#no-entries").style.display = "none";
            }

            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    // added
                    renderEntry(user.displayName, change.doc.data(), change.doc.id);
                }
                else if (change.type === 'removed') {
                    // removed
                    removeJournal(change.doc.id);
                };
            })
        })


    } else {
        console.log("user has logged out");
    }
});

const removeJournal = (id) => {
    const journal = document.querySelector(`.entry[id="${id}"]`);
    journal.remove();
};

// Floating action button
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

// Write journal 
const journalForm = document.querySelector("#journal-form");

journalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_entry = journalForm["journal-entry"].value;
    // Server Timestamp
    let dateTime = new firebase.firestore.Timestamp.now();
    // Approx time to manage data
    let rawTime = new Date().getTime();


    auth.onAuthStateChanged((user) => {
        db.collection('users').doc(user.uid).collection('journal').add({
            timestamp_raw: rawTime,
            timestamp: dateTime,
            entry_string: user_entry
        }).then(() => {
            const modal = document.querySelector("#modal-entry");
            M.Modal.getInstance(modal).close();
            journalForm.reset();
        })
    });

})

// Render Entry
const renderEntry = (displayName, data, id) => {
    let time = new Date(data.timestamp_raw);
    const html = `
    <div class="entry teal lighten-4" id="${id}">
        <div class="entry-title-container">
        <p class="entry-title grey-text text-darken-3">${displayName}</p>
        <p class="date grey-text text-darken-2 entry-time">${dateString(time)}</p>
        <i class="entry-delete tiny material-icons" data-id="${id}">clear</i>
        </div>
          <p class="entry-text">${data.entry_string}</P>
    </div>
    `;
    let entries = document.querySelector(".entry-container");
    entries.innerHTML += html;

    // scroll to the bottom 
    recentEntry = document.getElementById(id);
    recentEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Time since published
// Takes in Date() format as an argument
// ! Have not found a way to auto update without refreshing the entire page
const timeSince = (timeStamp) => {

    var now = new Date(),
        secondsPast = (now.getTime() - timeStamp) / 1000;
    if (secondsPast < 60) {
        return parseInt(secondsPast) + 's';
    }
    if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm';
    }
    if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + 'h';
    }
    if (secondsPast > 86400) {
        day = timeStamp.getDate();
        month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + " " + month + year;
    }
}

// Format datatype Date to DDMMM HH:mm
// Takes in Date() format as an argument
const dateString = (date) => {
    let strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let d = date.getDate();
    let m = strArray[date.getMonth()];
    let y = date.getFullYear();
    let H = date.getHours();
    let M = date.getMinutes();
    let S = date.getSeconds();
    return '' + (d <= 9 ? '0' + d : d) + m + ' ' +
        H + ':' +
        (M <= 9 ? '0' + M : M) + ':' +
        // (S <= 9 ? '0' + S : S) +
        (H < 12 ? 'am' : 'pm');
}

// Delete entry
const entryContainer = document.querySelector('.entry-container');
entryContainer.addEventListener('click', evt => {
    // console.log(evt);
    if (evt.target.tagName === 'I') {
        // console.log("YES")
        let id = evt.target.getAttribute('data-id')
        console.log(id)
        auth.onAuthStateChanged((user) => {
            db.collection('users').doc(user.uid).collection('journal').doc(id).delete()
        })

    }
})


// Button for testing functions
// let test = document.querySelector('.test');

// test.addEventListener("click", (e) => {
//     e.preventDefault();
//     // let dateTime = new firebase.firestore.Timestamp.now();
//     // let rawTime = dateTime.seconds;

//     // let min = rawTime / 60;
//     // let hr = min / 60;
//     // let day = hr / 24;
//     // let week = day / 7;

//     // console.log(week)
//     const time = new Date();

//     const test = dateString(time)

//     console.log(CURRENTUSER);

// })


