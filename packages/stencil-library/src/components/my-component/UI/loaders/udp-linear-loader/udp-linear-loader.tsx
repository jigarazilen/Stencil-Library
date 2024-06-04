import { Component, h, Host } from '@stencil/core';
import './udp-linear-loader.css';

@Component({
  tag: 'udp-linear-loader',
  styleUrl: 'udp-linear-loader.css',
  shadow: true,
})
export class UdpLinearLoader {
  render() {
    return (
      <Host>
        <div class="loader">
          <div class="indeterminate"></div>
        </div>
      </Host>
    );
  }
}
