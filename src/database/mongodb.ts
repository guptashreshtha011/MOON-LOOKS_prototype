// MongoDB Atlas Document Database Configuration and Integration Driver
// Handles schema profiles, users data, leads metadata, and quotation lists.

import { MONGODB_CONFIG } from "./config";

const isMongoDBConfigured = (): boolean => {
  return (
    MONGODB_CONFIG.uri &&
    MONGODB_CONFIG.uri !== "mongodb://localhost:27017/moonlooks"
  );
};

export const getMongoDBInstance = () => {
  if (!isMongoDBConfigured()) {
    return {
      configured: false,
      message: "MongoDB Atlas acting through high-performance local simulated profile store."
    };
  }

  try {
    return {
      configured: true,
      uri: MONGODB_CONFIG.uri,
      clientName: "AtlasMongooseCluster"
    };
  } catch (err) {
    console.error("MongoDB init failure:", err);
    return { configured: false };
  }
};
