const { Anomaly, Camera, Organization, NormalCondition } = require('../models');

/**
 * Get all anomalies across all organizations
 * This endpoint is publicly accessible without authentication
 */
const getAllAnomalies = async (req, res) => {
    try {
        // Fetch all anomalies with their related cameras and organization information
        const anomalies = await Anomaly.findAll({
            include: [
                { 
                    model: Camera,
                    attributes: ['cameraId', 'location', 'ipAddress', 'cameraType', 'status']
                },
                {
                    model: Organization,
                    attributes: ['orgId', 'name']
                }
            ]
        });

        // Return formatted response
        res.status(200).json({
            count: anomalies.length,
            anomalies: anomalies.map(anomaly => ({
                anomalyId: anomaly.anomalyId,
                title: anomaly.title,
                description: anomaly.description,
                criticality: anomaly.criticality,
                startTime: anomaly.startTime,
                endTime: anomaly.endTime,
                daysOfWeek: anomaly.daysOfWeek,
                modelName: anomaly.modelName,
                status: anomaly.status,
                createdAt: anomaly.createdAt,
                updatedAt: anomaly.updatedAt,
                organization: anomaly.Organization ? {
                    id: anomaly.Organization.orgId,
                    name: anomaly.Organization.name
                } : null,
                cameras: anomaly.Cameras ? anomaly.Cameras.map(camera => ({
                    cameraId: camera.cameraId,
                    location: camera.location,
                    ipAddress: camera.ipAddress,
                    cameraType: camera.cameraType,
                    status: camera.status
                })) : []
            }))
        });
    } catch (error) {
        console.error('[ERROR] Fetching all anomalies:', error);
        res.status(500).json({ 
            message: 'Failed to fetch anomalies', 
            error: error.message 
        });    }
};

/**
 * Get comprehensive camera data for all organizations
 * This endpoint is publicly accessible without authentication
 */
const getAllComprehensiveCameraData = async (req, res) => {
    try {
        // Fetch all cameras with both normal conditions and anomalies across all organizations
        const cameras = await Camera.findAll({
            attributes: ['cameraId', 'organizationId'],
            include: [
                {
                    model: Organization,
                    attributes: ['orgId', 'name']
                },
                {
                    model: NormalCondition,
                    attributes: ['conditionId', 'description']
                },
                {
                    model: Anomaly,
                    attributes: ['anomalyId', 'description', 'criticality'],
                    through: { attributes: [] } // Exclude junction table attributes
                }
            ]
        });

        // Format response
        const formattedCameras = cameras.map(camera => ({
            cameraId: camera.cameraId,
            location: camera.location,
            ipAddress: camera.ipAddress,
            cameraType: camera.cameraType,
            status: camera.status,
            organization: {
                id: camera.Organization.orgId,
                name: camera.Organization.name
            },
            normalConditions: camera.NormalConditions,
            anomalies: camera.Anomalies
        }));

        return res.status(200).json({
            count: cameras.length,
            cameras: formattedCameras
        });
    } catch (error) {
        console.error('[ERROR] Error fetching comprehensive camera data:', error);
        return res.status(500).json({ message: 'Error fetching comprehensive camera data' });
    }
};

module.exports = {
    getAllAnomalies,
    getAllComprehensiveCameraData
};
