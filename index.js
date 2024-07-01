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

// Function to add a new department
async function addDepartment() {
  // Prompt for department name
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the department:",
    },
  ]);

  // Insert new department into database
  await client.query("INSERT INTO departments (name) VALUES ($1)", [name]);
  console.log(`Department ${name} added successfully.`);
  init();
}

// Function to add a new role
async function addRole() {
  // Fetch all departments to provide choices for the new role to go in
  const departments = await client.query("SELECT * FROM departments");
  const departmentChoices = departments.rows.map((department) => ({
    name: department.name,
    value: department.id,
  }));

  // Prompt for new role details
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the name of the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "list",
      name: "departmentId",
      message: "Select the department for the role:",
      choices: departmentChoices,
    },
  ]);

  // Insert the new role into the database
  await client.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
    [title, salary, departmentId]
  );
  console.log(`Role ${title} added successfully.`);
  init();
}

// Function to add a new employee
async function addEmployee() {
  // Fetch all roles to provide choices for the new employee's role
  const roles = await client.query("SELECT * FROM roles");
  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  // Fetch all employees to provide choices for the new employee's manager
  const employees = await client.query("SELECT * FROM employees");
  const managerChoices = employees.rows.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  managerChoices.unshift({ name: "None", value: null });

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Enter the first name of the employee:",
    },
    {
      type: "input",
      name: "lastName",
      message: "Enter the last name of the employee:",
    },
    {
      type: "list",
      name: "roleId",
      message: "Select the role for the employee:",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "managerId",
      message: "Select the manager for the employee:",
      choices: managerChoices,
    },
  ]);

  // Insert the new employee into the database
  await client.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, roleId, managerId]
  );
  console.log(`Employee ${firstName} ${lastName} added successfully.`);
  init();
}

// Function to update an employee's role
async function updateEmployeeRole() {
  // Get all employees to provide choices for the employee to update
  const employees = await client.query("SELECT * FROM employees");
  const employeeChoices = employees.rows.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

  // Get all roles to provide choices for the new role
  const roles = await client.query("SELECT * FROM roles");
  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  // Prompt to select employee and their new role
  const { employeeId, newRoleId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select the employee to update:",
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "newRoleId",
      message: "Select the new role for the employee:",
      choices: roleChoices,
    },
  ]);

  // Update the employee's role in db
  await client.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
    newRoleId,
    employeeId,
  ]);
  console.log(`Employee role updated successfully.`);
  init();
}

// Start the app
init();
