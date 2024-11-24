const { Camera, Organization } = require('../models');
const ROLES = require('../constants/roles');
const STATUS = require('../constants/status');

const addCamera = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);
        const { location, ipAddress, cameraType } = req.body;

        // Check if the organization exists and the user is authorized
        const organization = await Organization.findByPk(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Ensure the current user is the Organization Admin for the organization
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== organizationId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Create the new camera
        const newCamera = await Camera.create({
            location,
            ipAddress,
            cameraType,
            organizationId,
        });

        return res.status(201).json({
            message: 'Camera added successfully!',
            camera: newCamera,
        });
    } catch (error) {
        console.error(error);
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
        });

        return res.status(200).json({ cameras });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching cameras' });
    }
};


// Update a camera
const updateCamera = async (req, res) => {
    try {
        const { cameraId } = req.params;
        const { location, ipAddress, cameraType } = req.body;

        // Find the camera
        const camera = await Camera.findByPk(cameraId);
        if (!camera) {
            return res.status(404).json({ message: 'Camera not found' });
        }

        // Ensure the current user is the Organization Admin for the camera's organization
        if (req.user.role !== ROLES.ORGANIZATION_ADMIN || req.user.organizationId !== camera.organizationId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update the camera details
        camera.location = location || camera.location;
        camera.ipAddress = ipAddress || camera.ipAddress;
        camera.cameraType = cameraType || camera.cameraType;

        await camera.save();

        return res.status(200).json({ message: 'Camera updated successfully!', camera });
    } catch (error) {
        console.error(error);
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


module.exports = { addCamera, getAllCameras, updateCamera, deleteCamera, getOnlineCameras };