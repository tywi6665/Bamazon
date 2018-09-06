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

connection.connect (function (err) {
    if (err) throw err;
    start ();
});

function start () {
    console.log ("\nScrew Christmas, Fall is the most wonderful time fo the year. Now buy some stuff!!!");
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
       
        res.forEach (function (product) {
            console.log ("\n" + product.product_name + " | " + " (Item ID: " + product.item_id + ")  | " + "$" + product.price);
        });

        userExperience ();
    });
};
    
function userExperience () {
    inquirer.prompt ([
        {
            message: "\nWhat's the ID of the product that speaks to you the most?",
            type: "input",
            name: "productID",
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
        connection.query ("SELECT * FROM products WHERE item_id = " + response.productID, function (err, res) {
            if (err) throw err;
            var productQuantity = res[0].stock_quantity;
            var productPrice = res[0].price;
            if (response.quantity > productQuantity) {
                console.log ("\nYou're way too needy for your own good");
                start ();
            } else {
                var updatedQuantity = productQuantity - response.quantity;
                connection.query ("UPDATE products SET ? Where ?", 
                [
                    {
                        stock_quantity: updatedQuantity
                    },
                    {
                        item_id: response.productID
                    }
                ], function (err, res) {
                    if (err) throw err;
                    var totalCost = response.quantity * productPrice;
                    console.log ("\nTime to pay up!! You owe $" + totalCost);
                    console.log ("----------------------------------------------");
                    start ();
                });
            };
        });
    });
};

