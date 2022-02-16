const getParams = (url) => {
  const paramsObject = {};
  if (!url.includes("?")) {
    return "No params detected";
  }

  const paramsString = url.split("?")[1];

  if (paramsString === "") {
    return "Invalid params";
  }
  const params = paramsString.split("&");

  params.forEach((param) => {
    const [paramName, paramValue] = param.split("=");
    if (paramValue !== undefined) {
      paramsObject[paramName] = paramValue;
    }
  });

  return paramsObject;
};

module.exports = getParams;
