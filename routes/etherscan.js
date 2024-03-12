/*
    Async / Await readings: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

    HTPP calls in node: https://medium.com/@mariokandut/how-to-make-an-api-request-in-node-js-e3c0323b8873

    exports readings: https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/

*/

// URL for API Calls
let API_URL = "https://api.etherscan.io/api";

// API Key for API Calls
let API_KEY = "AYQTU3RTP3P5VY16C6NKF5T3CAXBXS5W9Y";

// import axios for API processing
const axios = require('axios');

/*
    Returns the ethereum account balance for a given wallet
*/
async function getAccountEthereumBalance(wallet) {

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

/*
    Returns a list of normal transactions for a given ethereum wallet. Processes by
    page number, as there are only 1000 records returned per page.
*/
async function getAccountNormalTransactions(wallet, page) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=account&action=txlist&address=" + wallet + "&startblock=0&endblock=99999999&page=" + page + "&offset=1000&sort=asc&apikey=" + API_KEY;
            console.log(API_CALL);

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

/*
    Returns a list of internal transactions for a given ethereum wallet. Processes by
    page number, as there are only 1000 records returned per page.
*/
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

/*
    Returns a list of ERC20 transactions for a given ethereum wallet. Processes by
    page number, as there are only 1000 records returned per page.
*/
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

/*
    Returns a list of ERC721 transactions for a given ethereum wallet. Processes by
    page number, as there are only 1000 records returned per page.
*/
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

/*
    Returns a list of ERC1155 transactions for a given ethereum wallet. Processes by
    page number, as there are only 1000 records returned per page.
*/
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

/*
    Returns the information for a specific token contract address.
*/
async function getTokenInfo(contractaddress) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "?module=token&action=tokeninfo&contractaddress=" + contractaddress + "&apikey=" + API_KEY;

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

// Exports functions to the application
module.exports = { getAccountEthereumBalance, getAccountNormalTransactions, getAccountInternalTransactions, getAccountERC20Transactions, getAccountERC721Transactions, getAccountERC1155Transactions, getTokenInfo }
