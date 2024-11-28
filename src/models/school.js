//file to handle CRUD operations on database
import debug from "debug";
import { getDb } from "../config/db.js";
import { createPoint } from "../utils/geospatial.js";
const log = debug("app:school-model");

class School {
  constructor() {
    this.db = getDb();
    log(`school service initialised`);
  }
  //create school operation
  async create({ name, address, latitude, longitude }) {
    try {
      const [result] = await this.db.execute(
        "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
        [name, address, latitude, longitude], //to prevent SQL injections
      );
      return result.insertId;
    } catch (error) {
      log("Error adding school:", error);
      throw error;
    }
  }

  //get schools operation
  async listSchools(latitude, longitude, limit = 100) {
    try {
      const [rows] = await this.db.execute(
        "SELECT id, name, address, latitude, longitude FROM schools",
        [],
      );

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
      }));
    } catch (error) {
      log("Error fetching nearby schools:", error);
      throw error;
    }
  }
}

export default School;
