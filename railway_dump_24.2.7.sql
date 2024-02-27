CREATE DATABASE  IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: roundhouse.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Prices`
--

DROP TABLE IF EXISTS `Prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prices` (
  `idPrice` int NOT NULL,
  `token` int NOT NULL,
  `date` date NOT NULL,
  `price` float NOT NULL,
  `currency` varchar(45) NOT NULL DEFAULT 'USD',
  PRIMARY KEY (`idPrice`,`token`),
  KEY `idToken_idx` (`token`),
  CONSTRAINT `fk_idToken_Prices` FOREIGN KEY (`token`) REFERENCES `Tokens` (`idToken`)
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prices`
--

--
-- Table structure for table `Tokens`
--

DROP TABLE IF EXISTS `Tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tokens` (
  `idToken` int NOT NULL AUTO_INCREMENT,
  `tokenName` varchar(45) NOT NULL,
  `contractAddress` varchar(42) NOT NULL,
  `blockchain` varchar(45) NOT NULL DEFAULT 'Ethereum',
  PRIMARY KEY (`idToken`),
  UNIQUE KEY `contractAddress_UNIQUE` (`contractAddress`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tokens`


--
-- Table structure for table `TransactionLines`
--

DROP TABLE IF EXISTS `TransactionLines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TransactionLines` (
  `idTransactionLine` int NOT NULL AUTO_INCREMENT,
  `transaction` int NOT NULL,
  `token` int NOT NULL,
  `amount` float NOT NULL,
  `inflow` tinyint NOT NULL,
  PRIMARY KEY (`idTransactionLine`,`token`,`transaction`),
  KEY `idToken_idx` (`token`),
  KEY `idTransaction_idx` (`transaction`),
  CONSTRAINT `fk_idToken_TransactionLines` FOREIGN KEY (`token`) REFERENCES `Tokens` (`idToken`),
  CONSTRAINT `fk_idTransaction_TransactionLines` FOREIGN KEY (`transaction`) REFERENCES `Transactions` (`idTransaction`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransactionLines`
--


--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transactions` (
  `idTransaction` int NOT NULL AUTO_INCREMENT,
  `tsxHash` varchar(66) NOT NULL,
  `date` date NOT NULL,
  `to` varchar(42) NOT NULL,
  `from` varchar(42) NOT NULL,
  `fee` float NOT NULL,
  `wallet` int NOT NULL,
  PRIMARY KEY (`idTransaction`),
  KEY `idWallet_idx` (`wallet`),
  CONSTRAINT `fk_idWallet_Transactions` FOREIGN KEY (`wallet`) REFERENCES `Wallets` (`idWallet`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4694 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`

--
-- Table structure for table `Wallets`
--

DROP TABLE IF EXISTS `Wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Wallets` (
  `idWallet` int NOT NULL AUTO_INCREMENT,
  `walletHash` varchar(42) NOT NULL,
  PRIMARY KEY (`idWallet`),
  UNIQUE KEY `walletHash_idex` (`walletHash`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wallets`
--
--
-- Table structure for table `walletBalances`
--

DROP TABLE IF EXISTS `walletBalances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `walletBalances` (
  `idwalletBalance` int NOT NULL,
  `wallet` int NOT NULL,
  `timestamp` date NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `value` float NOT NULL,
  `token` int NOT NULL,
  PRIMARY KEY (`idwalletBalance`,`token`,`wallet`),
  KEY `idWallet_idx` (`wallet`),
  KEY `idToken_idx` (`token`),
  CONSTRAINT `fk_idToken_WalletBalances` FOREIGN KEY (`token`) REFERENCES `Tokens` (`idToken`),
  CONSTRAINT `fk_idWallet_WalletBalances` FOREIGN KEY (`wallet`) REFERENCES `Wallets` (`idWallet`)
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walletBalances`
--

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-27 16:10:38

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
