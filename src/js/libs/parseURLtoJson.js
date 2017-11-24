const parseURLtoJson = (url) => {
  if (!url) return {};

  const result = {};
  const index = url.indexOf("?");

  if (index !== -1) {
    const str = url.slice(index + 1);
    const paramsArray = str.split('&');
    paramsArray.forEach(params => {
      const i = params.indexOf('=');
      result[params.slice(0, i)] = params.slice(i + 1);
    });
  }

  return result;
}

export default parseURLtoJson;