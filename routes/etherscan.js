/*
    Async / Await readings: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

    HTPP calls in node: https://medium.com/@mariokandut/how-to-make-an-api-request-in-node-js-e3c0323b8873

    exports readings: https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/

*/

let API_URL = "https://api.etherscan.io/api";

let API_KEY = "AYQTU3RTP3P5VY16C6NKF5T3CAXBXS5W9Y";

// import node-fetch
const axios = require('axios');


function getAccountEthereumBalance(wallet) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=balance&address=" + wallet + "&tag=latest&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });

        }, 250);
    });

}

async function getAccountNormalTransactions(wallet, page) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=txlist&address=" + wallet + "&startblock=0&endblock=99999999&page=" + page + "&offset=1000&sort=asc&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });
        }, 250);
    });

}

async function getAccountInternalTransactions(wallet) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=txlistinternal&address=" + wallet + "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });
        }, 250);
    });

}

async function getAccountERC20Transactions(wallet) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=tokentx&address=" + wallet + "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });
        }, 250);
    });

}

async function getAccountERC721Transactions(wallet) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=tokennfttx&address=" + wallet + "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });
        }, 250);
    });

}

async function getAccountERC1155Transactions(wallet) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=token1155tx&address=" + wallet + "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" + API_KEY;

            // Perform API Call
            axios
            .get(API_CALL)
            .then(response => {
                resolve(response.data.result);
            })
            .catch(error => {
                resolve(error);
            });
        }, 250);
    });

}
module.exports = {getAccountEthereumBalance, getAccountNormalTransactions, getAccountInternalTransactions, getAccountERC20Transactions, getAccountERC721Transactions, getAccountERC1155Transactions}
