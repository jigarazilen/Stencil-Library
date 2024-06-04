import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'udp-divider',
  styleUrl: 'udp-divider.css',
  shadow: true,
})
export class UdpDivider {
  @Prop() variant: 'horizontal' | 'vertical' = 'horizontal';
  @Prop() size: string; // new Prop for size

  render() {
    const style = this.variant === 'vertical'
      ? { height: this.size }
      : { width: this.size };

    return (
      <Host style={style}>
        <div class={this.variant === 'horizontal' ? 'horizontal' : 'vertical'}></div>
      </Host>
    );
  }
}
