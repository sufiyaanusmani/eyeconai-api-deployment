const { getOrganizationAlerts, updateAlertStatus, logAnomalyAlert } = require('../config/firebase');

const getAnomalyAlerts = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { limit = 100 } = req.query;
        
        const alerts = await getOrganizationAlerts(organizationId, { limit });
        res.json(alerts);
    } catch (error) {
        console.error('[ERROR] Failed to fetch anomaly alerts:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

const createAnomalyAlert = async (req, res) => {
    try {
        const { anomaly, detectionData } = req.body;
        
        if (!anomaly || !detectionData) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        anomaly.organizationId = req.user.organizationId;
        const success = await logAnomalyAlert(anomaly, detectionData);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to log anomaly alert' });
        }

        res.status(201).json({ message: 'Anomaly alert logged successfully' });
    } catch (error) {
        console.error('[ERROR] Failed to create anomaly alert:', error);
        res.status(500).json({ error: 'Failed to create alert' });
    }
};

const updateAnomalyAlert = async (req, res) => {
    try {
        const { alertId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const updated = await updateAlertStatus(alertId, status);
        if (!updated) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        res.json({ message: 'Alert updated successfully' });
    } catch (error) {
        console.error('[ERROR] Failed to update alert:', error);
        res.status(500).json({ error: 'Failed to update alert' });
    }
};

module.exports = {
    getAnomalyAlerts,
    createAnomalyAlert,
    updateAnomalyAlert
};
