const PushToken = require('../models/PushToken');

exports.registerToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Check if token already exists
        const existingToken = await PushToken.findOne({ token });
        if (!existingToken) {
            const newToken = new PushToken({ token });
            await newToken.save();
        }

        res.status(200).json({ message: 'Token registered successfully' });
    } catch (error) {
        console.error('Error registering push token:', error);
        res.status(500).json({ message: 'Error registering token' });
    }
};
