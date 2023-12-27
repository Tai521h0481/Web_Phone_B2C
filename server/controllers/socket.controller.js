const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;
const {User} = require('../models');
const {saveUserById, getUserById} = require('../services/redis');

const getUserByToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded){
            await updateUserStatus(decoded.id, "online");
            const user = await findUserById(decoded.id);
            return user;
        }
        else{
            return null;
        }
    } catch (error) {
        return error.message;
    }
}

const findUserById = async (id) => {
    try {
        let user = await getUserById(id);
        if(user){
            return user;
        }
        user = await User.findById(id).select('-password');
        await saveUserById(user);
        return user;
    } catch (error) {
        return error.message;
    }
}

const updateUserStatus = async (id, status) => {
    try {
        return await User.findByIdAndUpdate(id, {status}, {new: true}).select("-password");
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    getUserByToken,
    updateUserStatus
}