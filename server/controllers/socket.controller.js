const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;
const {User} = require('../models');
const {ObjectId} = require('mongodb');
const {saveUserById, getUserById} = require('../services/redis');

const getUserByToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded) {
            await updateUserStatus(decoded.id, "online");
            const user = await findUserById(decoded.id);
            return user;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Error getting user by token: ${error.message}`);
    }
};

const findUserById = async (id) => {
    try {
        let user = await getUserById(id);
        if (user) {
            return user;
        }
        user = await User.findById(id).select('-password');
        await saveUserById(id, user);
        return user;
    } catch (error) {
        throw new Error(`Error finding user by ID: ${error.message}`);
    }
};

const updateUserStatus = async (id, status, timeWorked = 0) => {
    try {
        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: { status },
                $inc: { timeWorked },
            },
            { new: true }
        ).select("-password");
        await saveUserById(id, user);
        return user;
    } catch (error) {
        throw new Error(`Error updating user status: ${error.message}`);
    }
};

module.exports = {
    getUserByToken,
    updateUserStatus
}