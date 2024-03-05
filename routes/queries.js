/*

    The file contains the various sql statements used in the application.

    Source: https://www.w3schools.com/nodejs/nodejs_mysql.asp

    https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e

    https://www.freecodecamp.org/news/javascript-modules-explained-with-examples/

    Use of mysql2 package vs mysql came from an authentication issue with mysql package. Issue resolved via this article:
    https://github.com/strapi/strapi/issues/13774

    https://medium.com/@johnkolo/how-to-run-multiple-sql-queries-directly-from-an-sql-file-in-node-js-part-1-dce1e6dd2def

    https://gist.github.com/TheoOkafor/1762e455b0e76c6764f0deabc08c8a77

    https://stackoverflow.com/questions/498197/mysql-how-to-join-tables-on-two-fields

*/

// const { query } = require("express");
const path = require('path');
const fs = require('fs');

/*
  Funtion getWalletBalance(wallet: a specific wallet)

  Returns the current wallet balance for a given wallet.
*/
async function getWalletBalance(wallet) {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT SUM(value) FROM walletBalances WHERE wallet = " + wallet + ";";

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result[0]["SUM(value)"]);
      }
    });
  });
};

/*
  Funtion getWalletsBalance(wallets: a list of wallets)

  Returns the current wallet balance for a given list of wallets.
*/
async function getWalletsBalance(wallets) {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT SUM(value) FROM walletBalances INNER JOIN Wallets on walletBalances.wallet = Wallets.idWallet WHERE walletHash in("
    for (let i = 0; i < wallets.length; i++) {
      query = query + "'" + wallets[i] + "', "
    }
    query = query.substring(0, query.length - 2) + ");"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result[0]["SUM(value)"]);
      }
    });
  });
}

async function addWallet(wallet) {

  return new Promise((resolve) => {

    // Create query
    let query = "INSERT INTO `Wallets` (`walletHash`) VALUES ('" + wallet + "');"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function addWallets(wallets) {

  return new Promise((resolve) => {

    // Create query
    let query = "INSERT INTO `Wallets` (`walletHash`) VALUES ("
    for (let i = 0; i < wallets.length; i++) {
      query = query + "'" + wallets[i] + "', ";
    }
    query = query.substring(0, query.length - 2) + ");"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getWallets() {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT walletHash FROM Wallets;"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getWalletId(wallet) {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT idWallet FROM Wallets WHERE walletHash = '" + wallet + "';"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result[0] === undefined) {
          resolve(undefined);
        }
        else {
          resolve(result[0]["idWallet"]);
        }
      }
    });
  });
}

async function getTokens() {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT tokenName FROM Tokens GROUP BY tokenName;"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getTokenContractAddresses() {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT tokenName, contractAddress FROM Tokens GROUP BY contractAddress;"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getTokenId(tokenAddress) {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT idToken FROM Tokens WHERE contractAddress = '" + tokenAddress + "';"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result[0] === undefined) {
          resolve(undefined);
        }
        else {
          resolve(result[0]["idToken"]);
        }
      }
    });
  });
}

