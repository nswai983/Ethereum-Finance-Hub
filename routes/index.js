/*

    HTML web pages were rendered using the express.js guide to using template engines (linked below). 

    Source: https://expressjs.com/en/guide/using-template-engines.html

    Express routes were based on learning found in the mozilla developer web docs.

    Source: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

*/

let express = require("express");
let router = express.Router();

// Index page route
router.get("/", function(req, res) {

    // Render index page
    res.render('index');

});

// Summary page route
router.post("/summary", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('summary');

});

// Wallets page route
router.post("/wallets", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('wallets');

});

// Transactions page route
router.post("/transactions", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('transactions');

});

// Export router so that it can be used by app.js
module.exports = router;