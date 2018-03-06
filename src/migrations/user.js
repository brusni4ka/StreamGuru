module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable("users", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV1
            },
            login: {
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        /*
    Add altering commands here.
    Return a promise to correctly handle asynchronicity.

    Example:
    return queryInterface.createTable('users', { id: Sequelize.INTEGER });
  */
    },
    down(queryInterface) {
        return queryInterface.dropTable("users")
        /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.dropTable('users');
   */
    }
}