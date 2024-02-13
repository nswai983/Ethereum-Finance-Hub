/*

    HTML web pages were rendered using the express.js guide to using template engines (linked below). 

    Source: https://expressjs.com/en/guide/using-template-engines.html

    Express routes were based on learning found in the mozilla developer web docs.

    Source: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

    Mysql connections were based on:

    https://medium.com/@johnkolo/how-to-run-multiple-sql-queries-directly-from-an-sql-file-in-node-js-part-1-dce1e6dd2def

    For cookies:

    https://www.geeksforgeeks.org/http-cookies-in-node-js/#

    For variable passing with HTML:

    https://medium.com/swlh/read-html-form-data-using-get-and-post-method-in-node-js-8d2c7880adbf

*/

let express = require("express");
let router = express.Router();
const path = require('path');
const fs = require('fs');
let db = require("./mysql");
let cookieParser = require('cookie-parser'); 

// let handlebars = require("handlebars");



// Index page route
router.get("/", function(req, res) {

    res.clearCookie("walletData");

    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', {layout : 'index'});

});

// Summary page route
router.post("/summary", function(req, res) {

    // Collect wallet data
    let walletData = req.body.wallets;
    let walletArray = [];

    // Check wallet data; throw error if issues found

    // Get array of wallets
    let index = 0;
    let arrayIndex = 0;
    let substring = "";
    for (let i = 0; i < walletData.length; i++) {
        if (i == walletData.length - 1) {
            substring = walletData.substring(index);

            if (substring === "") {
                continue;
            } else {
                walletArray[arrayIndex] = substring
                arrayIndex++;

                if (walletArray[0].startsWith("Enter Ethereum wallets here...")) {
                    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
                    res.redirect('../');
                    return;
                }
            }

        } else if (walletData.charCodeAt(i) == 13) {

            substring = walletData.substring(index, i);

            if (substring === "") {
                index = i + 2;
                continue;
            } else {
                walletArray[arrayIndex] = substring;
                index = i + 2;
                arrayIndex++;

                if (walletArray[0].startsWith("Enter Ethereum wallets here...")) {
                    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
                    res.redirect('../');
                    return;
                }
            }
        }
    }

    // console.log(walletData);
    // console.log(walletArray);

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data

    // Set up cookie of wallet data
    res.cookie("walletData", walletArray);

    // let query = fs.readFileSync(path.join(__dirname, '../queries/walletBalances.sql')).toString();

    let query = "SELECT SUM(value) FROM walletBalances INNER JOIN Wallets on walletBalances.wallet = Wallets.idWallet WHERE walletHash in("
    for (let i = 0; i < walletArray.length; i++) {
        query = query + "'" + walletArray[i] + "', "
    }
    query = query.substring(0, query.length - 2) + ");"
    console.log(query);

    db.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            //Serves the body of the page aka "summary.handlebars" to the container //aka "index.handlebars"
            res.render('summary', {layout : 'index', totalValue: result[0]["SUM(value)"],  wallets: walletArray});
        }
    });

    
    

    
    

});

// Wallets page route
router.post("/wallets", function(req, res) {

    // Collect wallet data
    let walletArray = req.cookies["walletData"]

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display wallets page with relevant data

    let query = "SELECT SUM(value) FROM walletBalances INNER JOIN Wallets on walletBalances.wallet = Wallets.idWallet WHERE walletHash = '" + walletArray[0] + "';"

    db.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            // Render wallets page
            //Serves the body of the page aka "wallets.handlebars" to the container //aka "index.handlebars"
            res.render('wallets', {layout : 'index', walletValue: result[0]["SUM(value)"],  wallets: walletArray});
        }
    });
});

// Transactions page route
router.post("/transactions", function(req, res) {

    // Collect wallet data
    let walletArray = req.cookies["walletData"]
    let tokens = ["ETH", "USDC", "BTC"];
    let dates = ["date1", "date2", "date3", "date4"]

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data

    
    let query = "SELECT * FROM TransactionLines INNER JOIN Transactions on TransactionLines.transaction = Transactions.idTransaction INNER JOIN Tokens ON TransactionLines.token = Tokens.idToken INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet WHERE walletHash in("
    for (let i = 0; i < walletArray.length; i++) {
        query = query + "'" + walletArray[i] + "', "
    }
    query = query.substring(0, query.length - 2) + ");"
    console.log(query);

    db.query(query, (err, result) => {
        if (err) {
            throw err;
        } else {
            // Render transactions page
            //Serves the body of the page aka "transactions.handlebars" to the container //aka "index.handlebars"
            res.render('transactions', {layout : 'index', wallets: walletArray, tokens: tokens, dates: dates, transactions: result});
        }
    });

});

// Export router so that it can be used by app.js
module.exports = router;