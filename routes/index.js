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

    For date strings: https://stackoverflow.com/questions/45906215/insert-date-to-mysql-with-node

*/

let express = require("express");
let router = express.Router();
const path = require('path');
const fs = require('fs');
let queries = require("./queries");
let cookieParser = require('cookie-parser');
let etherscan = require("./etherscan");
let dateTime = require('node-datetime')


// let handlebars = require("handlebars");



/*
    Routes to the index page using a GET http request.
*/
router.get("/", async function (req, res) {

    // Reset wallet data in cookie
    res.clearCookie("walletData");

    // Clear all transactions
    // await queries.deleteTransactions();

    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', { layout: 'index' });

});

// Summary page route
router.post("/summary", async function (req, res) {

    // Collect wallet data
    let walletData = req.body.wallets;
    let walletArray = req.cookies["walletData"];

    // Get wallet data if coming from index page
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

    // Get list of wallets in database
    databaseWallets = await queries.getWallets();
    databaseWalletsArray = [];
    for (let i = 0; i < databaseWallets.length; i++) {
        databaseWalletsArray.push(databaseWallets[i]["walletHash"]);
    }

    // Request wallet balance data from Etherscan API
    for (let i = 0; i < walletArray.length; i++) {

        // Check if wallet is in database; add wallet to database if not found
        if (!databaseWalletsArray.includes(walletArray[i])) {
            // Add wallets to database
            await queries.addWallet(walletArray[i]);
        }

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
            // console.log(newTsx.length);
            // console.log(pageNum);
            if (newTsx.length < 1000) {
                pagesRemaining = false
            } else {
                pageNum++;
            }
        }

        // Add each normal transaction to the database
        for (let j = 0; j < normalTsx.length; j++) {

            // If transaction has issues, continue
            if (normalTsx[j] === undefined) {
                continue
            } else {

                console.log(normalTsx[j]);

                // Get wallet ID for transaction
                let idWallet = await queries.getWalletId(walletArray[i]);

                // Get Token ID
                let idToken = await queries.getTokenId(normalTsx[j].contractAddress);

                // If token ID is not in database, insert token into databse
                if (idToken === undefined) {

                    if (normalTsx[j].contractAddress === '') {
                        // Insert ETH token into database
                        await queries.insertToken("ETH", "N/A", "Ethereum");
                    } else {
                        // Get token info from etherscan
                        let tokenInfo = await etherscan.getTokenInfo(normalTsx[j].contractAddress);

                        // Insert token into database
                        await queries.insertToken(tokenInfo.tokenName, normalTsx[j].contractAddress, "Ethereum");
                    }


                }

                let idTsx = await queries.getTransaction(normalTsx[j].hash)[0];

                if (idTsx) {
                    // insert current transaction line into database
                    await queries.insertTransactionLine(idTsx, idToken, normalTsx[j].value, 0); // to update for inflow/outflow
                    
                } else {
                    // Format date to be inserted
                    let d = new Date(Date(normalTsx[j].timeStamp));
                    
                    // Since transaction does not yet exist in database, insert into database
                    await queries.insertTransaction(normalTsx[j].hash, "" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(), normalTsx[j].to, normalTsx[j].from, normalTsx[j].gasUsed, idWallet);

                    // Get transaction ID now that it has been created
                    idTsx = await queries.getTransaction(normalTsx[j].hash)[0];
                    
                    // insert current transaction line into database
                    await queries.insertTransactionLine(idTsx, idToken, normalTsx[j].value, 0); // to update for inflow/outflow
                }
                
            }
        }
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


    // Get pricing data from CrypoCompare API

    // Get wallet(s) balance / total value
    let totalValue = 0;

    if (walletArray.length == 1) {
        totalValue = await queries.getWalletBalance(walletArray[0]);
    } else {
        totalValue = await queries.getWalletsBalance(walletArray);
    }

    //Serves the body of the page aka "summary.handlebars" to the container //aka "index.handlebars"
    res.render('summary', { layout: 'index', totalValue: totalValue, wallets: walletArray });

});

/*
    Routes to the wallets page using a POST http request.
*/
router.post("/wallets", async function (req, res) {

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
            res.render('wallets', { layout: 'index', walletValue: result[0]["SUM(value)"], wallets: walletArray });
        }
    });
});

/*
    Routes to the transactions page using a POST http request.
*/
router.post("/transactions", async function (req, res) {

    // Collect wallet data
    let walletArray = req.cookies["walletData"]
    let tokens = ["ETH", "USDC", "BTC"];
    let dates = ["2/12/2024"]

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data



    // Add semicolon to end
    let transactionData = await queries.getTransactions(req.body, walletArray);

    console.log(transactionData);

    // Render transactions page
    //Serves the body of the page aka "transactions.handlebars" to the container //aka "index.handlebars"
    res.render('transactions', { layout: 'index', wallets: walletArray, tokens: tokens, dates: dates, transactions: transactionData });
});


/*
    HELPER FUNCTIONS
*/






// Export router so that it can be used by app.js
module.exports = router;