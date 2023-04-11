const User = require('../../models/UserModel');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ id });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { email, password, name, birthday, address, phone, gender, role, image } = req.body;

    try {
        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name, birthday, address, phone, gender, role, image });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = bcrypt.hash(req.body.password, 10);
        if (req.body.name) user.price = req.body.name;
        if (req.body.birthday) user.price = req.body.birthday;
        if (req.body.address) user.price = req.body.address;
        if (req.body.gender) user.price = req.body.gender;
        if (req.body.role) user.price = req.body.role;
        if (req.body.image) user.price = req.body.image;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};