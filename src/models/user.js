module.exports = function (sequelize, DataTypes) {
    return sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV1
        },
        login: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate () {
                // associations can be defined here
            }
        }
    })
}

