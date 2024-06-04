import { Component, h, Prop, Element } from '@stencil/core';
import { GridOptions } from 'ag-grid-community';

@Component({
  tag: 'ag-table',
  shadow: false // Changed from true to false
})
export class AgTable {
  @Element() el: HTMLElement;
  @Prop() gridOptions: GridOptions;
  @Prop() licensekey: string;  // Changed to lowercase to match JSX/TSX
  @Prop() height: string = 'calc(100vh - 200px)';

  render() {
    return (
      <div id="myGrid" style={{ height: this.height, width: '100%' }} class="ag-theme-material"></div>
    );
  }
}
