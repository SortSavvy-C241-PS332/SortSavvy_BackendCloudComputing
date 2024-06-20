const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Scan = sequelize.define('Scan', {
    id_scan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    scan_time: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Scan;