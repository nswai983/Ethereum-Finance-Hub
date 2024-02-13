/*

    The file contains the various sql statements used in the application.

    Source: https://www.w3schools.com/nodejs/nodejs_mysql.asp

    https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e

    https://www.freecodecamp.org/news/javascript-modules-explained-with-examples/

*/

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "cs469project.railway.internal",
  user: "root",
  port: 46480,
  password: "eFFDdBCBD1cdd6EaBd6D3H56AFC-GC1E",
  database: "railway"
});

// var con = mysql.createConnection(`mysql://root:eFFDdBCBD1cdd6EaBd6D3H56AFC-GC1E@:3306/railway`);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


function getWalletBalance(err, wallet) {
  if (err) throw err;

  sql = "SELECT SUM(value) FROM walletBalances WHERE wallet = " + wallet;

  console.log("Connected!");
};

/*
  QUERY: GET BALANCE FOR ALL WALLETS

  SELECT SUM(value)
  FROM walletBalances
  WHERE timestamp = TODAY()

*/

/*
  QUERY: GET BALANCE FOR A WALLET

  SELECT SUM(value)
  FROM walletBalances
  INNER JOIN Wallets ON walletBalances.wallet = Wallets.idWallet
  WHERE timestamp = TODAY()
        AND Wallets.idWallet = [given_wallet_var]

*/

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
module.exports = mysql;