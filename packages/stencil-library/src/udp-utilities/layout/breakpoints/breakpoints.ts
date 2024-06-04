// Helper function to get the value of a CSS variable from the :root
function getCssVariableValue(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

export const breakpoints = {
  xs: `(max-width: ${getCssVariableValue('--breakpoint-xs-max')}px)`,
  sm: `(min-width: ${getCssVariableValue('--breakpoint-sm-min')}px) and (max-width: ${getCssVariableValue('--breakpoint-sm-max')}px)`,
  md: `(min-width: ${getCssVariableValue('--breakpoint-md-min')}px) and (max-width: ${getCssVariableValue('--breakpoint-md-max')}px)`,
  lg: `(min-width: ${getCssVariableValue('--breakpoint-lg-min')}px) and (max-width: ${getCssVariableValue('--breakpoint-lg-max')}px)`,
  xl: `(min-width: ${getCssVariableValue('--breakpoint-xl-min')}px)`,
};




// export const breakpoints = {
//     xs: '(max-width: 599px)',
//     sm: '(min-width: 600px) and (max-width: 959px)',
//     md: '(min-width: 960px) and (max-width: 1279px)',
//     lg: '(min-width: 1280px) and (max-width: 1919px)',
//     xl: '(min-width: 1920px)',
//   };
  