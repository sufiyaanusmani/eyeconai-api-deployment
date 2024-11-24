const { getOrganizationAlerts, updateAlertStatus, logAnomalyAlert } = require('../config/firebase');
const { db } = require('../config/firebase');
const { collection, query, where, getDocs } = require('firebase/firestore');
const DAYS_OF_WEEK = require('../constants/days');
const Criticality = require('../constants/criticality');


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

const getAnomaliesStats = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        
        // Get all anomaly alerts from Firestore
        const alertsRef = collection(db, 'anomaly_alerts');
        const q = query(
            alertsRef,
            where('organizationId', '==', organizationId)
        );
        
        const querySnapshot = await getDocs(q);
        const alerts = querySnapshot.docs.map(doc => doc.data());

        // Group alerts by date
        const stats = alerts.reduce((acc, alert) => {
            const date = alert.detectedAt.toDate().toISOString().split('T')[0];
            
            if (!acc[date]) {
                acc[date] = {
                    [Criticality.MODERATE]: 0,
                    [Criticality.CRITICAL]: 0,
                    [Criticality.CATASTROPHIC]: 0,
                    total: 0
                };
            }
            
            acc[date][alert.criticality]++;
            acc[date].total++;
            
            return acc;
        }, {});

        // Convert to array format for easier consumption
        const formattedStats = Object.entries(stats).map(([date, counts]) => ({
            date,
            ...counts
        }));

        res.json({ stats: formattedStats });
    } catch (error) {
        console.error('[ERROR] Failed to fetch anomaly stats:', error);
        res.status(500).json({ error: 'Failed to fetch anomaly statistics' });
    }
};

module.exports = {
    getAnomalyAlerts,
    createAnomalyAlert,
    updateAnomalyAlert,
    getAnomaliesStats,
};
