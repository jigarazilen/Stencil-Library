import { ICellRenderer } from 'ag-grid-community';
import { SharedContext } from './sharedContext'; // Ensure the path is correct

export default class HoverContentCellRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private hoverInfo: string;
  private tooltipField: string;

  public init(params: any): void {
    console.log('Renderer params:', params);
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.value;
    this.applyStyles();

    this.tooltipField = params.colDef.cellRendererParams.otherField || 'defaultTooltipField';
    this.hoverInfo = params.data[this.tooltipField];
    this.createTooltip();

    this.eGui.addEventListener('mouseover', this.handleMouseOver);
    this.eGui.addEventListener('mouseout', this.hideTooltip);
  }

  private applyStyles(): void {
    (this.eGui as HTMLElement).style.cursor = 'help'; // Change as needed
    // Add more styles as needed
  }

  private createTooltip(): void {
    const tooltip = document.createElement('span');
    tooltip.innerText = this.hoverInfo;
    tooltip.style.visibility = 'hidden';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '999';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid grey';
    tooltip.style.padding = '5px';
    tooltip.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)'; 
    tooltip.classList.add('cell-tooltip');
    this.eGui.appendChild(tooltip);
  }

  private handleMouseOver = () => {
    const tooltip = this.eGui.querySelector('.cell-tooltip') as HTMLElement;
    tooltip.style.visibility = 'visible';

    // Using SharedContext's myClickCallback
    SharedContext.myClickCallback(this.hoverInfo, 'someCallbackId');
  };

  private hideTooltip = () => {
    const tooltip = this.eGui.querySelector('.cell-tooltip') as HTMLElement;
    tooltip.style.visibility = 'hidden';
  };

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    this.eGui.innerHTML = params.value;
    this.hoverInfo = params.data[this.tooltipField];
    // Update tooltip text if necessary
    return true;
  }

  public destroy(): void {
    // Cleanup if necessary
  }
}
