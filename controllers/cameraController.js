const { Camera, Organization } = require('../models');
const ROLES = require('../constants/roles');
const STATUS = require('../constants/status');
const { Anomaly, NormalCondition } = require('../models');
const Criticality = require('../constants/criticality');
const groqService = require('../services/GroqService');
const { sequelize } = require("../models");


const addCamera = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        
        const organizationId = parseInt(req.params.orgId, 10);
        const { location, ipAddress, cameraType, cameraDescription } = req.body;

        // Check if the organization exists and the user is authorized
        const organization = await Organization.findByPk(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Ensure the current user is the Organization Admin for the organization
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== organizationId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if camera limit is reached
        const cameraCount = await Camera.count({ where: { organizationId } });
        if (cameraCount >= organization.maxCameras) {
            await transaction.rollback();
            return res.status(403).json({ 
                message: 'Camera limit reached for this organization',
                currentCount: cameraCount,
                maxCameras: organization.maxCameras
            });
        }

        // Create the new camera
        const newCamera = await Camera.create({
            location,
            ipAddress,
            cameraType,
            organizationId,
            cameraDescription
        }, { transaction });

        // Extract normal conditions using Groq if description is provided
        if (cameraDescription) {
            try {
                const normalConditions = await groqService.extractNormalConditions(cameraDescription);
                
                // Create normal conditions for the camera
                for (const condition of normalConditions) {
                    await NormalCondition.create({
                        ...condition,
                        cameraId: newCamera.cameraId
                    }, { transaction });
                }
            } catch (groqError) {
                console.error('[ERROR] Failed to extract normal conditions:', groqError);
                // Continue without normal conditions if extraction fails
            }
        }

        await transaction.commit();

        // Fetch camera with its normal conditions
        const cameraWithConditions = await Camera.findByPk(newCamera.cameraId, {
            include: [{ model: NormalCondition }]
        });

        return res.status(201).json({
            message: 'Camera added successfully!',
            camera: cameraWithConditions,
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('[ERROR] Error adding camera:', error);
        return res.status(500).json({ message: 'Error adding camera' });
    }
};


// Get all cameras for the organization
const getAllCameras = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Ensure the current user is the Organization Admin for the organization
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const cameras = await Camera.findAll({
            where: { organizationId },
            include: [{
                model: NormalCondition,
                attributes: ['conditionId', 'description']
            }]
        });

        return res.status(200).json({ cameras });
    } catch (error) {
        console.error('[ERROR] Error fetching cameras:', error);
        return res.status(500).json({ message: 'Error fetching cameras' });
    }
};


// Update a camera
const updateCamera = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        
        const { cameraId } = req.params;
        const { location, ipAddress, cameraType, cameraDescription, normalConditions } = req.body;

        // Find the camera with its current normal conditions
        const camera = await Camera.findByPk(cameraId, {
            include: [{ model: NormalCondition }]
        });

        if (!camera) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== camera.organizationId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the camera details
        camera.location = location || camera.location;
        camera.ipAddress = ipAddress || camera.ipAddress;
        camera.cameraType = cameraType || camera.cameraType;
        camera.cameraDescription = cameraDescription || camera.cameraDescription;

        await camera.save({ transaction });

        // If normal conditions are provided, update their descriptions
        if (normalConditions && Array.isArray(normalConditions)) {
            for (const condition of normalConditions) {
                if (condition.conditionId) {
                    await NormalCondition.update(
                        { description: condition.description },
                        { 
                            where: { 
                                conditionId: condition.conditionId,
                                cameraId: camera.cameraId 
                            },
                            transaction 
                        }
                    );
                }
            }
        }

        await transaction.commit();

        // Fetch updated camera with normal conditions
        const updatedCamera = await Camera.findByPk(cameraId, {
            include: [{ model: NormalCondition }]
        });

        return res.status(200).json({
            message: 'Camera updated successfully!',
            camera: updatedCamera
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('[ERROR] Error updating camera:', error);
        return res.status(500).json({ message: 'Error updating camera' });
    }
};


// Delete a camera
const deleteCamera = async (req, res) => {
    try {
        const { cameraId } = req.params;

        // Find the camera
        const camera = await Camera.findByPk(cameraId);
        if (!camera) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        // Ensure the current user is the Organization Admin for the camera's organization
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== camera.organizationId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the camera
        await camera.destroy();

        return res.status(200).json({ message: 'Camera deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting camera' });
    }
};


// Get online cameras for the organization
const getOnlineCameras = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Fetch only online cameras
        const cameras = await Camera.findAll({
            where: { 
                organizationId,
                status: STATUS.ONLINE
            },
        });

        return res.status(200).json({ cameras });
    } catch (error) {
        console.error('[ERROR] Error fetching online cameras:', error);
        return res.status(500).json({ message: 'Error fetching online cameras' });
    }
};

