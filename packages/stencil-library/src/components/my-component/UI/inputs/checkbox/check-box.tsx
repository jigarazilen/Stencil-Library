// checkbox.tsx

import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'check-box',
  styleUrl: 'check-box.css',
  shadow: true
})
export class Checkbox {
  @Prop() checked: boolean = false;
  @Prop() label: string;
  @Prop() id: string;
  @Event() checkboxChanged: EventEmitter<boolean>;

  handleChange(event: Event) {
    this.checkboxChanged.emit((event.target as HTMLInputElement).checked);
  }

  render() {
    return (
      <div class="checkbox-container">
        <input type="checkbox" checked={this.checked} onChange={(e) => this.handleChange(e)} id={this.id}/>
        {this.label && <span>{this.label}</span>}
      </div>
    );
  }
}
