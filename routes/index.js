let express = require("express");
let router = express.Router();


router.get("/", function(req, res) {

    // Render index page
    res.render('index');

});

router.post("/summary", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('summary');

});

router.post("/wallets", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('wallets');

});

router.post("/transactions", function(req, res) {

    // Collect wallet data

    // Check wallet data; throw error if issues found

    // Request wallet balance data from Etherscan API

    // Get pricing data from CrypoCompare API

    // Display summary page with relevant data
    
    // Render summary page
    res.render('transactions');

});

module.exports = router;