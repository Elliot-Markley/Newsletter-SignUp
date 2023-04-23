const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

mailchimp.setConfig({
    apiKey: '20d5e40f40116718de7d8afb9854abf2-us9',
    server: 'us9',
});

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const listID = 'fb240eb442';

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
    }

    async function run() {
        const response = await mailchimp.lists.addListMember(listID, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
        );
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"))
    console.log("rip");
})

app.post('/failure', (req, res) => {
    res.redirect("/");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});


