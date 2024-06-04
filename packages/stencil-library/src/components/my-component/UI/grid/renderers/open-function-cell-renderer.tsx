import { ICellRenderer } from 'ag-grid-community';
import { SharedContext } from './sharedContext'; // Ensure the path is correct

export default class OpenFunctionCellRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private otherCellValue: any;
  private otherField: string;
  private callbackId: string;
  
  public init(params: any): void {
    console.log('Renderer params:', params);
    
    this.eGui = document.createElement('div');

    // Check if we're in a group and if the specific field is available
    if(params.node.group) {
      // Possibly display something different for group rows or nothing at all
      if(params.value) {
        this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue;">🡕</span>`;
      }else {
        this.eGui.style.display = 'none';
      }

    } else {
      // Normal row rendering
      if(params.value) {
        this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue;">🡕</span>`;
      }
    }
    
    this.applyStyles();

    // Only proceed if not a group row
    if(!params.node.group) {
      this.otherField = params.colDef.cellRendererParams.otherField;
      this.otherCellValue = params.data[this.otherField];
      this.callbackId = params.colDef.cellRendererParams.callbackId;

      this.eGui.addEventListener('click', () => {
        console.log('Click event triggered');
        if (typeof SharedContext.myClickCallback === 'function') {
          console.log('Executing shared callback');
          SharedContext.myClickCallback(this.otherCellValue, this.callbackId);
        } else {
          console.log('Dispatching custom event');
          const customEvent = new CustomEvent('cellClick', {
            detail: { cellValue: this.otherCellValue, callbackId: this.callbackId },
            bubbles: true,
            composed: true
          });
          this.eGui.dispatchEvent(customEvent);
        }
      });
    }
  } 

  private applyStyles(): void {
    this.eGui.style.backgroundColor = '#f0f0f0';
    this.eGui.style.borderRadius = '50px';
    this.eGui.style.paddingLeft = '8px';
    this.eGui.style.paddingRight = '8px';
    this.eGui.style.textAlign = 'center';
    this.eGui.style.margin = '2px 0';
    this.eGui.style.lineHeight = '26px';
    this.eGui.style.cursor = 'pointer';
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    // Make sure the renderer updates correctly for grouped/non-grouped rows
    if(!params.node.group && params.value) {
      this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue;">🡕</span>`;
      this.otherCellValue = params.data[this.otherField];
    }
    return true;
  }

  public destroy(): void {
    // Cleanup if necessary
  }
}