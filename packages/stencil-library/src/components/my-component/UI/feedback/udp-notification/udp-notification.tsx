// src/components/udp-notification/udp-notification.tsx

import { Component, Prop, h, Watch } from '@stencil/core';

@Component({
  tag: 'udp-notification',
  styleUrl: 'udp-notification.css',
  shadow: true
})
export class UdpNotification {
  @Prop() message: string;
  @Prop() status: 'success' | 'error' | 'warning';
  @Prop() userCancel: boolean = false;
  @Prop({ mutable: true, reflect: true }) active: boolean = false;

  @Watch('active')
  activeChanged(newValue: boolean) {
    if (newValue && !this.userCancel) {
      // Hide the notification after 3 seconds only if userCancel is false
      setTimeout(() => this.active = false, 3000);
    }
  }
  
  render() {
    const statusClass = `status-${this.status}`;
  
    return (
      <div class={{
          'udp-notification': true,
          'visible': this.active,
          [statusClass]: true // This will apply the correct class based on the status
        }}>
        {this.userCancel && (
          <button class="close-button" onClick={() => this.active = false}>
            &times;
          </button>
        )}
        <span class="message"> <unity-typography variant='body' > {this.message} </unity-typography></span>
      </div>
    );
  }
  
}
