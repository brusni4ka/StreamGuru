import User from './models/user.js';

const createUser = (userData) => {
    User.create(userData);
}

const findUser = () => {
    User.findOne({
        where: {login: 'aProject'},
        attributes: ['id', ['name', 'title']]
    }).then(project => {
        // project will be the first entry of the Projects table with the title 'aProject' || null
        // project.title will contain the name of the project
    })
}