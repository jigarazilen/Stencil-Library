import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-page',
  styleUrl: 'udp-page.css',
  shadow: true,
})
export class UdpPage {
  /**
   * Optional maximum page width
   */
  @Prop() maxWidth?: string = '1200px'; // Default max-width, can be overridden

  /**
   * Default padding for the layout
   */
  @Prop() padding?: string = '16px'; // Default padding, can be overridden

  render() {
    const style = {
      maxWidth: this.maxWidth,
      padding: this.padding,
      margin: '0 auto', // Centers the content if max-width is set
    };

    return (
      <div style={style}>
        <slot></slot> {/* This will render the content passed between the <udp-page> tags */}
      </div>
    );
  }
}
