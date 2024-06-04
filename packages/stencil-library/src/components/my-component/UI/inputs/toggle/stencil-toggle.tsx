import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'stencil-toggle',
  styleUrl: 'stencil-toggle.css',
  shadow: true,
})
export class StencilToggle {
  @State() toggled: boolean = false;

  @Prop() checked: boolean;
  @Prop() label: string;
  @Prop() disabled: boolean = false;
  @Prop() idItem: string;

  @Event() toggledChange: EventEmitter;

  componentWillLoad() {
    this.toggled = this.checked;
  }

  componentWillUpdate() {
    this.toggled = this.checked;
  }

  toggleButton() {
    if (this.disabled) return;

    this.toggled = !this.toggled;
    this.toggledChange.emit(this.toggled);
  }

  render() {
    const buttonId = this.idItem ? `${this.idItem}-button` : '';
    const labelId = this.idItem ? `${this.idItem}-label` : '';

    return (
      <div class="toggle-wrapper">
        {this.label && (
          <label id={labelId} class="toggle-label" htmlFor={buttonId}>
             <unity-typography variant='caption-text' > {this.label} </unity-typography> 
          </label>
        )}
        <div class={`toggle-container ${this.toggled ? 'toggled' : ''}`}>
          <button
            id={buttonId}
            onClick={() => this.toggleButton()}
            disabled={this.disabled}
            aria-checked={this.toggled.toString()}
            aria-labelledby={labelId}
            role="switch"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>
    );
  }
}
