import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'udp-tabs',
  styleUrl: 'udp-tabs.css',
})
export class UdpTabs {
  @State() activeTab: number = 0;

  tabClicked(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  render() {
    return (
      <div>
        <div class="tab-header">
          <slot name="tab-title">
            {/* Titles go here */}
          </slot>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    );
  }
}
