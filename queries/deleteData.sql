-- Leveraged from CS340
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Delete all data
DELETE FROM Prices;
DELETE FROM Tokens;
DELETE FROM Transactions;
DELETE FROM TransactionLines;
DELETE FROM Wallets;
DELETE FROM walletBalances;

-- Leveraged from CS340
SET FOREIGN_KEY_CHECKS=1;
COMMIT;