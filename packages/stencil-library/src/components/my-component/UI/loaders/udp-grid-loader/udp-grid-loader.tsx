import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-grid-loader',
  styleUrl: 'udp-grid-loader.css',
  shadow: true
})
export class UdpGridLoader {
  @Prop() numColumns: number = 8;
  @Prop() numRows: number = 5; // Default number of rows
  @Prop() width: string = 'calc(100vw - 70px)';

  render() {
    // Header bar (fatter, divided into columns)
    const headerBar = (
      <div class="grid-row">
        {Array.from({ length: this.numColumns }).map(() => (
          <udp-skeleton-loading width="100%" height="55px"></udp-skeleton-loading>
        ))}
      </div>
    );

    // Row bars (each divided into columns)
    const rowBars = Array.from({ length: this.numRows }).map(() => (
      <div class="grid-row">
        {Array.from({ length: this.numColumns }).map(() => (
          <udp-skeleton-loading width="100%" height="30px"></udp-skeleton-loading>
        ))}
      </div>
    ));

    return (
      <div style={{width: this.width }} >
        {headerBar}
        {rowBars}
      </div>
    );
  }
}