const getCameraAnomalyStats = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Get all cameras with their anomalies
        const cameras = await Camera.findAll({
            where: { organizationId },
            attributes: ['cameraId', 'location', 'cameraType', 'status'],
            include: [{
                model: Anomaly,
                attributes: ['anomalyId', 'criticality']
            }]
        });

        // Calculate stats for each camera
        const stats = cameras.map(camera => {
            const anomalyStats = {
                total: camera.Anomalies.length,
                moderate: camera.Anomalies.filter(a => a.criticality === Criticality.MODERATE).length,
                critical: camera.Anomalies.filter(a => a.criticality === Criticality.CRITICAL).length,
                catastrophic: camera.Anomalies.filter(a => a.criticality === Criticality.CATASTROPHIC).length
            };

            return {
                cameraId: camera.cameraId,
                location: camera.location,
                cameraType: camera.cameraType,
                status: camera.status,
                anomalyStats
            };
        });

        res.status(200).json({ stats });
    } catch (error) {
        console.error('[ERROR] Error fetching camera anomaly stats:', error);
        res.status(500).json({ message: 'Error fetching camera anomaly statistics' });
    }
};


// Get all camera ids, normal conditions, and anomalies for a given organization
const getComprehensiveCameraData = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Fetch cameras with both normal conditions and anomalies
        const cameras = await Camera.findAll({
            where: { organizationId },
            attributes: ['cameraId'],
            include: [
                {
                    model: NormalCondition,
                    attributes: ['description']
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
            normalConditions: camera.NormalConditions,
            anomalies: camera.Anomalies
        }));

        return res.status(200).json({
            count: cameras.length,
            cameras: formattedCameras
        });
    } catch (error) {
        console.error('[ERROR] Error fetching camera details:', error);
        return res.status(500).json({ message: 'Error fetching camera details' });
    }
};


// Get all normal conditions across cameras for an organization
const getOrganizationNormalConditions = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Get all cameras with their normal conditions
        const cameras = await Camera.findAll({
            where: { organizationId },
            attributes: ['cameraId', 'location', 'ipAddress', 'cameraType', 'status'],
            include: [{
                model: NormalCondition,
                attributes: ['conditionId', 'description']
            }]
        });

        // Transform data for easier frontend consumption
        const result = cameras.map(camera => ({
            cameraId: camera.cameraId,
            location: camera.location,
            ipAddress: camera.ipAddress,
            cameraType: camera.cameraType,
            status: camera.status,
            normalConditions: camera.NormalConditions.map(condition => ({
                conditionId: condition.conditionId,
                description: condition.description
            }))
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('[ERROR] Error fetching normal conditions:', error);
        return res.status(500).json({ message: 'Error fetching normal conditions' });
    }
};

// Get all cameras with their assigned anomalies
const getCamerasWithAnomalies = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);

        // Authorization check
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== parseInt(organizationId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Fetch cameras with anomalies and include relevant details
        const cameras = await Camera.findAll({
            where: { organizationId },
            attributes: ['cameraId', 'location', 'ipAddress', 'cameraType', 'status', 'cameraDescription'],
            include: [{
                model: Anomaly,
                attributes: [
                    'anomalyId', 
                    'title', 
                    'description', 
                    'criticality', 
                    'startTime',
                    'endTime',
                    'daysOfWeek',
                    'modelName',
                    'status'
                ],
                through: { attributes: [] } // Exclude junction table attributes
            }]
        });

        // Format the response
        const formattedCameras = cameras.map(camera => {
            // Group anomalies by criticality
            const criticalityGroups = {
                [Criticality.MODERATE]: [],
                [Criticality.CRITICAL]: [],
                [Criticality.CATASTROPHIC]: []
            };
            
            camera.Anomalies.forEach(anomaly => {
                criticalityGroups[anomaly.criticality].push({
                    anomalyId: anomaly.anomalyId,
                    title: anomaly.title,
                    description: anomaly.description,
                    timeRange: `${anomaly.startTime} - ${anomaly.endTime}`,
                    daysOfWeek: anomaly.daysOfWeek,
                    modelName: anomaly.modelName,
                    status: anomaly.status
                });
            });

            return {
                cameraId: camera.cameraId,
                location: camera.location,
                ipAddress: camera.ipAddress,
                cameraType: camera.cameraType,
                status: camera.status,
                description: camera.cameraDescription,
                anomalies: camera.Anomalies
            };
        });
        
        return res.status(200).json(formattedCameras);
    } catch (error) {
        console.error('[ERROR] Error fetching cameras with anomalies:', error);
        return res.status(500).json({ message: 'Error fetching cameras with anomalies' });
    }
};

// Add to module exports
module.exports = { 
    addCamera, 
    getAllCameras, 
    updateCamera, 
    deleteCamera, 
    getOnlineCameras, 
    getCameraAnomalyStats, 
    getComprehensiveCameraData,
    getOrganizationNormalConditions,
    getCamerasWithAnomalies,
};