import api from "./api";

// Fetch Content
export const getAboutUs = async () => {
  return await api.get("/content/about");
};

export const getTerms = async () => {
  return await api.get("/content/terms");
};

// Update Content
export const updateAboutUs = async (content) => {
  return await api.patch("/content/about", { aboutUs: content });
};

export const updateTerms = async (content) => {
  return await api.patch("/content/terms", { terms: content });
};
