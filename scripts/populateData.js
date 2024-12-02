const { sequelize, Organization, Camera, Anomaly, Role, User } = require('../models');
const { hashPassword } = require('../utils/authUtils');
const organizationAdmins = require('./data/organization_admin');
const cameras = require('./data/camera');
const anomalies = require('./data/anomaly');
const organizations = require('./data/organization');
const roles = require('./data/role');

async function populateData() {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('[SUCCESS] Database cleared');

        // Insert roles
        const createdRoles = await Role.bulkCreate(roles, { transaction });
        console.log(`[SUCCESS] Created ${createdRoles.length} roles`);

        // Insert organizations
        const createdOrgs = await Organization.bulkCreate(organizations, { transaction });
        console.log(`[SUCCESS] Created ${createdOrgs.length} organizations`);

        // Hash passwords before creating admins
        const adminsWithHashedPasswords = await Promise.all(
            organizationAdmins.map(async (admin) => ({
                ...admin,
                password: await hashPassword(admin.password)
            }))
        );

        // Insert organization admins
        const createdAdmins = await User.bulkCreate(adminsWithHashedPasswords, { transaction });
        console.log(`[SUCCESS] Created ${createdAdmins.length} organization admins`);

        // Insert cameras
        const createdCameras = await Camera.bulkCreate(cameras, { transaction });
        console.log(`[SUCCESS] Created ${createdCameras.length} cameras`);

        // Insert anomalies
        const createdAnomalies = await Anomaly.bulkCreate(anomalies, { transaction });
        console.log(`[SUCCESS] Created ${createdAnomalies.length} anomalies`);

        // Create anomaly-camera associations
        for (const anomaly of anomalies) {
            const createdAnomaly = createdAnomalies.find(a => 
                a.description === anomaly.description && 
                a.organizationId === anomaly.organizationId
            );
            
            // If cameraIds is array, associate with multiple cameras
            const camerasToAssociate = createdCameras.filter(camera => 
                Array.isArray(anomaly.cameraIds) ? 
                anomaly.cameraIds.includes(camera.cameraId) : 
                camera.cameraId === anomaly.cameraId
            );

            await createdAnomaly.setCameras(camerasToAssociate, { transaction });
        }
        console.log('[SUCCESS] Created anomaly-camera associations');

        await transaction.commit();
        console.log('[SUCCESS] Data population completed successfully');
        process.exit(0);
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('[ERROR] Error populating data:', error);
        process.exit(1);
    }
}

// Execute the population script
populateData().catch(console.error);
