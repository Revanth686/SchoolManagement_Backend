// Converts latitude and longitude to a MySQL POINT
export const createPoint = (latitude, longitude) => {
  return `POINT(${longitude}, ${latitude})`;
};

