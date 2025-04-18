// currentUser.js
let currentId = null;

export const setCurrentId = (id) => {
  currentId = id;
};

export const getCurrentId = () => {
  return currentId;
};
