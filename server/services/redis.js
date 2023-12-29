const { ObjectId } = require('mongodb');
const redis = require('redis');

// Create and configure the Redis client with auto-reconnect
const redis_client = redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNRESET') {
            console.error('Redis connection lost, reconnecting...');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

// Connect to Redis
redis_client.connect();

// Error handling
redis_client.on('error', (err) => {
    console.error('Redis error: ', err);
});

// Function to cache users
async function cacheUsers(users) {
    const usersJson = JSON.stringify(users);
    await redis_client.set('all_users', usersJson);
}

// Function to add a new user
async function addUser(newUser) {
    const usersJson = await redis_client.get('all_users');
    let users = usersJson ? JSON.parse(usersJson) : [];
    users.push(newUser);
    await redis_client.set('all_users', JSON.stringify(users));
}

// Function to delete a user
async function deleteUser(userId) {
    const usersJson = await redis_client.get('all_users');
    let users = usersJson ? JSON.parse(usersJson) : [];
    users = users.filter(user => user._id !== userId);
    await redis_client.set('all_users', JSON.stringify(users));
}

// Function to update a user
async function updateUser(updatedUser) {
    const usersJson = await redis_client.get('all_users');
    let users = usersJson ? JSON.parse(usersJson) : [];
    users = users.map(user => user._id === updatedUser.id ? updatedUser : user);
    await redis_client.set('all_users', JSON.stringify(users));
}

// Function to save a user by ID
async function saveUserById(id, user) {
    try {
        const userJson = JSON.stringify(user);
        await redis_client.set(id, userJson);
    } catch (error) {
        throw new Error(`Error saving user to Redis: ${error.message}`);
    }
}

async function getUserById(userId) {
    const userJson = await redis_client.get(userId);
    return JSON.parse(userJson) ? JSON.parse(userJson) : null;
}

// Export the functions and Redis client
module.exports = {
    redis_client,
    cacheUsers,
    addUser,
    deleteUser,
    updateUser,
    saveUserById,
    getUserById
};
