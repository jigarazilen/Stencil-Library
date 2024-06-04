import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-radio-button',
  styleUrl: 'udp-radio-button.css',
  shadow: false
})
export class UdpRadioButton {
  
  @Prop() name: string;
  @Prop() value: string;
  @Prop() checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() label: string;

  render() {
    return (
      <div class="udp-radio-button">
        {/* Moved input and label out of shadow root */}
        <slot>
          <input 
            type="radio" 
            name={this.name} 
            value={this.value}
            checked={this.checked}
            disabled={this.disabled}
            id={`radio-${this.name}-${this.value}`}
          />
          <label htmlFor={`radio-${this.name}-${this.value}`}> <unity-typography variant='caption-text' > {this.label}  </unity-typography> </label>
        </slot>
      </div>
    );
  }
}
