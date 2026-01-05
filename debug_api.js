
import fs from 'fs';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function verify() {
    try {
        console.log('Fetching appointments...');
        const apptRes = await axios.get(`${API_URL}/appointments`);
        fs.writeFileSync('appointments_debug.json', JSON.stringify(apptRes.data, null, 2));
        console.log('Appointments fetched.');

        console.log('Fetching queues...');
        const queueRes = await axios.get(`${API_URL}/queues`);
        fs.writeFileSync('queues_debug.json', JSON.stringify(queueRes.data, null, 2));
        console.log('Queues fetched.');

        console.log('Fetching visit records for card 1...');
        const visitRes = await axios.get(`${API_URL}/patient-visit-records/card/1`);
        fs.writeFileSync('visits_debug.json', JSON.stringify(visitRes.data, null, 2));
        console.log('Visits fetched.');

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response data:', e.response.data);
        }
    }
}

async function debugLabRequests() {
    try {
        console.log('Fetching lab requests...');
        const res = await axios.get(`${API_URL}/lab-requests`);
        fs.writeFileSync('lab_requests_debug.json', JSON.stringify(res.data, null, 2));
        console.log('Lab requests fetched. Check lab_requests_debug.json');
    } catch (e) {
        console.error('Error fetching lab requests:', e.message);
    }
}

verify();
debugLabRequests();
