import { ICellRenderer } from 'ag-grid-community';
import ChooseItem16 from '@carbon/icons/es/choose-item/16';

export default class CustomActionsRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private iconButton: any; // Use appropriate type

  public init(params: any): void {
    this.eGui = document.createElement('div');

    this.eGui.innerHTML = `
      <stencil-icon-button></stencil-icon-button>
    `;

    this.iconButton = this.eGui.querySelector('stencil-icon-button');
  
    // Assuming `icon` is the attribute or property used to set the icon
    this.iconButton.icon = ChooseItem16;

    this.iconButton = this.eGui.querySelector('stencil-icon-button');

    // Assigning the cell value to some attribute or property
    this.iconButton.cellValue = params.value;

    // Use the provided onClick function if it exists
    const onClick = params.onClick || function() {};
    
    // Add an onClick event listener to the button
    this.iconButton.addEventListener('click', () => onClick(params.value));
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    this.iconButton.cellValue = params.value;
    return true;
  }
}
