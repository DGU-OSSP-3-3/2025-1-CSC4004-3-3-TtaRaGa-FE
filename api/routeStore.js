let savedRoute = null;

export const setSavedRoute = (data) => {
  savedRoute = data;
};

export const getSavedRoute = () => {
  return savedRoute;
};