const inquirer = require('inquirer');
const { Pool } = require('pg');
const Table = require('console.table');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'employee_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Connect to the database
pool.connect().then(() => {
  console.log('Connected to PostgreSQL database');
  init();
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Initialize application
function init() {
  console.log("\n=================================");
  console.log("   EMPLOYEE TRACKER   ");
  console.log("=================================\n");
  mainMenu();
}

// Main menu
async function mainMenu() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role',
          'Exit'
        ]
      }
    ]);

    switch (action) {
      case 'View All Departments':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add Department':
        await addDepartment();
        break;
      case 'Add Role':
        await addRole();
        break;
      case 'Add Employee':
        await addEmployee();
        break;
      case 'Update Employee Role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        pool.end();
        process.exit(0);
    }
  } catch (err) {
    console.error('Error with main menu:', err);
    mainMenu();
  }
}

// View all departments
async function viewAllDepartments() {
  try {
    const { rows } = await pool.query(
      'SELECT id, name FROM department ORDER BY id'
    );
    console.log("\n");
    console.table(rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing departments:', err);
    mainMenu();
  }
}

// View all roles
async function viewAllRoles() {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.title, d.name AS department, r.salary 
       FROM role r
       JOIN department d ON r.department_id = d.id
       ORDER BY r.id`
    );
    console.log("\n");
    console.table(rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing roles:', err);
    mainMenu();
  }
}

// View all employees
async function viewAllEmployees() {
  try {
    const { rows } = await pool.query(
      `SELECT e.id, e.first_name, e.last_name, 
              r.title, d.name AS department, r.salary,
              CONCAT(m.first_name, ' ', m.last_name) AS manager
       FROM employee e
       LEFT JOIN role r ON e.role_id = r.id
       LEFT JOIN department d ON r.department_id = d.id
       LEFT JOIN employee m ON e.manager_id = m.id
       ORDER BY e.id`
    );
    console.log("\n");
    console.table(rows);
    mainMenu();
  } catch (err) {
    console.error('Error viewing employees:', err);
    mainMenu();
  }
}

// Add department
async function addDepartment() {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
        validate: input => input ? true : 'Department name cannot be empty'
      }
    ]);

    await pool.query(
      'INSERT INTO department (name) VALUES ($1)',
      [departmentName]
    );
    
    console.log(`\nAdded ${departmentName} to departments\n`);
    mainMenu();
  } catch (err) {
    console.error('Error adding department:', err);
    mainMenu();
  }
}

// Add role
async function addRole() {
  try {
    // Get departments for choices
    const { rows: departments } = await pool.query('SELECT * FROM department');
    
    if (departments.length === 0) {
      console.log('\nYou need to add a department first\n');
      return mainMenu();
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?',
        validate: input => input ? true : 'Role title cannot be empty'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?',
        validate: input => {
          const salary = parseFloat(input);
          return !isNaN(salary) && salary > 0 ? true : 'Please enter a valid salary'
        }
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does this role belong to?',
        choices: departments.map(dept => ({
          name: dept.name,
          value: dept.id
        }))
      }
    ]);

    await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [answers.title, answers.salary, answers.departmentId]
    );
    
    console.log(`\nAdded role ${answers.title} with salary ${answers.salary}\n`);
    mainMenu();
  } catch (err) {
    console.error('Error adding role:', err);
    mainMenu();
  }
}

// Add employee
async function addEmployee() {
  try {
    // Get roles for choices
    const { rows: roles } = await pool.query('SELECT * FROM role');
    
    if (roles.length === 0) {
      console.log('\nYou need to add a role first\n');
      return mainMenu();
    }

    // Get employees for manager choices
    const { rows: employees } = await pool.query('SELECT * FROM employee');
    
    const managerChoices = [
      { name: 'None', value: null },
      ...employees.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }))
    ];

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: input => input ? true : 'First name cannot be empty'
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: input => input ? true : 'Last name cannot be empty'
      },
      {
        type: 'list',
        name: 'roleId',
        message: "What is the employee's role?",
        choices: roles.map(role => ({
          name: role.title,
          value: role.id
        }))
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Who is the employee's manager?",
        choices: managerChoices
      }
    ]);

    await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [answers.firstName, answers.lastName, answers.roleId, answers.managerId]
    );
    
    console.log(`\nAdded employee ${answers.firstName} ${answers.lastName}\n`);
    mainMenu();
  } catch (err) {
    console.error('Error adding employee:', err);
    mainMenu();
  }
}

// Update employee role
async function updateEmployeeRole() {
  try {
    // Get employees
    const { rows: employees } = await pool.query('SELECT * FROM employee');
    
    if (employees.length === 0) {
      console.log('\nNo employees found to update\n');
      return mainMenu();
    }

    // Get roles
    const { rows: roles } = await pool.query('SELECT * FROM role');
    
    if (roles.length === 0) {
      console.log('\nNo roles found to assign\n');
      return mainMenu();
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee\'s role do you want to update?',
        choices: employees.map(emp => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id
        }))
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is the new role?',
        choices: roles.map(role => ({
          name: role.title,
          value: role.id
        }))
      }
    ]);

    await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2',
      [answers.roleId, answers.employeeId]
    );
    
    console.log('\nEmployee role updated successfully\n');
    mainMenu();
  } catch (err) {
    console.error('Error updating employee role:', err);
    mainMenu();
  }
}