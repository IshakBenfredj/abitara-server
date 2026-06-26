const PushToken = require('../models/PushToken');

exports.registerToken = async (req, res) => {
    try {
        const { token, deviceId } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        if (deviceId) {
            // Replace old token for this device (handles Expo Go → APK switch)
            await PushToken.findOneAndUpdate(
                { deviceId },
                { token, deviceId, updatedAt: new Date() },
                { upsert: true, new: true }
            );
        } else {
            // Fallback: just save if not already existing
            const existingToken = await PushToken.findOne({ token });
            if (!existingToken) {
                const newToken = new PushToken({ token });
                await newToken.save();
            }
        }

        res.status(200).json({ message: 'Token registered successfully' });
    } catch (error) {
        console.error('Error registering push token:', error);
        res.status(500).json({ message: 'Error registering token' });
    }
};
