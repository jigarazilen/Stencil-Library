import { ICellRenderer } from 'ag-grid-community';
import { SharedContext } from './sharedContext';
import { state } from '../../../../../store/catalog-store';

export default class HotListAddRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private otherCellValue: any;
  private callbackId: string;
  private viewActionElement: HTMLButtonElement;
  private thirdActionElement: HTMLButtonElement;

  public init(params: any): void {
    this.eGui = document.createElement('div');
    this.otherCellValue = params.data;
    this.callbackId = params.colDef.cellRendererParams.callbackId;

    this.viewActionElement = document.createElement('button');
    this.viewActionElement.textContent = '⋯';
    this.viewActionElement.addEventListener('click', this.onViewActionClick.bind(this));
    

    this.thirdActionElement = document.createElement('button');
    this.thirdActionElement.textContent = 'Third Action'; // Example text
    this.thirdActionElement.addEventListener('click', this.onThirdActionClick.bind(this));

    // Update display based on hotListActive
    this.updateDisplay(params);

    // Append second action button if enabled
    if (params.colDef.cellRendererParams.showViewAction) {
      this.eGui.appendChild(this.viewActionElement);
    }

    this.eGui.addEventListener('click', () => {
        if (SharedContext.hotListAddHandler && params.colDef.cellRendererParams.showThirdAction) {
           SharedContext.hotListAddHandler(this.otherCellValue, this.callbackId);
        } else if (typeof SharedContext.myClickCallback === 'function') {
          SharedContext.myClickCallback(this.otherCellValue, this.callbackId);
      } else {
          const customEvent = new CustomEvent('cellClick', {
              detail: { cellValue: this.otherCellValue, callbackId: this.callbackId },
              bubbles: true,
              composed: true
          });
          this.eGui.dispatchEvent(customEvent);
      }
  });
  
  

    this.applyStyles(params);
  }

  private onViewActionClick(event: MouseEvent): void {
    event.stopPropagation();

    if (typeof SharedContext.viewActionCallback === 'function') {
      SharedContext.viewActionCallback(this.otherCellValue, this.callbackId);
    } else {
      const customEvent = new CustomEvent('viewActionClick', {
        detail: { cellValue: this.otherCellValue, callbackId: this.callbackId },
        bubbles: true,
        composed: true
      });
      this.eGui.dispatchEvent(customEvent);
    }
  }

  private onThirdActionClick(event: MouseEvent): void {
    event.stopPropagation();

    if (typeof SharedContext.thirdActionCallback === 'function') {
      SharedContext.thirdActionCallback(this.otherCellValue, this.callbackId);
    } else {
      const customEvent = new CustomEvent('thirdActionClick', {
        detail: { cellValue: this.otherCellValue, callbackId: this.callbackId },
        bubbles: true,
        composed: true
      });
      this.eGui.dispatchEvent(customEvent);
    }
  }

  // private updateDisplay(params: any): void {
  //   console.log(params);
  //   const hotListActive = state.hotListActive || '';

  //   if (params.colDef.cellRendererParams.showThirdAction) {
  //     const symbol = hotListActive !== '' ? '-' : '+';
  //     const color = hotListActive !== '' ? '#dfd3ff' : '#f0f0f0';
  //     this.eGui.innerHTML = `✱ <span style="padding-left: 5px; color: blue;">${symbol}</span>`;
  //     this.eGui.style.backgroundColor = color;
  //     this.eGui.title = 'Hotlist';
  //     this.thirdActionElement.disabled = !params.colDef.cellRendererParams.showThirdAction;
  //   }
  // }

//   private updateDisplay(params: any): void {
//     console.log(params);
//     const hotListActive = state.hotListActive || '';


//     // This assumes that you're managing the visibility and interaction of both the symbol and the third action button
//     if (params.colDef.cellRendererParams.showThirdAction) {
//         // Update symbol container if necessary
//         const symbol = hotListActive !== '' ? '-' : '+';
//         const color = hotListActive !== '' ? 'green' : 'pink';
//         this.eGui.innerHTML = `✱ <span style="padding-left: 5px; color: grey;">${symbol}</span>`;
        
//         this.eGui.style.backgroundColor = color;
//         this.eGui.title = 'Hotlist';

