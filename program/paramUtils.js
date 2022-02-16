const getParams = (url) => {
  const paramsList = [];
  if (!url.includes("?")) {
    return "No params detected";
  }

  const paramsString = url.split("?")[1];

  if (paramsString === "") {
    return "Invalid params";
  }

  const params = paramsString.split("&");

  if (params.length === 1 && params[0].split("=")[1] === undefined) {
    return "Invalid params";
  }

  params.forEach((param) => {
    const [paramName, paramValue] = param.split("=");
    if (paramValue !== undefined) {
      paramsList.push({ name: paramName, value: paramValue });
    }
  });

  return paramsList;
};

const transformParams = (params) =>
  params.map((param) => {
    const parsedParamValue = parseInt(param.value, 10);
    return { ...param, value: parsedParamValue };
  });

module.exports = { getParams, transformParams };
