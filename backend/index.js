const exp = require('express');
const app = exp();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Selecting port
const port = process.env.PORT || 5000;
const Mongodb_Url = process.env.MONGO_URL;  // Use correct environment variable

// Enable CORS for frontend domain
app.use(cors({
    origin: "https://bus-booking-app-2-8eq4.onrender.com/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware for JSON requests
app.use(exp.json());

// Importing API Apps
const userApp = require('./API/userApi');
const driverApp = require('./API/driverApi');
const operatorApp = require('./API/operatorApi');
const adminApp = require('./API/adminApi');

// Serving frontend static files
app.use(exp.static(path.join(__dirname, '../client/dist')));

// Selecting API routes
app.use('/user', userApp);
app.use('/driver', driverApp);
app.use('/operator', operatorApp);
app.use('/admin', adminApp);

// Handle preflight requests
app.options("*", cors());

// Connecting to the database
mongoose.connect(Mongodb_Url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ DB connection success');

        // Start the server
        app.listen(port, () => {
            console.log(`🚀 Server running on PORT ${port}`);
        });
    })
    .catch(err => {
        console.error('❌ DB Connection Error:', err);
    });

// Handle all other requests (Frontend routing)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).send({ message: "Error occurred", problem: err.message });
});