async function insertToken(tokenName, contractAddress, blockchain) {

  return new Promise((resolve) => {

    // Create query
    let query = "INSERT INTO Tokens (`tokenName`, `contractAddress`, `blockchain`) VALUES ('" + tokenName + "', '" + contractAddress + "', '" + blockchain + "');"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function insertPrice(tokenID, date, price) {

  return new Promise((resolve) => {

    // Create query
    let query = "INSERT INTO Prices (`token`, `date`, `price`) VALUES (" + tokenID + ", '" + date + "', " + price + ");"
    // console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function insertTransaction(tsxHash, date, to, from, fee, wallet, timestamp) {

  return new Promise((resolve) => {

    // Check if Transaction exists, if not create one

    let query = "INSERT INTO Transactions (`tsxHash`, `date`, `to`, `from`, `fee`, `wallet`, `timestamp` ) VALUES ('" + tsxHash + "', '" + date + "', '" + to + "', '" + from + "', '" + fee + "', '" + wallet + "', " + timestamp + ");"

    // console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getTransaction(tsxHash) {

  return new Promise((resolve) => {

    // Check if Transaction exists, if not create one

    let query = "SELECT * FROM Transactions WHERE tsxHash = '" + tsxHash + "';";

    // console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function getTransactionDates() {

  return new Promise((resolve) => {

    // Create query
    let query = "SELECT date FROM Transactions GROUP BY date ORDER BY date;"

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

async function insertTransactionLine(transaction, token, amount, inflow) {

  return new Promise((resolve) => {

    // Check if Transaction exists, if not create one

    let query = "INSERT INTO TransactionLines (`transaction`, `token`, `amount`, `inflow` ) VALUES ('" + transaction + "', '" + token + "', " + amount + ", " + inflow + ");"

    // console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

/*
  Deletes all data in the database to start a new session.
*/
async function deleteData() {

  return new Promise((resolve) => {

    let query = fs.readFileSync(path.join(__dirname, '../queries/deleteData.sql')).toString().split(";");

    // Execute queries (except final empty string query)
    for (let i = 0; i < query.length - 1; i++) {
      subQuery = query[i] + ";";
      internalQuery(subQuery);
    }

    console.log("Data Deleted");
    resolve("Data Deleted");
  });
}

async function internalQuery(query) {

  return new Promise((resolve) => {

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
};

async function getTransactions(params, walletArray) {

  return new Promise((resolve) => {


    let query = "SELECT *, amount * price AS value FROM TransactionLines INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction INNER JOIN Tokens ON TransactionLines.token = Tokens.idToken INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet INNER JOIN Prices ON TransactionLines.token = Prices.token AND Transactions.date = Prices.date"


    if (params.tsxHashSearch_filter !== undefined && params.tsxHashSearch_filter !== "Search Transactions..." && params.tsxHashSearch_filter !== "") {
        query = query + " WHERE tsxHash = '" + params.tsxHashSearch_filter + "'"
    } else {

        // Add wallet filters in where clause
        if (params.wallet_filter === "all" || params.wallet_filter === undefined) {
            query = query + " WHERE Wallets.walletHash in("
            for (let i = 0; i < walletArray.length; i++) {
                query = query + "'" + walletArray[i] + "', "
            }
            query = query.substring(0, query.length - 2) + ")";
        } else {
            query = query + " WHERE Wallets.walletHash = '" + params.wallet_filter + "'"
        }

        // Add Token filters
        if (params.token_filter !== "all" && params.token_filter !== undefined && params.token_filter !== "") {
            query = query + " AND Tokens.tokenName = '" + params.token_filter + "'"
        }

        // Add Date Filter
        if (params.date_filter !== "all" && params.date_filter !== undefined && params.date_filter !== "") {
            query = query + " AND Transactions.date = '" + params.date_filter + "'";
        }
    }

    query = query + ";"
    console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });
}

async function getTransactionTimestampsByToken(contractAddress) {

  return new Promise((resolve) => {


    let query = "SELECT timestamp FROM TransactionLines INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction INNER JOIN Tokens ON TransactionLines.token = Tokens.idToken INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet"
    query = query + ` WHERE contractAddress = '${contractAddress}' GROUP BY timestamp ORDER BY timestamp ASC;`

    console.log(query);

    // Execute query
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });
}


/*
  QUERY: GET TRANSACTIONS LIST

  SELECT walletHash, tsxHash, date, tokenName, amount, price * (SELECT amount FROM Prices
    WHERE Prices.token = TransactionLines.token AND Prices.date = Transactions.date) AS value, from, to 
  FROM TransactionLines
  INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction
  INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet
  INNER JOIN Tokens ON TransactionsLines.token = Tokens.idToken

*/

/*
  QUERY: GET SPECIFIC TRANSACTION

  SELECT walletHash, tsxHash, date, tokenName, amount, price * (SELECT amount FROM Prices
    WHERE Prices.token = TransactionLines.token AND Prices.date = Transactions.date) AS value, from, to 
  FROM TransactionLines
  INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction
  INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet
  INNER JOIN Tokens ON TransactionsLines.token = Tokens.idToken
  WHERE tsxHash = [searched_tsx]

*/

/*
  QUERY: GET TRANSACTIONS FROM WALLET

  SELECT walletHash, tsxHash, date, tokenName, amount, price * (SELECT amount FROM Prices
    WHERE Prices.token = TransactionLines.token AND Prices.date = Transactions.date) AS value, from, to 
  FROM TransactionLines
  INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction
  INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet
  INNER JOIN Tokens ON TransactionsLines.token = Tokens.idToken
  WHERE walletHash = [filtered_wallet]

*/

/*
  QUERY: GET TRANSACTIONS BY DATE

  SELECT walletHash, tsxHash, date, tokenName, amount, price * (SELECT amount FROM Prices
    WHERE Prices.token = TransactionLines.token AND Prices.date = Transactions.date) AS value, from, to 
  FROM TransactionLines
  INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction
  INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet
  INNER JOIN Tokens ON TransactionsLines.token = Tokens.idToken
  WHERE date = [filtered_date]

*/

/*
  QUERY: GET TRANSACTIONS BY TOKEN

  SELECT walletHash, tsxHash, date, tokenName, amount, price * (SELECT amount FROM Prices
    WHERE Prices.token = TransactionLines.token AND Prices.date = Transactions.date) AS value, from, to 
  FROM TransactionLines
  INNER JOIN Transactions ON TransactionLines.transaction = Transactions.idTransaction
  INNER JOIN Wallets ON Transactions.wallet = Wallets.idWallet
  INNER JOIN Tokens ON TransactionsLines.token = Tokens.idToken
  WHERE token = [filtered_token]

*/


// Export router so that it can be used by app.js
module.exports = { getTransactionDates, getWalletBalance, getWalletsBalance, addWallets, 
  addWallet, getWallets, getWalletId, getTokenId, insertToken, insertTransaction, 
  deleteData, getTransactions, getTransaction, insertTransactionLine, getTokens,
  getTransactionTimestampsByToken, insertPrice, getTokenContractAddresses}
