-- Create Database
CREATE DATABASE employee_db;

-- Connect to Database
\c employee_db;

-- Create Tables
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert Sample Data
INSERT INTO department (name) VALUES 
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales');

INSERT INTO role (title, salary, department_id) VALUES
  ('Software Engineer', 120000, 1),
  ('Lead Engineer', 150000, 1),
  ('Accountant', 125000, 2),
  ('Account Manager', 160000, 2),
  ('Lawyer', 190000, 3),
  ('Legal Team Lead', 250000, 3),
  ('Salesperson', 80000, 4),
  ('Sales Lead', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 2, NULL),
  ('Mike', 'Chan', 1, 1),
  ('Ashley', 'Rodriguez', 4, NULL),
  ('Kevin', 'Tupik', 3, 3),
  ('Kunal', 'Singh', 6, NULL),
  ('Malia', 'Brown', 5, 5),
  ('Sarah', 'Lourd', 8, NULL),
  ('Tom', 'Allen', 7, 7);