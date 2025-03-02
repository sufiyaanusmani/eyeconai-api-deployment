const { Organization, User, Camera } = require('../models');
const ROLES = require('../constants/roles');

// Get all organizations
const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll({
            attributes: ['orgId', 'name', 'maxCameras', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['userId', 'name', 'email'],
                    where: {
                        roleId: 2 // Assuming roleId 2 is for organization admin
                    },
                    required: false  // Make it a LEFT JOIN
                }
            ]
        });

        // Calculate camera usage
        const orgsWithStats = await Promise.all(organizations.map(async (org) => {
            const cameraCount = await Camera.count({ 
                where: { organizationId: org.orgId } 
            });
            
            return {
                id: org.orgId,
                name: org.name,
                maxCameras: org.maxCameras,
                cameraCount: cameraCount,
                usagePercentage: Math.round((cameraCount / org.maxCameras) * 100),
                createdAt: org.createdAt,
                admins: org.Users ? org.Users.map(user => ({
                    id: user.userId,
                    name: user.name,
                    email: user.email
                })) : []
            };
        }));

        return res.status(200).json({
            count: orgsWithStats.length,
            organizations: orgsWithStats
        });
    } catch (error) {
        console.error('[ERROR] Error fetching organizations:', error);
        return res.status(500).json({ message: 'Error fetching organizations' });
    }
};

// Get organization by ID
const getOrganizationById = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);
        
        const organization = await Organization.findByPk(organizationId, {
            attributes: ['orgId', 'name', 'maxCameras', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['userId', 'name', 'email'],
                    where: {
                        roleId: 2
                    },
                    required: false
                }
            ]
        });
        
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        // Get camera count
        const cameraCount = await Camera.count({ 
            where: { organizationId: organization.orgId } 
        });
        
        const result = {
            id: organization.orgId,
            name: organization.name,
            maxCameras: organization.maxCameras,
            cameraCount: cameraCount,
            usagePercentage: Math.round((cameraCount / organization.maxCameras) * 100),
            createdAt: organization.createdAt,
            admins: organization.Users ? organization.Users.map(user => ({
                id: user.userId,
                name: user.name,
                email: user.email
            })) : []
        };
        
        return res.status(200).json(result);
    } catch (error) {
        console.error('[ERROR] Error fetching organization:', error);
        return res.status(500).json({ message: 'Error fetching organization' });
    }
};

// Update maxCameras for an organization
const updateMaxCameras = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.orgId, 10);
        const { maxCameras } = req.body;
        
        // Validate maxCameras
        if (!maxCameras || maxCameras < 1) {
            return res.status(400).json({ message: 'Invalid maxCameras value. Must be a positive integer.' });
        }
        
        const organization = await Organization.findByPk(organizationId);
        
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        // Get current camera count to validate against new max
        const cameraCount = await Camera.count({ where: { organizationId } });
        
        if (maxCameras < cameraCount) {
            return res.status(400).json({ 
                message: `Cannot set maxCameras lower than current camera count (${cameraCount})`,
                currentCount: cameraCount
            });
        }
        
        // Update maxCameras
        organization.maxCameras = maxCameras;
        await organization.save();
        
        return res.status(200).json({
            message: 'Max cameras updated successfully',
            organization: {
                id: organization.orgId,
                name: organization.name,
                maxCameras: organization.maxCameras,
                cameraCount: cameraCount,
                usagePercentage: Math.round((cameraCount / organization.maxCameras) * 100)
            }
        });
    } catch (error) {
        console.error('[ERROR] Error updating max cameras:', error);
        return res.status(500).json({ message: 'Error updating max cameras' });
    }
};

module.exports = {
    getAllOrganizations,
    getOrganizationById,
    updateMaxCameras
};