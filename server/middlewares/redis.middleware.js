const {redis_client} = require('../services/redis');

async function getCachedUsers(req, res, next) {
    const usersJson = await redis_client.get('all_users');
    if (usersJson) {
        const users = JSON.parse(usersJson);
        res.status(200).json({
            code: 200,
            message: 'Get all users successfully',
            users
        });
    }
    else {
        next();
    }
}

async function getUserById(userId) {
    const userJson = await redis_client.get(userId);
    return JSON.parse(userJson);
}

module.exports = {
    getCachedUsers
}