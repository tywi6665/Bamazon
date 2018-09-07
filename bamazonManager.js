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

function start () {
    inquirer.prompt ([
        {
            type: "list",
            message: "\nAs a manager, you most have so many things to do. Where would you like to start first?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "choice"
        }
    ])
    .then (function (response) {
        switch (response.choice) {
            case "View Products for Sale":
                view ();
                break;
            case "View Low Inventory":
                low ();
                break;
            case "Add to Inventory":
                add ();
                break;
            case "Add New Product":
                addNew ();
                break;
        }
    });
};

//Views all items in the inventory
function view () {
    //Query mySQL to retreive item inventory
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //For each member of the of the database console.log out unique row, which is readable to user
        res.forEach (function (product) {
            console.log ("\n" + product.product_name + " | " + " (Item ID: " + product.item_id + ")  | " + "Quantity: " + product.stock_quantity + " | " + "$" + product.price + " | " + product.department_name);
            console.log ("----------------------------------------------");
        });
        //Return to the start function
        start ();
    });
};

//Views all items in inventory with quantities less than 5
function low () {
    //Query mySQL to retreive item inventory
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //For each member of the of the database console.log out unique row, which is readable to user
        res.forEach (function (product) {
            if (product.stock_quantity < 5) {
            console.log ("\n" + product.product_name + " | " + " (Item ID: " + product.item_id + ")  | " + "Quantity: " + product.stock_quantity + " | " + "$" + product.price + " | " + product.department_name);
            console.log ("----------------------------------------------");
            }
        });
        //Return to the start function
        start ();
    });
};

//Adds more stock to existing products
function add () {
    //Query mySQL to retreive item inventory
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Create array of existing products
        var productArr = [];
        //Push each product from SQL into array
        for (var i = 0; i < res.length; i++) {
            productArr.push(res[i].product_name);
        };
        //Prompt manager which product they would like to add stock to
        inquirer.prompt ([
            {
                type: "list",
                message: "Which product would you like to add more of?",
                choices: productArr,
                name: "product"
            }, 
            {
                type: "input",
                message: "Don't go crazy, but how much?",
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
            //Create variable to take on value of current stock quantity in database
            var currentQuantity;
            for (var j = 0; j < res.length; j++) {
                if (res[j].product_name === response.product) {
                    currentQuantity = res[j].stock_quantity;
                };
            };
            //Updates database quantity with user added quantity
            connection.query ("UPDATE products SET ? WHERE ?", [
                {stock_quantity: currentQuantity + parseInt (response.quantity)},
                {product_name: response.product}
                ], function (err, res) {
                    if (err) throw err;
                    console.log ("\nThe quantity was updated");
                    console.log ("----------------------------------------------");
                    start ();
                }
            );
        });
    });    
};

//Adds brands new product to inventory
function addNew () {
    //Query mySQL to retreive item inventory
    connection.query ("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Prompts user with new product and associated details
        inquirer.prompt ([
            {
                type: "input",
                message: "What's the new product?",
                name: "product",
                validate: function (value) {
                    if (value) {
                        return true;
                    } else {
                        return false;
                    };
                }
            },
            {
                type: "input",
                message: "In which department does this product belong?",
                name: "department",
                validate: function (value) {
                    if (value) {
                        return true;
                    } else {
                        return false;
                    };
                }
            },
            {
                type: "input",
                message: "What's the price?",
                name: "price",
                validate: function (value) {
                    if (isNaN (value) == false) {
                        return true;
                    } else {
                        return false;
                    };
                }
            },
            {
                type: "input",
                message: "How many are there?",
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
            //Creates new row in database from user generated info
            connection.query ("INSERT INTO products SET ?", {
                product_name: response.product,
                department_name: response.department,
                price: response.price,
                stock_quantity: response.quantity
            }, function (err, res) {
                if (err) throw err;
                console.log ("\nThe shipment has been received, and the shelves have been stocked!")
                console.log ("----------------------------------------------");
                start ();
            })
        });
    });
};