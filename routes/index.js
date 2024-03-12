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

    https://www.freecodecamp.org/news/how-to-convert-a-string-to-a-number-in-javascript/

    https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript

    https://stackoverflow.com/questions/221294/how-do-i-get-a-timestamp-in-javascript

    https://www.w3schools.com/js/js_arithmetic.asp

*/

let express = require("express");
let router = express.Router();
const path = require('path');
const fs = require('fs');
let queries = require("./queries");
let cookieParser = require('cookie-parser');
let etherscan = require("./etherscan");
let cryptoCompare = require("./cryptoCompare");
let dateTime = require('node-datetime');
const { time } = require("console");



// let handlebars = require("handlebars");

/*
    Routes to the index page using a GET http request.
*/
router.get("/", async function (req, res) {

    // Reset wallet data in cookie
    res.clearCookie("walletData");

    // Clear all transactions
    await queries.deleteData();

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

                    if (walletArray[0].startsWith("Enter Ethereum wallets here...") || walletArray[0] === "") {
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

                    if (walletArray[0].startsWith("Enter Ethereum wallets here...") || walletArray[0] === "") {
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
            console.log("Wallet added to database: " + walletArray[i]);
        }

        console.log("Loading transactions into database for wallet " + walletArray[i] + "...");
        // Get normal transactions loaded into database
        await getTransactions(walletArray[i], "Normal");
        console.log("Normal transactions loaded for wallet: " + walletArray[i]);

        // Get internal transactions loaded into database
        await getTransactions(walletArray[i], "Internal");
        console.log("Internal transactions loaded for wallet: " + walletArray[i]);

        // Get ERC20 transactions loaded into database
        await getTransactions(walletArray[i], "ERC20");
        console.log("ERC20 transactions loaded for wallet: " + walletArray[i]);

        // Get ERC721 transactions loaded into database
        await getTransactions(walletArray[i], "ERC721");
        console.log("ERC721 transactions loaded for wallet: " + walletArray[i]);

        // Get ERC1155 transactions loaded into database
        await getTransactions(walletArray[i], "ERC1155");
        console.log("ERC1155 transactions loaded for wallet: " + walletArray[i]);
    }

    // Get pricing data from CrypoCompare API
    let tokenArray = await queries.getTokenContractAddresses();
    console.log(tokenArray);
    for (let i = 0; i < tokenArray.length; i++) {
        if (tokenArray[i]["tokenName"] && tokenArray[i]["tokenName"].length !== 42) {
            await getPrices(tokenArray[i]["tokenName"], tokenArray[i]["contractAddress"]);
        }
    }


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
    let walletArray = req.cookies["walletData"];
    let tokens = await queries.getTokens();
    let dates = await queries.getTransactionDates();
    let dateStrings = [];

    // Set up dates to be in line with readable format
    for (let i = 0; i < dates.length; i++) {
        // Format date
        let year = dates[i]["date"].getFullYear().toString();
        let month = dates[i]["date"].getMonth() + 1;
        if (month < 10) {
            month = "0" + month.toString();
        } else {
            month = month.toString();
        }
        let day = dates[i]["date"].getDate();
        if (day < 10) {
            day = "0" + day.toString();
        } else {
            day = day.toString();
        }
        dateStrings.push(year + "-" + month + "-" + day);
    }


    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data



    // Get transactions
    let transactionData = await queries.getTransactions(req.body, walletArray);

    // Render transactions page
    //Serves the body of the page aka "transactions.handlebars" to the container //aka "index.handlebars"
    res.render('transactions', { layout: 'index', wallets: walletArray, tokens: tokens, dates: dateStrings, transactions: transactionData });
});


/*
    HELPER FUNCTIONS
*/

