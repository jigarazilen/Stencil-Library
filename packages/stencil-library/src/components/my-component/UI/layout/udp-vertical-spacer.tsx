import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-vertical-spacer',
  styleUrl: 'udp-vertical-spacer.css',
  shadow: true,
})
export class UdpVerticalSpacer {
  @Prop() unit: 'small' | 'medium' | 'large';

  render() {
    const sizeMap = {
      small: 'spacing-01', // Assuming this corresponds to --spacing-01
      medium: 'spacing-07', // Assuming this corresponds to --spacing-07
      large: 'spacing-13', // Assuming this corresponds to --spacing-13
    };

    const spacingClass = sizeMap[this.unit] || 'spacing-01';

    return (
      <div class={spacingClass}></div>
    );
  }
}
