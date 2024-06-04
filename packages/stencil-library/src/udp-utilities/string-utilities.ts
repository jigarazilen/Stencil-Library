export const trimStringAfter = (str, character) => {
    const lastIndex = str.lastIndexOf(character);
    return str.substring(0, lastIndex === -1 ? str.length : lastIndex);
  };

  export const removeWhiteSpace = (str) => {
    if (!str) {
      return '';
    }
    return str.replace(/\s/g, '');
  };
  
  export const camelToPascalCaseWithSpace = (str) => {
    const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizedStr.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  };
  

  
  export const toLowerFirstChar = (field) => {
    return field.charAt(0).toLowerCase() + field.slice(1);
  };
  
  export const toUpperFirstChar = (field) => {
    return field?.charAt(0)?.toUpperCase() + field?.slice(1);
  };
  
  export const toTitleCase = (str) => {
    const result = str.replace(/([A-Z][a-z]+)/g, ' $1').replace(/([A-Z]+)\b/g, ' $1').trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
  };
  
  export const pluralize = (str) => {
    const last = str.charAt(str.length - 1);
    if (last === 's') {
      return str;
    } else {
      return `${str}s`;
    }
  };
  