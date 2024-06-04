import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'udp-ambient-tool-tip',
  styleUrl: 'udp-ambient-tool-tip.css',
  shadow: true,
})
export class UdpAmbientToolTip {

  @Prop() content: string;
  @State() isVisible: boolean = false;

  handleMouseOver = () => {
    // Only set isVisible to true if there is content.
    if (this.content && this.content.trim() !== '') {
      this.isVisible = true;
    }
  }

  handleMouseOut = () => {
    this.isVisible = false;
  }

  render() {
    // Check if content is provided before rendering the tooltip content.
    const shouldDisplayTooltip = this.isVisible && this.content && this.content.trim() !== '';

    return (
      <div class="tooltip-wrapper" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {shouldDisplayTooltip && (
          <div class="tooltip-content">
            <unity-typography variant='caption-text'>{this.content}</unity-typography>
          </div>
        )}
        <slot></slot>
      </div>
    );
  }
}
