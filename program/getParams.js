const getParams = (url) => {
  const paramsObject = {};
  if (!url.includes("?")) {
    return "No params detected";
  }
  const paramsString = url.split("?")[1];
  const params = paramsString.split("&");

  params.forEach((param) => {
    const [paramName, paramValue] = param.split("=");
    paramsObject[paramName] = paramValue;
  });

  return paramsObject;
};

module.exports = getParams;
