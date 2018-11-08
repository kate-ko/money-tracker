const Sequelize = require('sequelize');

const DB_URI = process.env.CONNECTION_STRING ||
//'mysql://sql7263384:Xk2zWnZKCL@sql7.freesqldatabase.com:3306/sql7263384';
'postgres://avzelkiv:cgAQk1A5xDIUFbp2iwrrYtY7w-Z0UtMr@tantor.db.elephantsql.com:5432/avzelkiv';
const sequelize = new Sequelize(DB_URI);

sequelize
    .authenticate()
    .then(() => { console.log('Connection has been established successfully.'); })
    .catch(err => { console.error('Unable to connect to the database:', err); });

module.exports = sequelize;
