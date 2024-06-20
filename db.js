const { Sequelize } = require('sequelize');

// Ubah 'localhost' atau '127.0.0.1' menjadi 'host.docker.internal'
const sequelize = new Sequelize('profile_db', 'root', 'userss', {
    host: '34.128.106.109',
    dialect: 'mysql',
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected...');
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

module.exports = { connectDB, sequelize };