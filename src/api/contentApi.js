import api from "./api";

export const getAboutUs = async () => {
  return await api.get("/aboutUs/getAboutUs");
};

export const getTerms = async () => {
  return await api.get("/terms/getTerms");
};
