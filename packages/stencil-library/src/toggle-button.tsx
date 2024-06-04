// toggle-button.tsx
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'toggle-button',
  styleUrl: 'toggle-button.css',
  shadow: true
})
export class ToggleButton {
  @Prop() toggled: boolean = false;
  @Prop() onToggle: () => void;

  render() {
    return (
      <div
        class={`toggle-button ${this.toggled ? 'toggled' : ''}`}
        onClick={this.onToggle}
      >
        <div class="slider"></div>
      </div>
    );
  }
}
