import { ICellRenderer } from 'ag-grid-community';
import { SharedContext } from './sharedContext'; // Ensure the path is correct

export default class ReternSearchDataRendererCellRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private otherCellValue: any;
  private otherField: string;
  private callbackId: string;
  
  public init(params: any): void {
    console.log('Renderer params:', params);
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue;">🡕</span>`;
    this.applyStyles();

    this.otherField = params.colDef.cellRendererParams.otherField || 'contactID';
    this.otherCellValue = params.data[this.otherField];
    this.callbackId = params.colDef.cellRendererParams.callbackId;
    
      // console.log('this.otherField = params.cellRendererParams?.otherField', this.otherField)
      // console.log('cellRendererParams:', params.cellRendererParams);
      // console.log('this.otherField:', this.otherField);
      // console.log('this.otherCellValue:', this.otherCellValue);
      // console.log('this.callbackIdValue:', this.callbackId);

    this.eGui.addEventListener('click', () => {
      if (typeof SharedContext.myClickCallback === 'function') {
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
    this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue;">🡕</span>`;
    //this.otherCellValue = params.data[this.otherField];
    return true;
  }

  public destroy(): void {
    // Cleanup if necessary
  }
}
