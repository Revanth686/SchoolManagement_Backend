export const validatePostParams = (data) => {
  const errors = [];
  const { name, address, latitude, longitude } = data;
  if (!name || name.trim().length === 0) {
    errors.push({ field: "name", message: "school name required" });
  }
  if (!address || address.trim().length === 0) {
    errors.push({ field: "address", message: "address is required" });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push({
      field: "latitude",
      message: "Invalid latitude (must be between -90 and 90)",
    });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push({
      field: "longitude",
      message: "Invalid longitude (must be between -180 and 180)",
    });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateGetParams = (params) => {
  const errors = [];
  const { latitude, longitude } = params;
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push({
      field: "latitude",
      message: "Invalid latitude (must be between -90 and 90)",
    });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push({
      field: "longitude",
      message: "Invalid longitude (must be between -180 and 180)",
    });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

