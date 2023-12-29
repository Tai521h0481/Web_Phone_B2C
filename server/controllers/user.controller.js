const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const {User} = require('../models');
const {cacheUsers,addUser,deleteUser,updateUser, saveUserById } = require('../services/redis');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find({role: "salesperson"}).select('-password');
            await cacheUsers(users);
            res.status(200).json({
                code: 200,
                message: 'Get all users successfully',
                users
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async createUser(req, res) {
        const { email, fullname } = req.body;
        try {
            const username = email.split('@')[0];
            const password = username;
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, fullname, username, password: hashPassword });
            user.password = undefined;
            await addUser(user);
            res.status(200).json({
                code: 200,
                message: 'Create user successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                // message: 'Internal server error'
                message: error.message
            });
        }
    },
    async toggleLock (req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select('-password');
            user.isLocked = !user.isLocked;
            await user.save();
            res.status(200).json({
                code: 200,
                message: 'Toggle lock user successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async getUserById (req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).select('-password');
            res.status(200).json({
                code: 200,
                message: 'Get user successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async updateUser (req, res) {
        try {
            const { id } = req.params;
            let { fullname } = req.body;
            const user = await User.findByIdAndUpdate(id, { fullname }, { new: true }).select('-password');
            await saveUserById(user);
            res.status(200).json({
                code: 200,
                message: 'Update user successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async login (req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if(!user) {
                return res.status(404).json({
                    code: 400,
                    message: 'Invalid username or password'
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({
                    code: 400,
                    message: 'Invalid username or password'
                });
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            res.status(200).json({
                code: 200,
                message: 'Login successfully',
                token
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async getProfile (req, res) {
        try {
            const { id } = req.user;
            const user = await User.findById(id).select('-password');
            res.status(200).json({
                code: 200,
                message: 'Get profile successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async changePassword (req, res) {
        try {
            const id = req.user.id;
            const {oldPassword, newPassword} = req.body;
            const user = await User.findById(id);
            console.log(user);
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if(!isMatch) {
                return res.status(400).json({
                    code: 400,
                    message: 'Invalid password'
                });
            }
            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
            await user.save();
            user.password = undefined;
            res.status(200).json({
                code: 200,
                message: 'Change password successfully',
                user
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
    async getTop6UsersByTimeWorked (req, res) {
        try {
            const users = await User.find({role: "salesperson"}).sort({ timeWorked: -1 }).limit(6).select('-password'); 
            res.status(200).json({
                code: 200,
                message: 'Get top 6 users by time worked successfully',
                users
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        }
    },
}