/*
    Receives an Ethereum wallet and loads all transactions of the given type from that wallet into the database.
*/
async function getTransactions(wallet, transactionType) {
    // Get normal transactions for wallet
    let pageNum = 1;
    let pagesRemaining = true;
    let tsxArray = [];
    let valueDivisor;

    // Get new transactions loaded into database
    while (pagesRemaining) {

        // Get new transactions
        let newTsx;

        switch (transactionType) {
            case "Normal":
                newTsx = await etherscan.getAccountNormalTransactions(wallet, pageNum);
                break;
            case "Internal":
                newTsx = await etherscan.getAccountInternalTransactions(wallet, pageNum);
                break;
            case "ERC20":
                newTsx = await etherscan.getAccountERC20Transactions(wallet, pageNum);
                break;
            case "ERC721":
                newTsx = await etherscan.getAccountERC721Transactions(wallet, pageNum);
                break;
            case "ERC1155":
                newTsx = await etherscan.getAccountERC1155Transactions(wallet, pageNum);
                break;
            default:
                throw new Error("Transaction type not found.")
        }

        // Add new transactions to array
        tsxArray.concat(newTsx);

        // See if we have reached the end of the transactions. If not, add 1 to page number
        if (newTsx.length < 1000) {
            pagesRemaining = false
        } else {
            pageNum++;
        }
    }

    // Add each normal transaction to the database
    for (let i = 0; i < tsxArray.length; i++) {

        // Set Value Divisor
        switch (transactionType) {
            case "Normal":
                valueDivisor = 1000000000000000000;
                break;
            case "Internal":
                valueDivisor = 1000000000000000000;
                break;
            case "ERC20":
                valueDivisor = tsxArray[i].tokenDecimal ** 10;
                break;
            case "ERC721":
                valueDivisor = 1;
                break;
            case "ERC1155":
                valueDivisor = 1;
                break;
            default:
                throw new Error("Transaction type not found.")
        }


        // If transaction has issues, continue
        if (tsxArray[i] === undefined) {
            continue
        } else {

            // Get wallet ID for transaction
            let idWallet = await queries.getWalletId(wallet);

            // Get Token ID
            let idToken = await queries.getTokenId(tsxArray[i].contractAddress);

            // If token ID is not in database, insert token into databse
            if (idToken === undefined) {

                if (tsxArray[i].contractAddress === '') {

                    idToken = await queries.getTokenId("ETH");

                    if (idToken === undefined) {
                        // Insert ETH token into database
                        await queries.insertToken("ETH", "ETH", "Ethereum");

                        idToken = await queries.getTokenId("ETH");
                    }
                } else {
                    // console.log(tsxArray[i].contractAddress);
                    // Get token info from etherscan
                    let tokenInfo = await cryptoCompare.getTokenInfo(tsxArray[i].contractAddress);

                    // If token info was not found, replace with contract address
                    if (tokenInfo === "N/A") {
                        tokenInfo = tsxArray[i].contractAddress;
                    }

                    // Insert token into database
                    await queries.insertToken(tokenInfo, tsxArray[i].contractAddress, "Ethereum");
                    console.log("Token Added: " + tokenInfo);

                    // Re-query token ID
                    idToken = await queries.getTokenId(tsxArray[i].contractAddress);
                }
            }

            let transactionData = await queries.getTransaction(tsxArray[i].hash)[0];

            if (transactionData) {
                // insert current transaction line into database
                await queries.insertTransactionLine(transactionData.idTransaction, idToken, (tsxArray[i].value || tsxArray[i].tokenValue) / valueDivisor, 0); // to update for inflow/outflow

            } else {
                // Format date to be inserted
                let timestamp = Number(tsxArray[i]["timeStamp"]);
                let d = new Date(timestamp * 1000);
                let year = d.getFullYear().toString();
                let month = d.getMonth() + 1;
                month = month.toString();
                let day = d.getDate().toString();
                let date = year + "-" + month + "-" + day;

                // Since transaction does not yet exist in database, insert into database
                await queries.insertTransaction(tsxArray[i].hash, date, tsxArray[i].to, tsxArray[i].from, tsxArray[i].gasUsed / valueDivisor, idWallet, timestamp);

                // Get transaction ID now that it has been created
                transactionData = await queries.getTransaction(tsxArray[i].hash);

                // insert current transaction line into database
                await queries.insertTransactionLine(transactionData[0]["idTransaction"], idToken, (tsxArray[i].value || tsxArray[i].tokenValue) / valueDivisor, 0); // to update for inflow/outflow
            }

        }

        if (tsxArray[i].hash === "0xb873353437a0be2f2600b1b1d276bb872781d7d50f8dda6ab361487c35d92192") {
            console.log(tsxArray[i]);
        }
    }
}

/*
    Receives an Ethereum token and loads all prices up to the earliest date of transactions for that token into the database.
*/
async function getPrices(tokenSymbol, contractAddress) {

    let tokenID = await queries.getTokenId(contractAddress);

    // Get earliest transaction date for token
    let timestamps = await queries.getTransactionTimestampsByToken(contractAddress);
    let earliestTimestamp;
    let latestTimestamp;
    if (timestamps) {
        earliestTimestamp = timestamps[0]["timestamp"];
        latestTimestamp = timestamps[timestamps.length - 1]["timestamp"];
    }

    // Get price for each timestamp and add to database
    for (i in timestamps) {

        // console.log(timestamps[i]["timestamp"]);

        let price = await cryptoCompare.getTokenPrice(tokenSymbol, timestamps[i]["timestamp"])
        // console.log(price);

        if (price === "N/A") {
            continue
        } else {
            // Format date to be inserted
            let timestamp = Number(timestamps[i]["timestamp"]);
            let d = new Date(timestamp * 1000);
            let year = d.getFullYear().toString();
            let month = d.getMonth() + 1;
            month = month.toString();
            let day = d.getDate().toString();
            let date = year + "-" + month + "-" + day;

            await queries.insertPrice(tokenID, date, price[tokenSymbol]["USD"]);
        }
    }

    // console.log(timestamps);
    // console.log(earliestTimestamp);
    // console.log(latestTimestamp);
}

// Export router so that it can be used by app.js
module.exports = router;