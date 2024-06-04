export const overrideFont = (element: HTMLElement, cssVariable) => {
    if(element?.shadowRoot?.lastElementChild){ // this returns null in react for some instances
        element?.shadowRoot?.lastElementChild?.setAttribute?.('style', `font-family: var(${cssVariable})`)
        return;
    }
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              (node as HTMLElement)?.setAttribute?.('style', `font-family: var(${cssVariable})`);
              observer.disconnect(); // Stop observing once the target is found
            }
          });
        }
      });
    });

    if (element?.shadowRoot) {
      observer.observe(element.shadowRoot, { childList: true });
    }
  };


export const fontOverrideMapping = {
  Arial: "--font-override-arial"
}