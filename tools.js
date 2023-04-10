const { OAuth2Client } = require('google-auth-library')
require("dotenv").config({ path: "./tools.env" });

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const tokenValidation = async (token) => {
    try {
        // verify token using Google API
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const { name, given_name, family_name, email, picture } = ticket.getPayload();

        return ({ name, given_name, family_name, email, picture }); // return client data and token

    } catch (err) {
        console.log(err);
        return null;
    }
};

module.exports = { tokenValidation };
