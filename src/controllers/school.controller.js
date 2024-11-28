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

//using standard haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phy1 = (lat1 * Math.PI) / 180;
  const phy2 = (lat2 * Math.PI) / 180;
  const dPhy = ((lat2 - lat1) * Math.PI) / 180;
  const dLam = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dPhy / 2) * Math.sin(dPhy / 2) +
    Math.cos(phy1) * Math.cos(phy2) * Math.sin(dLam / 2) * Math.sin(dLam / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

//controller handling add school endpoint
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
    log("Error adding school:", error);
    res.status(500).json({
      success: false,
      error: "Error adding school",
    });
  }
};

//controller handling list schools endpoint
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
    //calculating distances and sorting
    const sortedSchools = schools.map((school) => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude,
      ),
    }));
    sortedSchools.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: sortedSchools,
    });
  } catch (error) {
    log("Error in getting schools:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching schools",
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
