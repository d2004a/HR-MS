const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the backend folder
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// Import and start the actual backend server
require('./backend/server.js');
