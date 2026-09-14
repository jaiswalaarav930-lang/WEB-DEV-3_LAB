// app.js

const express = require("express");

const logger = require("./middleware/logger");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = 3000;


// Middleware
app.use(express.json());

app.use(logger);


// Routes
app.use("/students", studentRoutes);


// Home route
app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Student Management REST API is running"
    });

});


// Invalid route
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// Start server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});