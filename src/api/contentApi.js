import api from "./api";

export const getAboutUs = async () => {
  return await api.get("/content/about");
};

export const getTerms = async () => {
  return await api.get("/content/terms");
};
