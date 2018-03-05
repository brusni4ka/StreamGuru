import Sequelize from 'sequalize';

const User = Sequelize.define('user', {
    login: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
    }
});

export default User;