/*
    Async / Await readings: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

    HTPP calls in node: https://medium.com/@mariokandut/how-to-make-an-api-request-in-node-js-e3c0323b8873

    exports readings: https://www.freecodecamp.org/news/module-exports-how-to-export-in-node-js-and-javascript/

*/

// URL for API Calls
let API_URL = "https://data-api.cryptocompare.com/";

// API Key for API Calls
let API_KEY = "94238a4e89f43d0967286ea84fff3c1e8aa7d5c97b296636841bffa1bcc92ce2";

// import axios for API processing
const axios = require('axios');

/*
    Returns the information for a specific token contract address.
*/
async function getTokenInfo(contractaddress) {

    return new Promise((resolve) => {

        setTimeout(() => {

            // API call variable creation
            let API_CALL = API_URL + "onchain/v1/data/by/address?address=" + contractaddress + "&chain_symbol=ETH&api_key=" + API_KEY;

            // Perform API Call
            axios
                .get(API_CALL)
                .then(response => {
                    resolve(response.data.Data.SYMBOL);
                })
                .catch(error => {
                    resolve("N/A");
                });
        }, 250);
    });

}

// Exports functions to the application
module.exports = { getTokenInfo }
