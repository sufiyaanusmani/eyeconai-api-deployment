const { Anomaly, Organization, Camera } = require('../models');
const ROLES = require('../constants/roles');

const addAnomaly = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { description, criticality, modelName, cameraId } = req.body;

        // Step 1: Validate camera ownership
        const camera = await Camera.findOne({
            where: {
                cameraId,
                organizationId, // Ensure the camera belongs to the organization in the token
            },
        });

        if (!camera) {
            return res.status(403).json({
                message: 'Camera not found or does not belong to your organization',
            });
        }

        // Step 2: Create the anomaly
        const anomaly = await Anomaly.create({
            description,
            criticality,
            modelName,
            organizationId, // Add organization ID from token
            cameraId,
        });

        res.status(201).json({
            message: 'Anomaly created successfully',
            anomaly,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding anomaly' });
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