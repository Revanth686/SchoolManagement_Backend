import debug from "debug";
import School from "../models/school.js";
import { validatePostParams, validateGetParams } from "../utils/validator.js";
import { getDb } from "../config/db.js";

let log = debug("app:school-controller");

let schoolService;
export const initSchoolService = () => {
  schoolService = new School();
  log(`school service initialised`);
};

export const addSchool = async (req, res) => {
  try {
    const validation = validatePostParams(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const { name, address, latitude, longitude } = req.body;
    const schoolId = await schoolService.create({
      name,
      address,
      latitude,
      longitude,
    });

    log(`School added with ID: ${schoolId}`);

    //TODO: apiresp
    res.status(201).json({
      success: true,
      data: { id: schoolId, name, address, latitude, longitude },
    });
  } catch (error) {
    log("Error in adding school:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const listSchools = async (req, res) => {
  try {
    const validation = validateGetParams(req.query);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }
    const { latitude, longitude } = req.query;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schools = await schoolService.listSchools(userLat, userLon);

    res.json({
      success: true,
      data: schools,
    });
  } catch (error) {
    log("Error in getting schools:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const healthController = async (req, res) => {
  try {
    await getDb().query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "unhealthy",
      error: "Database is not connected",
      timestamp: new Date().toISOString(),
    });
  }
};
