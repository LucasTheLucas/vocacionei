const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  'railway',
  'root',
  'YccUFbTqaOfgiWvmXVJaNDesHNtMBWgs',
  {
    host: 'mysql-ysji.railway.internal',
    port: 3306,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
