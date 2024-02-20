/*

    The file contains the various sql statements used in the application.

    Source: https://www.w3schools.com/nodejs/nodejs_mysql.asp

    https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e

    https://www.freecodecamp.org/news/javascript-modules-explained-with-examples/

    Use of mysql2 package vs mysql came from an authentication issue with mysql package. Issue resolved via this article:
    https://github.com/strapi/strapi/issues/13774

*/

const { query } = require("express");


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



async function insertTransaction(tsxHash, date, to, from, fee, wallet) {

  return new Promise((resolve) => {

    // Check if Transaction exists, if not create one

    let query = "INSERT INTO Transactions VALUES ('" + tsxHash + "', '" + date + "', '" + to + "', '" + from + "', '" + fee + "', '" + wallet + "');"


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
module.exports = {getWalletBalance, getWalletsBalance, addWallets, addWallet, getWallets, insertTransaction}
