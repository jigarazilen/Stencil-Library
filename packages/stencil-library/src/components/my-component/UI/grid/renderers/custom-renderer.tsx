import { ICellRenderer } from 'ag-grid-community';

export default class CustomRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private statusChip: any; // Use appropriate type

  public init(params: any): void {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
      <status-chip></status-chip>
    `;
    this.statusChip = this.eGui.querySelector('status-chip');
    this.statusChip.status = params.value;
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    this.statusChip.status = params.value;
    return true;
  }
}
