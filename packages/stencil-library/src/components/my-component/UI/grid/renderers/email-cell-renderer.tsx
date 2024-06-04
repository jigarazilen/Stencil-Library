import { ICellRenderer } from 'ag-grid-community';
//import { SharedContext } from './sharedContext'; // Ensure the path is correct

export default class EmailCellRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  //private otherCellValue: any;
  private clickListener: () => void;

  public init(params: any): void {
    this.eGui = document.createElement('div');

    // Set the cell's content with the arrow character appended
    this.eGui.innerHTML = `${params.value} <span style="padding-left: 5px; color: blue ">🡕</span>`;

    // Style the cell
    this.applyStyles();

    // Retrieve the value from another cell in the same row (update 'otherField' accordingly)
    //this.otherCellValue = params.data.contactID;

    // Create a click listener that calls the shared callback with the other cell's value
    //this.clickListener = () => SharedContext.myClickCallback(this.otherCellValue);

    // Add the click event listener to the cell
    this.eGui.addEventListener('click', this.clickListener);
  }

  private applyStyles(): void {
    // Apply your desired styling here
    this.eGui.style.backgroundColor = '#f0f0f0'; // Light grey background
    this.eGui.style.borderRadius = '50px'; // Rounded corners
    this.eGui.style.paddingLeft = '8px'; // Some padding
    this.eGui.style.paddingRight = '8px'; // Some padding
    this.eGui.style.textAlign = 'center'; // Center the text
    this.eGui.style.margin = '2px 0'; // Add a bit of margin for spacing
    this.eGui.style.lineHeight = '26px'; // Add a bit of margin for spacing
    this.eGui.style.cursor = 'pointer'; 
    
    // Apply styles to the arrow
    const arrowStyle = document.createElement('style');
    arrowStyle.innerHTML = `
      .arrow {
        display: inline-block;
       
      }
    `;
    document.head.appendChild(arrowStyle);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: any): boolean {
    // Update the content (with arrow) and other cell value when data changes
    this.eGui.innerHTML = `${params.value} <span style="padding-left: 6px;  ">⇡</span>`;
    //this.otherCellValue = params.data.contactID;
    return true; // Return true to indicate the refresh happened
  }

  public destroy(): void {
    // Cleanup: remove the click event listener
    if (this.eGui && this.clickListener) {
      this.eGui.removeEventListener('click', this.clickListener);
    }
  }
}
