const { user } = require("./../models")

exports.createUser = (userData) =>
    user.findOrCreate({ where: { login: userData.login }, defaults: userData })
        .spread((userObj, created) =>
            created ? userObj.get({ plain: true }) : created
        )


exports.findUser = (userData) =>
    user.findOne({
        where: { login: userData.login }
    })
