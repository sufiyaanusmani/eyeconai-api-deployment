const Status = require('../../constants/status');
const Criticality = require('../../constants/criticality');
const DAYS_OF_WEEK = require('../../constants/days');

const anomalies = [
    {
        description: "Students in server room detection",
        criticality: Criticality.CATASTROPHIC,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 1
    },
    {
        description: "After-hours loitering in hallways",
        criticality: Criticality.CRITICAL,
        startTime: "18:00:00",
        endTime: "06:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 2
    },
    {
        description: "Unauthorized entry through emergency exits",
        criticality: Criticality.CRITICAL,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: JSON.stringify(DAYS_OF_WEEK),
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 3
    },
    {
        description: "Crowd gathering in cafeteria outside lunch hours",
        criticality: Criticality.MODERATE,
        startTime: "00:00:00",
        endTime: "10:30:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 4
    },
    {
        description: "Suspicious behavior near lockers",
        criticality: Criticality.CRITICAL,
        startTime: "08:00:00",
        endTime: "16:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 5
    },
    {
        description: "Vehicle detection in student-only areas",
        criticality: Criticality.MODERATE,
        startTime: "07:00:00",
        endTime: "17:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 6
    },
    {
        description: "Library after-hours access detection",
        criticality: Criticality.MODERATE,
        startTime: "18:00:00",
        endTime: "07:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 7
    },
    {
        description: "Gymnasium unauthorized weekend access",
        criticality: Criticality.MODERATE,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: [DAYS_OF_WEEK[6], DAYS_OF_WEEK[0]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 8
    },
    {
        description: "Laboratory safety protocol violation",
        criticality: Criticality.CATASTROPHIC,
        startTime: "08:00:00",
        endTime: "16:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 9
    },
    {
        description: "Main entrance tailgating detection",
        criticality: Criticality.CATASTROPHIC,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: DAYS_OF_WEEK,
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraId: 10
    }
];

module.exports = anomalies;
