// app.js
const express = require('express');
const { Firestore } = require('@google-cloud/firestore');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Initialize Firestore
const firestore = new Firestore();

const corsOptions = {
  origin: 'https://flagspace.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/submit', async (req, res) => {
    const { name, email, company, role, interest, challenge, wishlist, companySize, betaTesting } = req.body;

    // Check if name and email are provided
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        // Save the form data to Firestore
        const docRef = firestore.collection('submissions').doc(); // Auto-generate ID
        await docRef.set({
            name,
            email,
            company: company || "",
            role: role || "",
            interest: interest || "",
            challenge: challenge || "",
            wishlist: wishlist || "",
            companySize: companySize || "Individual",
            betaTesting: betaTesting || false,
            submittedAt: new Date().toISOString(),
        });
        res.status(200).json({ message: 'Submission saved successfully!' });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ message: 'Failed to save submission.' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('App is running.');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
