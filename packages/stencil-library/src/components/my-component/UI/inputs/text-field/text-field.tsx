import {
   Component, 
   Prop, 
   h, 
   State, 
   Event as StencilEvent, // conflicts with Event type so using as to rename
   EventEmitter 
  } from '@stencil/core';

@Component({
  tag: 'text-field',
  styleUrl: 'text-field.css',
  shadow: true,
})
export class TextField {
  @Prop() id: string;
  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop() required: boolean;
  @Prop() readOnly: boolean;
  @Prop() disabled: boolean;
  @Prop() maxCharacter: number;
  @Prop({mutable: true}) value: string;
  @Prop() hidden: boolean;
  @Prop() error: string = '';
  @State() errorMessage: string;
  @Prop() handleInput: (event: Event) => void;
  @Prop() handleBlur: (event: Event) => void;
  @Prop() handleFocus: (event: Event) => void;


  @StencilEvent() udpFieldFocus: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldBlur: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldChange: EventEmitter<string>;

  constructor() {
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onFocus(event: FocusEvent) {
    this.udpFieldFocus.emit(event);
    this?.handleFocus?.(event)
  }

  onBlur(event: FocusEvent) {
    this.udpFieldBlur.emit(event);
    this?.handleBlur?.(event)
  }

  onChange(event: InputEvent) {
    this.udpFieldChange.emit((event.target as HTMLInputElement).value);
    this?.handleInput?.(event)
  }

  componentWillLoad(){
    if(this.value){
      this.udpFieldChange.emit(this.value) // emit change with the defualt value so final form detects the defualt value
    }
  }


  render() {
    const isError = !!this.error;
    const inputClass = isError ? 'bx--text-input bx--text-input--error' : 'bx--text-input';
    return (
      <div class="bx--form-item">
        <unity-typography variant="caption-text">
        <label htmlFor={this.id} class="bx--label">
          {this.label}
          {this.required ? '*' : ''}
          </label>
          </unity-typography>
          {this.hidden ? (
            <input id={this.id} type="hidden" value={this.value} />
          ) : (
            <input
              id={this.id}
              type="text"
              class={inputClass}
              placeholder={this.placeholder}
              value={this.value}
              required={this.required}
              disabled={this.disabled}
              readOnly={this.readOnly}
              onFocus={this.onFocus}
              onInput={this.onChange}
              onBlur={this.onBlur}
              maxLength={this.maxCharacter}
              //@ts-ignore
              udprecordid={"udpRecord-text-field-" + this.id}
            />
          )}
          {isError && (
            <div class="error-message">
              <unity-typography variant="caption-text">{this.error}</unity-typography>
            </div>
          )}
        
      </div>
    );
  }
}
