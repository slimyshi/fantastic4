import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable frontend-backend communication
app.use(json()); // Parse incoming JSON requests
app.use(express.json());

// Database Connection
connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Define Report Schema & Model
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  reportType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Automatically set timestamp
  status: { type: String, default: "Pending" } // Initial status is 'Pending'
});

const Report = mongoose.model("Report", reportSchema);

// API to Submit a Report
app.post("/api/reports", async (req, res) => {
  try {
    const { name, email, location, description, reportType } = req.body;
    const newReport = new Report({ name, email, location, description, reportType });
    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ message: "Error submitting report", error: error.message });
  }
});

// API to Retrieve Reports for Volunteers
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
});

// API to Update Report Status (For Volunteers)
app.patch("/api/reports/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: "Status updated successfully", report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error: error.message });
  }
});

// Basic Route
app.get("/", (req, res) => {
  res.send("🚀 Animal Rescue Backend is Running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});



