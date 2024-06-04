import { Component, h, State, EventEmitter, Prop, Event as StencilEvent   } from '@stencil/core';

@Component({
  tag: 'udp-date-selector',
  styleUrl: 'udp-date-selector.css',
  shadow: true,
})
export class UdpDateSelector {
  @Prop() id: string;
  @Prop() label: string;
  /**
   * Minimum date, supports any date supported by the js Date constructor
   */
  @Prop() min: string;
  /**
   * Maximum date, supports any date supported by the js Date constructor
   */
  @Prop() max: string;
  @Prop() required: boolean;
  @Prop() error: string;
  @Prop({mutable: true}) value: string;


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

  formatDateForHtml(dateString: string) {
    // convert to date
    const date = new Date(dateString);

    if(isNaN(date?.getTime()))
      return null

    // when converting to ISO string, javascript will edit the date to compensate for the timezone, we dont want that here so we manually subtract the offset that it will add 
    
    date?.setTime(date?.getTime() - (date?.getTimezoneOffset()*60*1000));
    
    const isoString = date?.toISOString()
    if(!isoString)
      return null;
    
    return isoString?.split?.('T')[0]   
  }

  render() {
    const isError: boolean = !!this.error;
    const inputClass = isError ? 'bx--text-input bx--text-input--error' : 'bx--text-input';
    return (
      <div class="bx--form-item">
        <label htmlFor={this.id} class="bx--label">
          {this.label}
        </label>
        <input
          type="date"
          id={this.id}
          class={inputClass}
          value={this.value}
          min={this.min ? this.formatDateForHtml(this.min) : null}
          max={this.max ? this.formatDateForHtml(this.max) : null}
          onInput={event => this.handleDateChange(event)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          //@ts-ignore
          udprecordid={"udpRecord-udp-date-selector-"+this.id}
        />
        <unity-typography class="error-message" variant="caption-text">
          {this.error}
        </unity-typography>
      </div>
    );
  }
}
