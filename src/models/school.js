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
        "INSERT INTO schools (name, address, location) VALUES (?, ?, ST_GeomFromText(?))",
        [name, address, createPoint(latitude, longitude)],
      );
      return result.insertId;
    } catch (error) {
      log("Error adding school:", error);
      throw error;
    }
  }

  //get schools operation
  async listSchools(latitude, longitude, limit = 100) {
    log(`list called`);
    try {
      let query = `
        SELECT 
          id, 
          name, 
          address, 
          ST_AsText(location) as location_text,
          ST_Distance_Sphere(location, ST_GeomFromText(?)) as distance
        FROM schools
      `;

      const params = [createPoint(latitude, longitude)];

      query += " ORDER BY distance LIMIT ?";
      params.push(limit); //100 items per response

      const [rows] = await this.db.execute(query, params);

      return rows.map((row) => {
        const locationMatch = row.location_text.match(
          /POINT\(([-\d.]+) ([-\d.]+)\)/,
        );
        const [, lon, lat] = locationMatch;

        return {
          id: row.id,
          name: row.name,
          address: row.address,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          distance: row.distance, // distance in meters
        };
      });
    } catch (error) {
      log("Error fetching nearby schools:", error);
      throw error;
    }
  }
}

export default School;
