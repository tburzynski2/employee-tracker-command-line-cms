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

// Function to view all departments
async function viewAllDepartments() {
  const res = await client.query("SELECT * FROM departments");
  console.table(res.rows);
  init();
}

// Function to view all roles
async function viewAllRoles() {
  const res = await client.query(`
      SELECT roles.id, roles.title, roles.salary, departments.name AS department 
      FROM roles 
      JOIN departments ON roles.department_id = departments.id`);
  console.table(res.rows);
  init();
}

// Function to view all employees
async function viewAllEmployees() {
  const res = await client.query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, managers.first_name || ' ' || managers.last_name AS manager
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees managers ON employees.manager_id = managers.id`);
  console.table(res.rows);
  init();
}

// Start the app
init();
