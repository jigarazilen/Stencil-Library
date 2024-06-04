import { Component, h, Prop } from '@stencil/core';
import './udp-badge.css';

@Component({
  tag: 'udp-badge',
  styleUrl: 'udp-badge.css',
  shadow: true,
})
export class UdpBadge {
  @Prop() content: number = 0;
  @Prop() max: number = 99;

  render() {
    const displayContent =
      this.content > this.max ? `${this.max}+` : this.content;

    return (
      <div class="badge-wrapper">
        <slot></slot>
        <span class="badge-content">
            <unity-typography variant='caption-text' > {displayContent} </unity-typography>
            
        </span>
      </div>
    );
  }
}
