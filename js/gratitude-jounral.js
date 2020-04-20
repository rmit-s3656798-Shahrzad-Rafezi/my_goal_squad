auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user.email, "has logged in");

        // db.collection('users').doc(user.uid).collection('journal').get().then(snapshot => {
        //     console.log(snapshot.docs);
        //     if (snapshot.size == 0) {
        //         document.querySelector("#no-entries").style.display = "block";
        //     } else {
        //         document.querySelector("#no-entries").style.display = "none";
        //     }

        // }).catch(err => {
        //     return {
        //         message: `${err}`
        //     }
        // })

        db.collection('users').doc(user.uid).collection('journal').onSnapshot(snapshot => {
            if (snapshot.size == 0) {
                document.querySelector("#no-entries").style.display = "block";
            } else {
                document.querySelector("#no-entries").style.display = "none";
            }
        })


    } else {
        console.log("user has logged out");
    }
});

// floationg button

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});


// write journal 

const journalForm = document.querySelector("#journal-form");

journalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user_entry = journalForm["journal-entry"].value;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;


    auth.onAuthStateChanged((user) => {
        db.collection('users').doc(user.uid).collection('journal').add({
            timestamp: dateTime,
            entry_string: user_entry
        }).then(() => {
            const modal = document.querySelector("#modal-entry");
            M.Modal.getInstance(modal).close();
            journalForm.reset();
        })
    });

})