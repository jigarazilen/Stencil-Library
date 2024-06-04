import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'logical-search-indicator',
  styleUrl: 'logical-search-indicator.css',
  shadow: true
})
export class LogicalSearchIndicator {
  @Prop() type: number;

  render() {
    return (
      <div class="chip">
        {this.type === 1 ? <unity-typography variant="data-display-one" >AND</unity-typography> : this.type === 2 ? <unity-typography variant="data-display-one" >OR</unity-typography> : ''}
      </div>
    );
  }
}
