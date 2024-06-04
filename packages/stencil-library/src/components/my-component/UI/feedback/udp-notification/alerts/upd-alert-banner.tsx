import { Component, Prop, h } from '@stencil/core';
import Reset16 from '@carbon/icons/es/reset/16';

@Component({
  tag: 'upd-alert-banner',
  styleUrl: 'upd-alert-banner.css',
  shadow: true,
})
export class UpdAlertBanner {
  // Define properties here
  @Prop() type: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Prop() message: string = '';
  @Prop() onClick: () => void;

  render() {
    return (
        <div class={`alert-banner ${this.type}`}>
        <unity-typography variant="data-display-three">   {this.message} </unity-typography>
        <stencil-icon-button icon={Reset16} showLabel={false}  onClick={this.onClick} tooltip='Refresh Search'  ></stencil-icon-button>
      </div>
    );
  }
}
