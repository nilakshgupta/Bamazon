var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "",// password 
    database: "bamazon"
});

function startShopping(){

connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;

    console.table (res);
  // user input
    inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "Enter the ID of Product you like to order?",
      validate: function(value){
        if(isNaN(value) === false && parseInt(value) <= res.length && parseInt(value) > 0){
          return true;
        } else{
          return "Please Enter a valid ID";
        }
      }
    },
    {
      type: "input",
      name: "quantity",
      message: " How many units you want to buy?",
      validate: function(value){
        if(isNaN(value)){
          return false;
        } else{
          return true;
        }
      }
    }
    ]).then(function(answer){
      var itemIndex = (answer.id)-1;
      var quantityOrdered = parseInt(answer.quantity);
      var total = parseFloat(((res[itemIndex].price)*quantityOrdered));

      //condition to check availability of ordered item
      if(res[itemIndex].stock_quantity >= quantityOrdered){
        
        connection.query("UPDATE Products SET ? WHERE ?", [
        {stock_quantity: (res[itemIndex].stock_quantity - quantityOrdered)}, //Stock update
        {item_id: answer.id}
        ], function(err, result){
            if(err) throw err;
            console.log("\n------------------------------------------------------------------")
            console.log ("Order Summary: ");
            console.log ("Product Name: " + res[itemIndex].product_name);
            console.log ("Quantity ordered: " + quantityOrdered);
            console.log("Your total: $" + total);
            console.log("------------------------------------------------------------------\n")
            askAgain();
        });

        
      } else{
        console.log("oops! insufficient quantity!");
        askAgain();
      }
      
      
    })
})
}

//gives option to the user to buy another item
function askAgain()
{
  inquirer.prompt([{
    type: "list",
    name: "reply",
    message: "Would you like to purchase another item?",
    choices: ["Yes", "No"]
  }]).then(function(answer){
    switch(answer.reply){
      case "Yes":
       startShopping();
       break;
      case "No":
            console.log("Thanks for shopping with us!!");
            connection.end();
            break;
    }
  });
}

startShopping();