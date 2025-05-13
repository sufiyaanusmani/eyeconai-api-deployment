const { Anomaly, Camera, NormalCondition } = require('../models');
const DAYS_OF_WEEK = require('../constants/days');
const { Op } = require('sequelize');
const cronExpressionGenerator = require('cron-expression-generator');

const addAnomaly = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const {
            title, 
            description, 
            criticality, 
            modelName, 
            cameraIds,
            startTime,
            endTime,
            daysOfWeek
        } = req.body;

        // Validate required fields
        if (!title || !description || !modelName || !cameraIds || !startTime || !endTime || !daysOfWeek) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate cameraIds is array
        if (!Array.isArray(cameraIds) || cameraIds.length === 0) {
            return res.status(400).json({ error: 'cameraIds must be a non-empty array' });
        }

        // Validate daysOfWeek is an array
        if (!Array.isArray(daysOfWeek)) {
            return res.status(400).json({ error: 'daysOfWeek must be an array' });
        }

        // Validate days values
        if (!daysOfWeek.every(day => DAYS_OF_WEEK.includes(day))) {
            return res.status(400).json({ error: 'Invalid day values' });
        }

        const cameras = await Camera.findAll({
            where: {
                cameraId: {
                    [Op.in]: cameraIds
                },
                organizationId,
            },
        });

        if (cameras.length !== cameraIds.length) {
            return res.status(404).json({ error: 'One or more cameras not found or access denied' });
        }

        // Create anomaly with all fields
        const anomaly = await Anomaly.create({
            title,
            description,
            criticality,
            modelName,
            organizationId,
            startTime,
            endTime,
            daysOfWeek
        });

        // Associate cameras
        await anomaly.setCameras(cameras);

        // Fetch complete anomaly with cameras
        const createdAnomaly = await Anomaly.findByPk(anomaly.anomalyId, {
            include: [{ model: Camera }]
        });

        return res.status(201).json(createdAnomaly);
    } catch (error) {
        console.error('Error adding anomaly:', error);
        return res.status(500).json({ error: 'Failed to add anomaly' });
    }
};

// Helper function to generate cron expression with time range
const generateCronExpression = (days, startTime, endTime) => {
    if (!days || days.length === 0) {
        // Default cron expression that runs every minute of every hour of every day
        // Format: minute hour day month day-of-week
        // "* * * * *" means "run every minute of every hour of every day of every month on every day of the week"
        return "* * * * *";
    }

    // Parse start time into hours and minutes
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    // Parse end time into hours and minutes
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Map days to cron format (0-6 where 0 is Sunday)
    const cronDays = days.map(day => {
        switch(day) {
            case 'SUN': return 0;
            case 'MON': return 1;
            case 'TUE': return 2;
            case 'WED': return 3;
            case 'THU': return 4;
            case 'FRI': return 5;
            case 'SAT': return 6;
            default: return null;
        }
    }).filter(day => day !== null);

    if (cronDays.length === 0) {
        // Default cron expression that runs every minute of every hour of every day
        return "* * * * *";
    }    // Format the times with leading zeros for consistency
    const formattedStartHour = startHour.toString().padStart(2, '0');
    const formattedStartMinute = startMinute.toString().padStart(2, '0');
    const formattedEndHour = endHour.toString().padStart(2, '0');
    const formattedEndMinute = endMinute.toString().padStart(2, '0');

    // Create a single cron expression that includes both times
    // Format: minute:start-end hour:start-end * * days
    return `${formattedStartMinute}-${formattedEndMinute} ${formattedStartHour}-${formattedEndHour} * * ${cronDays.join(',')}`;
};

const getAllAnomalies = async (req, res) => {
    const organizationId = req.user.organizationId;

    try {
        const anomalies = await Anomaly.findAll({
            where: { organizationId },
            include: [
                { 
                    model: Camera,
                    attributes: ['cameraId', 'location', 'ipAddress', 'cameraType'],
                    include: [
                        {
                            model: NormalCondition,
                            attributes: ['conditionId', 'description']
                        }
                    ]
                }
            ]
        });

        // Add cron expression to each anomaly
        const anomaliesWithCron = anomalies.map(anomaly => {
            const plainAnomaly = anomaly.get({ plain: true });
            plainAnomaly.cronExpression = generateCronExpression(
                plainAnomaly.daysOfWeek,
                plainAnomaly.startTime,
                plainAnomaly.endTime
            );
            return plainAnomaly;
        });

        res.status(200).json(anomaliesWithCron);
    } catch (error) {
        console.error('[ERROR] Fetching anomalies:', error);
        res.status(500).json({ message: 'Failed to fetch anomalies', error: error.message });
    }
};

const updateAnomaly = async (req, res) => {
    const { anomalyId } = req.params;
    const { title, description, criticality, modelName, status, cameraIds, startTime, endTime, daysOfWeek } = req.body;
    const organizationId = req.user.organizationId;

    try {
        const anomaly = await Anomaly.findOne({
            where: { anomalyId, organizationId }
        });

        if (!anomaly) {
            return res.status(404).json({ message: 'Anomaly not found or does not belong to your organization' });
        }

        // If daysOfWeek is being updated, validate the values
        if (daysOfWeek) {
            // Validate daysOfWeek is an array
            if (!Array.isArray(daysOfWeek)) {
                return res.status(400).json({ error: 'daysOfWeek must be an array' });
            }

            // Validate days values
            if (!daysOfWeek.every(day => DAYS_OF_WEEK.includes(day))) {
                return res.status(400).json({ error: 'Invalid day values' });
            }
        }

        // If cameraIds is being updated, verify camera ownership
        if (cameraIds) {
            const cameras = await Camera.findAll({
                where: {
                    cameraId: { [Op.in]: cameraIds },
                    organizationId
                }
            });

            if (cameras.length !== cameraIds.length) {
                return res.status(404).json({ message: 'One or more cameras not found or access denied' });
            }

            // Update camera associations
            await anomaly.setCameras(cameras);
        }

        // Update other fields
        anomaly.title = title ?? anomaly.title;
        anomaly.description = description ?? anomaly.description;
        anomaly.criticality = criticality ?? anomaly.criticality;
        anomaly.modelName = modelName ?? anomaly.modelName;
        anomaly.status = status ?? anomaly.status;
        anomaly.startTime = startTime ?? anomaly.startTime;
        anomaly.endTime = endTime ?? anomaly.endTime;
        anomaly.daysOfWeek = daysOfWeek ?? anomaly.daysOfWeek;

        await anomaly.save();        // Fetch updated anomaly with cameras
        const updatedAnomaly = await Anomaly.findByPk(anomalyId, {
            include: [{ model: Camera }]
        });

        res.status(200).json({
            message: 'Anomaly updated successfully',
            anomaly: updatedAnomaly
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
        const anomaly = await Anomaly.findOne({
            where: { anomalyId, organizationId }
        });

        if (!anomaly) {
            return res.status(404).json({ message: 'Anomaly not found or does not belong to your organization' });
        }

        // Remove camera associations and delete anomaly
        await anomaly.setCameras([]);
        await anomaly.destroy();

        res.status(200).json({ message: 'Anomaly deleted successfully' });
    } catch (error) {
        console.error('[ERROR] Deleting anomaly:', error);
        res.status(500).json({ message: 'Failed to delete anomaly', error: error.message });
    }
};

module.exports = { addAnomaly, getAllAnomalies, updateAnomaly, deleteAnomaly };