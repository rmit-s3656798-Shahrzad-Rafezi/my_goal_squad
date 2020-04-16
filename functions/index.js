const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


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

    return admin.auth().createUser({
        displayName: data.name,
        email: data.email,
        password: data.password
    }).then(() => {
        return {
            message: `${data.name} has been registered`
        };
    }).catch((err) => {
        return err;
    });
})
