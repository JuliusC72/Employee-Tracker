# Employee Tracker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Employee Tracker is a command line application that allows business owners to view and manage departments, roles, and employees in their company.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Credits](#credits)
- [Tests](#tests)
- [Questions](#questions)

## Installation

1. Clone the repository to your local machine
2. Make sure you have Node.js and PostgreSQL installed
3. Create a `.env` file in the root directory with your PostgreSQL credentials:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=employee_db
   DB_PASSWORD=your_password_here
   DB_PORT=5432
   ```
4. Set up the database:
   ```
   psql -U postgres -f schema.sql
   ```
5. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Use the arrow keys to navigate the menu and select an option
3. Follow the prompts to view, add, or update information


## License

This project is licensed under the MIT License - see [MIT](https://opensource.org/licenses/MIT) for details.

## Credits

Julius Chi, CoPilot, Claude AI, Stack Overflow

## Tests

```
N/A
```

## Questions

For questions or concerns, please contact me:

GitHub: [JuliusC72](https://github.com/JuliusC72)

Email: [72jules@gmail.com](mailto:72jules@gmail.com)
