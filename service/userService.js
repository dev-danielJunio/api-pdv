const userRepository = require('../repository/userRepository');
const ApppError = require('../errors/AppError');
const ErrorCodes = require('../errors/ErrorCodes');

class UserService {

    async getAllUsers() {
        return userRepository.getAllUsers();
    }

    async getUserById(id) {
        const user = await userRepository.getUserById(id);
        if (!user) {
        throw new AppError(ErrorCodes.USER_NOT_FOUND);
        }
        return user;
    }

    async createUser(data) {
        return userRepository.create(data);
    }

    async updateUser(id, data) {
        const user = await this.getUserById(id);
        await userRepository.update(id, data);
        return this.getUserById(id);
    }

    async deleteUser(id) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new AppError(ErrorCodes.USER_NOT_FOUND);
        }
        await userRepository.delete(id);
    }
}

module.exports = new UserService();

