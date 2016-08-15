'use strict';

// Rename this file to local.js for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

//For example:

module.exports = {
    db: {
        uri: 'mongodb://meds:meds@ds153715.mlab.com:53715/meds',
        options: {
            user: '',
            pass: ''
        }
    },
    google: {
        clientID: process.env.GOOGLE_ID || '619369132177-naovs16pij0lirklvbc06gi8fbgeb4lu.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'DaYOKza68Rl52i20YEAflLqr'
    }
};
