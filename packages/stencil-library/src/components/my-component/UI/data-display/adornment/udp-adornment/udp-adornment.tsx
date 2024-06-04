import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-adornment',
  styleUrl: 'udp-adornment.css',
  shadow: true,
})
export class UdpAdornment {
  // Prop to accept the status
  @Prop() status: 'success' | 'warning' | 'error' | 'info' | 'disabled';

  // Method to determine the color based on status
  private getColor(): string {
    switch (this.status) {
      case 'success':
        return 'var(--success-color-main)';
      case 'warning':
        return 'var(--warning-color-main)';
      case 'error':
        return 'var(--error-color-main)';
      case 'info':
        return 'var(--info-color-main)';
      case 'disabled':
        return 'var(--disabled-color-main)'; // Assuming this is the correct variable for disabled
      default:
        return 'transparent';
    }
  }

  render() {
    const style = { width: '4px', height: '100%', backgroundColor: this.getColor() };

    return <div style={style}></div>;
  }
}
