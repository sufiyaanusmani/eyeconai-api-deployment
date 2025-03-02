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

module.exports = {
    getAllOrganizations
};