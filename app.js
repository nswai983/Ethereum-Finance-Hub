/*
    This app.js file is based on a medium article describing how to build a simple web application. 

    source: https://medium.com/@guraycintir/simple-web-application-with-node-js-and-express-70f702b08498

    html web pages were developed using W3Schools HTML tutorials:

    source: https://www.w3schools.com/html/html_form_elements.asp

    HTML web pages were rendered using 

    source: https://expressjs.com/en/guide/using-template-engines.html

*/

let express = require("express");
let index = require("./routes/index");
// let indexPage = "./views/index.pug";

let app = express();

app.set('view engine', 'pug');

let port = 27612

app.use("/", index);

app.listen(port, function () {

    console.log("Ethereum Finance Hub running on port " + port + "!");

});