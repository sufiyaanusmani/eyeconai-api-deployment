const { Anomaly, Camera } = require('../models');
const DAYS_OF_WEEK = require('../constants/days');

const addAnomaly = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { 
            description, 
            criticality, 
            modelName, 
            cameraId,
            startTime,
            endTime,
            daysOfWeek
        } = req.body;

        // Validate required fields
        if (!description || !modelName || !cameraId || !startTime || !endTime || !daysOfWeek) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate daysOfWeek is an array
        if (!Array.isArray(daysOfWeek)) {
            return res.status(400).json({ error: 'daysOfWeek must be an array' });
        }

        // Validate days values
        if (!daysOfWeek.every(day => DAYS_OF_WEEK.includes(day))) {
            return res.status(400).json({ error: 'Invalid day values' });
        }

        // Step 1: Validate camera ownership
        const camera = await Camera.findOne({
            where: {
                cameraId,
                organizationId,
            },
        });

        if (!camera) {
            return res.status(404).json({ error: 'Camera not found or access denied' });
        }

        // Create anomaly with all fields
        const anomaly = await Anomaly.create({
            description,
            criticality,
            modelName,
            cameraId,
            organizationId,
            startTime,
            endTime,
            daysOfWeek
        });

        return res.status(201).json(anomaly);
    } catch (error) {
        console.error('Error adding anomaly:', error);
        return res.status(500).json({ error: 'Failed to add anomaly' });
    }
};

const getAllAnomalies = async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
        const anomalies = await Anomaly.findAll({
            where: { organizationId },
            include: [
                { model: Camera, attributes: ['location', 'ipAddress', 'cameraType'] },
            ],
        });

        res.status(200).json(anomalies);
    } catch (error) {
        console.error('[ERROR] Fetching anomalies:', error);
        res.status(500).json({ message: 'Failed to fetch anomalies', error: error.message });
    }
};


const updateAnomaly = async (req, res) => {
    const { anomalyId } = req.params;
    const { description, criticality, modelName, status, cameraId } = req.body;
    const organizationId = req.user.organizationId;

    try {
        // Ensure the anomaly exists and belongs to the user's organization
        const anomaly = await Anomaly.findOne({
            where: {
                anomalyId,
                organizationId,
            },
        });

        if (!anomaly) {
            return res.status(404).json({ message: 'Anomaly not found or does not belong to your organization' });
        }

        // If cameraId is being updated, verify its association
        if (cameraId) {
            const camera = await Camera.findOne({
                where: {
                    cameraId,
                    organizationId,
                },
            });

            if (!camera) {
                return res.status(404).json({ message: 'Camera not found or does not belong to your organization' });
            }
        }

        // Update the anomaly
        anomaly.description = description ?? anomaly.description;
        anomaly.criticality = criticality ?? anomaly.criticality;
        anomaly.modelName = modelName ?? anomaly.modelName;
        anomaly.status = status ?? anomaly.status;
        anomaly.cameraId = cameraId ?? anomaly.cameraId;

        await anomaly.save();

        res.status(200).json({
            message: 'Anomaly updated successfully',
            anomaly,
        });
    } catch (error) {
        console.error('[ERROR] Updating anomaly:', error);
        res.status(500).json({ message: 'Failed to update anomaly', error: error.message });
    }
};


const deleteAnomaly = async (req, res) => {
    const { anomalyId } = req.params;
    const organizationId = req.user.organizationId;

    try {
        // Ensure the anomaly exists and belongs to the user's organization
        const anomaly = await Anomaly.findOne({
            where: {
                anomalyId,
                organizationId,
            },
        });

        if (!anomaly) {
            return res.status(404).json({ message: 'Anomaly not found or does not belong to your organization' });
        }

        await anomaly.destroy();

        res.status(200).json({ message: 'Anomaly deleted successfully' });
    } catch (error) {
        console.error('[ERROR] Deleting anomaly:', error);
        res.status(500).json({ message: 'Failed to delete anomaly', error: error.message });
    }
};

module.exports = { addAnomaly, getAllAnomalies, updateAnomaly, deleteAnomaly };