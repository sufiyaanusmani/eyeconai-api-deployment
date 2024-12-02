const Status = require('../../constants/status');
const Criticality = require('../../constants/criticality');
const DAYS_OF_WEEK = require('../../constants/days');

const anomalies = [
    {
        title: "Student in Server Room",
        description: "Students in server room detection",
        criticality: Criticality.CATASTROPHIC,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [1]
    },
    {
        title: "After-hours Loitering",
        description: "After-hours loitering in hallways",
        criticality: Criticality.CRITICAL,
        startTime: "18:00:00",
        endTime: "06:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [2]
    },
    {
        title: "Unauthorized Entry",
        description: "Unauthorized entry through emergency exits",
        criticality: Criticality.CRITICAL,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: JSON.stringify(DAYS_OF_WEEK),
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [3]
    },
    {
        title: "Crowd Gathering",
        description: "Crowd gathering in cafeteria outside lunch hours",
        criticality: Criticality.MODERATE,
        startTime: "00:00:00",
        endTime: "10:30:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [4]
    },
    {
        title: "Suspicious Behavior",
        description: "Suspicious behavior near lockers",
        criticality: Criticality.CRITICAL,
        startTime: "08:00:00",
        endTime: "16:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [5]
    },
    {
        title: "Vehicle Detection",
        description: "Vehicle detection in student-only areas",
        criticality: Criticality.MODERATE,
        startTime: "07:00:00",
        endTime: "17:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [6]
    },
    {
        title: "After-hours Access",
        description: "Library after-hours access detection",
        criticality: Criticality.MODERATE,
        startTime: "18:00:00",
        endTime: "07:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [7]
    },
    {
        title: "Weekend Gymnasium Access",
        description: "Gymnasium unauthorized weekend access",
        criticality: Criticality.MODERATE,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: [DAYS_OF_WEEK[6], DAYS_OF_WEEK[0]],
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [8]
    },
    {
        title: "Laboratory Safety Protocol Violation",
        description: "Laboratory safety protocol violation",
        criticality: Criticality.CATASTROPHIC,
        startTime: "08:00:00",
        endTime: "16:00:00",
        daysOfWeek: [DAYS_OF_WEEK[1], DAYS_OF_WEEK[2], DAYS_OF_WEEK[3], DAYS_OF_WEEK[4], DAYS_OF_WEEK[5]],
        modelName: "VLM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [9]
    },
    {
        title: "Main Entrance Tailgating",
        description: "Main entrance tailgating detection",
        criticality: Criticality.CATASTROPHIC,
        startTime: "00:00:00",
        endTime: "23:59:59",
        daysOfWeek: DAYS_OF_WEEK,
        modelName: "ConvLSTM",
        status: Status.ON,
        organizationId: 1,
        cameraIds: [10]
    }
];

module.exports = anomalies;
