const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


// Make admin 

exports.makeAdminRole = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            message: `${data.email} has been made an admin`
        };
    }).catch((err) => {
        return err;
    });
});

// Create new user 

exports.createNewUser = functions.https.onCall((data, context) => {
    const name = data.name
    const email = data.email;
    const password = data.password;
    const tel = data.tel;

    return admin.auth().createUser({
        displayName: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.tel
    }).then(cred => {
        // return {
        //     message: `${cred.displayName} has been registered`
        // };
        return true;
    }).catch((err) => {
        return err;
    });
})

exports.accountCreate = functions.auth.user().onCreate(user => {
    userDoc = {
        email: user.email,
        displayName: user.displayName
    }
    // admin.firestore().collection('users').doc(user.uid)
    //     .set(userDoc).then(writeResult => {
    //         console.log('User Created result:', writeResult);
    //         return null;
    //     }).catch(err => {
    //         console.log(err);
    //         return null;
    //     });
    return null;
});
