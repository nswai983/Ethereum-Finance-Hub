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
let queries = require("./queries");
let cookieParser = require('cookie-parser'); 
let etherscan = require("./etherscan");

// let handlebars = require("handlebars");



// Index page route
router.get("/", function(req, res) {

    res.clearCookie("walletData");

    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', {layout : 'index'});

});

// Summary page route
router.post("/summary", async function(req, res) {

    // Collect wallet data
    let walletData = req.body.wallets;
    let walletArray = req.cookies["walletData"];

    if (walletArray === undefined) {
        // Check wallet data; throw error if issues found

        // Get array of wallets
        walletArray = [];
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
        // Set up cookie of wallet data
        res.cookie("walletData", walletArray);
    }

    // console.log(walletData);
    // console.log(walletArray);


    // Get list of wallets in database
    databaseWallets = await queries.getWallets();

    // Request wallet balance data from Etherscan API
    for (let i = 0; i < walletArray.length; i++) {

        // Check if wallet is in database
        walletFound = false;
        for (let j = 0; j < databaseWallets.length; j++) {
            if (walletArray[i] === databaseWallets[j]["walletHash"]) {
                walletFound = true
            }
        }

        // Add wallet to database if not found
        if (!walletFound) {
            // Add wallets to database
            await queries.addWallet(walletArray[i]);
        }
        

        
        // ethereumBalance = await etherscan.getAccountEthereumBalance(walletArray[i]);

        // Get normal transactions for wallet

        let pageNum = 1;
        let pagesRemaining = true;
        let normalTsx = [];

        while (pagesRemaining) {

            // Get new transactions
            let newTsx = await etherscan.getAccountNormalTransactions(walletArray[i], pageNum);

            // Add new transactions to array
            normalTsx = normalTsx.concat(newTsx);

            // See if we have reached the end of the transactions. If not, add 1 to page number
            if (newTsx.length < 1000) {
                pagesRemaining = false
            } else {
                pageNum++;
            }

        }

        // Add each normal transaction to the database
        for (let i = 0; i < normalTsx.length; i++) {
            await queries.insertTransaction(normalTsx[i].hash, normalTsx[i].timeStamp, normalTsx[i].to, normalTsx[i].from, normalTsx[i].gasUsed, walletArray[i])
        }

        // internalTsx = await etherscan.getAccountInternalTransactions(walletArray[i]);
        // erc20Tsx = await etherscan.getAccountERC20Transactions(walletArray[i]);
        // erc721Tsx = await etherscan.getAccountERC721Transactions(walletArray[i]);
        // erc1155Tsx = await etherscan.getAccountERC1155Transactions(walletArray[i]);


        
        // console.log(ethereumBalance);
        // console.log(normalTsx);
        // console.log(internalTsx);
        // console.log(erc20Tsx);
        // console.log(erc721Tsx);
        // console.log(erc1155Tsx);
    }


    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data



    // let query = fs.readFileSync(path.join(__dirname, '../queries/walletBalances.sql')).toString();

    let totalValue = 0;

    // console.log(walletArray);
    
    // Get wallet(s) total value
    if (walletArray.length == 1) {
        totalValue = await queries.getWalletBalance(walletArray[0]);
    } else {
        totalValue = await queries.getWalletsBalance(walletArray);
    }

    //Serves the body of the page aka "summary.handlebars" to the container //aka "index.handlebars"
    res.render('summary', {layout : 'index', totalValue: totalValue,  wallets: walletArray});

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

    database.query(query, (err, result) => {
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
    let dates = ["2/12/2024"]

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    let query = "SELECT * FROM TransactionLines INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction INNER JOIN Tokens ON TransactionLines.token = Tokens.idToken INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet"
    

    if (req.body.tsxHashSearch_filter !== undefined && req.body.tsxHashSearch_filter !== "Search Transactions..." && req.body.tsxHashSearch_filter !== "") {
        query = query + " WHERE tsxHash = '" + req.body.tsxHashSearch_filter + "'"
    } else {

        // Add wallet filters in where clause
        if (req.body.wallet_filter === "all" || req.body.wallet_filter === undefined) {
            query = query + " WHERE walletHash in("
            for (let i = 0; i < walletArray.length; i++) {
                query = query + "'" + walletArray[i] + "', "
            }
            query = query.substring(0, query.length - 2) + ")";
        } else {
            query = query + " WHERE walletHash = '" + req.body.wallet_filter + "'"
        }

        // Add Token filters
        if (req.body.token_filter !== "all" && req.body.token_filter !== undefined && req.body.token_filter !== "") {
            query = query + " AND tokenName = '" + req.body.token_filter + "'"
        }

        // Add Date Filter
        if (req.body.date_filter !== "all" && req.body.date_filter !== undefined && req.body.date_filter !== "") {
            query = query + " AND date = '" + req.body.date_filter + "'"
        }
    }

    // Add semicolon to end
    query = query + ";";
    console.log(query);
    

    database.query(query, (err, result) => {
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