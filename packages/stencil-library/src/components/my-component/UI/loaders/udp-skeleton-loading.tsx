import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'udp-skeleton-loading',
  styleUrl: 'udp-skeleton-loading.css',
  shadow: true
})
export class UdpSkeletonLoading {
  // You can use properties to define the size, shape, etc.
  @Prop() width: string = '100%';
  @Prop() height: string = '20px';
  @Prop() borderRadius: string = '4px';

  render() {
    return (
      <div class="skeleton-loader" style={{ width: this.width, height: this.height, borderRadius: this.borderRadius }}>
        {/* Additional markup if needed */}
      </div>
    );
  }
}
