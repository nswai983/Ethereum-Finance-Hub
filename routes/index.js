/*

    HTML web pages were rendered using the express.js guide to using template engines (linked below). 

    Source: https://expressjs.com/en/guide/using-template-engines.html

    Express routes were based on learning found in the mozilla developer web docs.

    Source: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

*/

let express = require("express");
let router = express.Router();
let mysql = require("./mysql");

// let handlebars = require("handlebars");

// Index page route
router.get("/", function(req, res) {

    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', {layout : 'index'});

});

// Summary page route
router.post("/summary", function(req, res) {

    // Collect wallet data
    let wallets = [ "wallet1", "wallet2", "wallet3" ];
    let walletData = mysql.getWalletBalance(wallet1);
    console.log(walletData);

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page

    //Serves the body of the page aka "summary.handlebars" to the container //aka "index.handlebars"
    res.render('summary', {layout : 'index', wallets: wallets});

});

// Wallets page route
router.post("/wallets", function(req, res) {

    // Collect wallet data
    let wallets = [ "wallet1", "wallet2", "wallet3" ];

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render wallets page
    //Serves the body of the page aka "wallets.handlebars" to the container //aka "index.handlebars"
    res.render('wallets', {layout : 'index', wallets: wallets});

});

// Transactions page route
router.post("/transactions", function(req, res) {

    // Collect wallet data
    let wallets = [ "wallet1", "wallet2", "wallet3" ];
    let tokens = ["ETH", "USDC", "BTC"];

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    //Serves the body of the page aka "transactions.handlebars" to the container //aka "index.handlebars"
    res.render('transactions', {layout : 'index', wallets: wallets, tokens: tokens});

});

// Export router so that it can be used by app.js
module.exports = router;