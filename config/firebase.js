const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit 
} = require("firebase/firestore");
const STATUS = require("../constants/status");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Log anomaly alert
const logAnomalyAlert = async (anomaly, detectionData) => {
  try {
    const alertsRef = collection(db, 'anomaly_alerts');
    await addDoc(alertsRef, {
      anomalyId: anomaly.anomalyId,
      organizationId: anomaly.organizationId,
      cameraId: anomaly.cameraId,
      description: anomaly.description,
      criticality: anomaly.criticality,
      detectedAt: new Date(),
      status: STATUS.NEW,
      detectionData: detectionData // Additional data from detection system
    });
    console.log('[SUCCESS] Alert logged successfully');
    return true;
  } catch (error) {
    console.error('[ERROR] Error logging alert:', error);
    return false;
  }
};

// Get alerts for organization
const getOrganizationAlerts = async (organizationId, options = {}) => {
  try {
    const alertsRef = collection(db, 'anomaly_alerts');
    const q = query(
      alertsRef,
      where('organizationId', '==', organizationId),
      orderBy('detectedAt', 'desc'),
      limit(options.limit || 100)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('[ERROR] Error fetching alerts:', error);
    return [];
  }
};

// Update alert status
const updateAlertStatus = async (alertId, status) => {
  try {
    const alertRef = doc(db, 'anomaly_alerts', alertId);
    await setDoc(alertRef, { status }, { merge: true });
    return true;
  } catch (error) {
    console.error('[ERROR] Error updating alert:', error);
    return false;
  }
};

module.exports = {
  db,
  logAnomalyAlert,
  getOrganizationAlerts,
  updateAlertStatus
};