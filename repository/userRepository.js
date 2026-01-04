const {User} = require('../models');

class UserRepository {
    getAllUsers() {
        return User.findAll({ attributes: ['id', 'nome', 'email'] });
    }

    getUserById(id) {
        return User.findByPk(id, { attributes: ['id', 'nome', 'email'] });
    }

    create(data) {
        return User.create(data);
    }

    update(id, data) {
        return User.update(data, { where: { id } });
    }

    delete(id) {
        return User.destroy({ where: { id } });
    }
}

module.exports = new UserRepository();