//         // Ensure third action element is ready for interaction
//         this.thirdActionElement.style.display = '';  // Ensure button is visible
//         this.thirdActionElement.disabled = false;    // Ensure button is interactive
//         this.thirdActionElement.style.display = 'none';  // Hide the button
//         this.thirdActionElement.disabled = true;         // Disable the button

//         // Optionally clear any innerHTML manipulation if it affects interaction
//         this.eGui.innerHTML = '';
//     } else {
//         // Hide and disable third action element when not needed
//         this.thirdActionElement.style.display = 'none';  // Hide the button
//         this.thirdActionElement.disabled = true;         // Disable the button

//         // Optionally clear any innerHTML manipulation if it affects interaction
//         this.eGui.innerHTML = '';  // Remove other interactive elements or symbols
//         this.eGui.appendChild(this.viewActionElement);  // Make sure to re-append view action element to maintain it in the DOM
//     }

//     // Ensure view action element is always interactive regardless of other conditions
//     this.viewActionElement.style.display = '';
//     this.viewActionElement.disabled = false;
// }

private updateDisplay(params: any): void {
  console.log(params);
  const hotListActive = state.hotListActive || '';

 

  // Conditionally add or remove the styled span based on `showThirdAction`
  if (params.colDef.cellRendererParams.showThirdAction) {
     // Determine the background color and symbol based on `hotListActive`
  const color = hotListActive !== '' ? 'rgb(224, 224, 224);' : 'rgb(201, 239, 224)';
  const symbol = hotListActive !== '' ? '-' : '+';

  // Set the title and background color of the entire GUI element
  this.eGui.title = 'Hotlist';
  this.eGui.style.backgroundColor = color;
      const specialContent = `✱ <span style="padding-left: 5px; color: grey;">${symbol}</span>`;
      // Try to access the existing special content element if it exists
      let existingSpan = this.eGui.querySelector('span');
      if (existingSpan) {
          existingSpan.innerHTML = specialContent;
      } else {
          // If it doesn't exist, use insertAdjacentHTML to add without overwriting
          this.eGui.insertAdjacentHTML('afterbegin', specialContent);
      }
  } else {
      // If `showThirdAction` is false, remove the span if it exists
      let existingSpan = this.eGui.querySelector('span');
      if (existingSpan) {
          existingSpan.remove(); // Remove the styled span
      }
  }

  // Control visibility and interaction of the third action button
  this.thirdActionElement.style.display = params.colDef.cellRendererParams.showThirdAction ? '' : 'none';
  this.thirdActionElement.disabled = !params.colDef.cellRendererParams.showThirdAction;

  // Ensure the view action element is maintained and always interactive
  if (!this.eGui.contains(this.viewActionElement)) {
      this.eGui.appendChild(this.viewActionElement);
  }
  this.viewActionElement.style.display = '';
  this.viewActionElement.disabled = false;
}

 

  private applyStyles(params): void {
   
    this.eGui.style.borderRadius = '50px';
    this.eGui.style.paddingLeft = '8px';
    this.eGui.style.paddingRight = '8px';
    this.eGui.style.textAlign = 'center';
    this.eGui.style.margin = '2px 0';
    this.eGui.style.lineHeight = '26px';
    this.eGui.style.cursor = params.colDef.cellRendererParams.showThirdAction && 'pointer';
    this.eGui.style.width = '30px';

    // Additional styles for viewActionElement
    this.viewActionElement.style.backgroundColor = 'rgb(224, 224, 224)'; // light grey background
    this.viewActionElement.style.color = '#000'; // text color
    this.viewActionElement.style.border = 'none';
    this.viewActionElement.style.borderRadius = '15px'; // rounded corners
    this.viewActionElement.style.padding = '5px 10px'; // padding inside the button
    this.viewActionElement.style.margin = '2px';
    this.viewActionElement.style.cursor = 'pointer';
    this.viewActionElement.style.fontSize = '14px'; // font size
    this.viewActionElement.style.marginLeft = params.colDef.cellRendererParams.showThirdAction ? '16px' : '0px';
    this.viewActionElement.style.transform = params.colDef.cellRendererParams.showThirdAction ? 'none' : 'translateX(-10px)';
    this.viewActionElement.title = 'View More';
    this.thirdActionElement.title = 'Third Action';
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    this.updateDisplay(params);
    return true;
  }

  public destroy(): void {
    // Cleanup if necessary
  }
}
