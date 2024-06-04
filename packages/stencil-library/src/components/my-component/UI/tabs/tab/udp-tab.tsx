import { Component, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'udp-tab',
  styleUrl: 'udp-tab.css',
})
export class UdpTab {
  @Prop() title: string;
  @Prop() active: boolean;

  @Watch('active')
  activeChanged() {
    // Handle the active state change, if needed
  }

  render() {
    return (
      <div class={{ 'tab-panel': true, 'active': this.active }}>
        <slot></slot>
      </div>
    );
  }
}
