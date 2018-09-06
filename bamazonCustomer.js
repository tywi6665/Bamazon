//Request necassary node modules
var inquirer = require ("inquirer");
var mysql = require ("mysql");

//Establish connection with mySQL database
var connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

//Use mySql connection and start basic functionality
connection.connect (function (err) {
    if (err) throw err;
    start ();
});

//Call the start function to display item inventory
function start () {
    console.log ("\nScrew Christmas, Fall is the most wonderful time fo the year. Now buy some stuff!!!");
    //Query mySQL to retreive item inventory
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //For each member of the of the database console.log out unique row, which is readable to user
        res.forEach (function (product) {
            console.log ("\n" + product.product_name + " | " + " (Item ID: " + product.item_id + ")  | " + "$" + product.price);
        });
        //call the inquirer function
        userExperience ();
    });
};
    
function userExperience () {
    //Uses inquirer to prompt user
    inquirer.prompt ([
        {
            message: "\nWhat's the ID of the product that speaks to you the most?",
            type: "input",
            name: "productID",
            //Ensures user can only input a number
            validate: function (value) {
                if (isNaN (value) == false) {
                    return true;
                } else {
                    return false;
                };
            }
        },
        {
            message: "\nWhat many would you like to buy?",
            type: "input",
            name: "quantity",
            validate: function (value) {
                if (isNaN (value) == false) {
                    return true;
                } else {
                    return false;
                };
            }
        }
    ])
    .then (function (response) {
        //queries the database again, but this time specifically for item IDs
        connection.query ("SELECT * FROM products WHERE item_id = " + response.productID, function (err, res) {
            if (err) throw err;
            //Retrieve quantity and pricing info from database
            var productQuantity = res[0].stock_quantity;
            var productPrice = res[0].price;
            //If user inputs a higher quantity for an item than exists in the database:
            if (response.quantity > productQuantity) {
                console.log ("\nYou're way too needy for your own good");
                console.log ("----------------------------------------------");
                start ();
            //If desired user quantity is lower or equal to inventory amount:
            } else {
                var updatedQuantity = productQuantity - response.quantity;
                connection.query ("UPDATE products SET ? Where ?", 
                [
                    {
                        //Updates database amount
                        stock_quantity: updatedQuantity
                    },
                    {
                        item_id: response.productID
                    }
                ], function (err, res) {
                    if (err) throw err;
                    //Calcualtes total cost for user
                    var totalCost = response.quantity * productPrice;
                    console.log ("\nTime to pay up!! You owe $" + totalCost);
                    console.log ("----------------------------------------------");
                    start ();
                });
            };
        });
    });
};

