export const filterReqObj = (reqObj, ...details) => {
  const newObj = {};
  Object.keys(reqObj).forEach((key) => {
    if (details.includes(key)) newObj[key] = reqObj[key];
  });
  return newObj;
};
