const inquirer = require("inquirer");
const client = require("./db/dbConnection");

// Initialize application and display menu
async function init() {
  // Menu choices
  const choices = [
    "View All Departments",
    "View All Roles",
    "View All Employees",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee Role",
    "Exit",
  ];

  // Prompt user to select an action from menu
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices,
    },
  ]);

  // Execute the corresponding function based on user choice
  switch (action) {
    case "View All Departments":
      return viewAllDepartments();
    case "View All Roles":
      return viewAllRoles();
    case "View All Employees":
      return viewAllEmployees();
    case "Add Department":
      return addDepartment();
    case "Add Role":
      return addRole();
    case "Add Employee":
      return addEmployee();
    case "Update Employee Role":
      return updateEmployeeRole();
    case "Exit":
      // End the database connection and exit application
      client.end();
      process.exit();
  }
}

// Start the app
init();
