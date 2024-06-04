// udp-date-selector.tsx
import { Component, h, State, Event as StencilEvent, EventEmitter, Prop,   } from '@stencil/core';
@Component({
  tag: 'udp-time-selector',
  styleUrl: 'udp-time-selector.css',
  shadow: true
})
export class UdpTimeSelector {
  @Prop() id: string;
  @Prop() label: string;
  @Prop() min: string;
  @Prop() max: string;
  @Prop() required: boolean;
  @Prop() error: string;
  @Prop({mutable: true}) value: string = '';
  @State() errorMessage: string;

  @StencilEvent() udpFieldFocus: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldBlur: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldChange: EventEmitter<string>;

  constructor() {
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleBlur(e){
    this.udpFieldBlur.emit(e);
  }

  handleFocus(e){
    this.udpFieldFocus.emit(e)
  }

  handleDateChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.udpFieldChange.emit(this.value);
  }


  render() {

    const isError: boolean = !!this.error;
    const inputClass = isError ? 'bx--text-input bx--text-input--error' : 'bx--text-input';
    return (
      <div class="bx--form-item">
        <label htmlFor={this.id} class="bx--label">{this.label}</label>
        <input
          type="time"
          id={this.id}
          class={inputClass}
          value={this.value}
          min={this.min}
          max={this.max}
          onInput={this.handleDateChange}
          onBlur={this.handleBlur}
        />
        <unity-typography class="error-message" variant="caption-text">
          {this.error}
        </unity-typography>
      </div>
    );
  }
}
