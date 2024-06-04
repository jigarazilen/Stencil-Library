import { ICellRenderer } from 'ag-grid-community';

export default class DateTimeCellRenderer implements ICellRenderer {
  private eGui: HTMLElement;
  private formatMode: 'exact' | 'relative' = 'exact'; // Default to 'relative'
  private locale: 'UK' | 'US' = 'UK'; // Default locale

  public init(params: any): void {
    console.log("Renderer init called."); // Check if init is called
    this.eGui = document.createElement('div');
    this.formatMode = params.formatMode || this.formatMode;
    this.locale = params.locale || this.locale;

    // If we are grouping by row and value is null we want to hide the cell
    if(params.node.group && !params.value){
      this.eGui.style.display = 'none';
    }else{
      const formattedDate = this.formatDate(params.value);
      this.eGui.innerHTML = `${formattedDate}`;
    }
    this.applyStyles();
  }

  private formatDate(dateString: string): string {
    console.log("formatDate called with:", dateString); // Log when formatDate is called
    const date = new Date(dateString);
    if (this.formatMode === 'exact') {
      return this.formatExactDate(date);
    } else {
      return this.formatExactDate(date);
    }
  }

  private formatExactDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
  
    console.log(`Formatting date for locale x: ${this.locale}`); // Log to check the current locale
  
    if (this.locale === 'UK') {
      return `${day}/${month}/${year}`; // UK format: DD/MM/YYYY
    } else {
      return `${month}/${day}/${year}`; // US format: MM/DD/YYYY
    }
  }
  

  public refresh(params: any): boolean {
    console.log("Renderer refresh called."); // Check if refresh is called
    if (params.formatMode && params.formatMode !== this.formatMode) {
      this.formatMode = params.formatMode;
    }
    if (params.locale && params.locale !== this.locale) {
      this.locale = params.locale;
    }
    const formattedDate = this.formatDate(params.value);
    this.eGui.innerHTML = `${formattedDate}`;
    return true;
  }

  private applyStyles(): void {
    // this.eGui.style.padding = '8px';
    this.eGui.style.textAlign = 'left';
    this.eGui.style.cursor = 'default';
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public destroy(): void {
    // Optionally, clean up any added listeners, etc.
  }
}
