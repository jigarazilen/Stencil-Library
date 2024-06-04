// your-component.tsx
import { Component, 
  Prop, 
  h, 
  State, 
  Event as StencilEvent, // conflicts with Event type so using as to rename
  Watch,
  EventEmitter
} from '@stencil/core';
@Component({
  tag: 'text-area',
  styleUrl: 'text-area.css',
  shadow: true,
})
export class TextArea {
  @Prop() label: string;
  @Prop() id: string;
  @Prop() placeholder: string;
  @Prop({mutable: true}) value: string;
  @Prop() error: string;
  @Prop() required: boolean;
  @Prop() readOnly: boolean;
  @Prop() disabled: boolean;
  @Prop() fullWidth: boolean;
  @Prop() maxCharacter: number;
  @Prop() handleChange: (event: Event) => void;
  @Prop() handleBlur: (event: FocusEvent) => void;
  @Prop() handleFocus: (event: FocusEvent) => void;
  @Prop() rows: number = 6;
  @State() errorMessage: string;

  @StencilEvent() udpFieldFocus: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldBlur: EventEmitter<FocusEvent>;
  @StencilEvent() udpFieldChange: EventEmitter<string>;

  constructor() {
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

   @Watch('error')
   updateError() {
     this.errorMessage = this.error;
   }
  componentWillLoad() {
    // this.internals.setFormValue(this.value ?? '');
    if(this.error) {
      this.errorMessage = this.error;
    }
      if(this.value){
        this.udpFieldChange.emit(this.value) // emit change with the defualt value so final form detects the defualt value
      }
   // this.currentValue = this.value;
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
    this?.handleChange?.(event)
  }
  render() {
    const isError = !!this.errorMessage;
    const errorClass = isError ? 'error' : '';
    return (
      <div class="">
        <unity-typography variant="caption-text"><label htmlFor={this.id} class="">{this.label}</label></unity-typography>
        <unity-typography variant="body">
        <textarea 
          rows={this.rows}
          id={this.id}
          class={`${this.fullWidth ? 'full-width' : ''} ${errorClass}`} // Conditionally apply error class
          placeholder={this.placeholder}
          value={this.value}
          onInput={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          maxLength={this.maxCharacter}
          //@ts-ignore
          udprecordid={"udpRecord-text-area-"+this.id}
        />
        </unity-typography>
        {isError && <div class="error-message">{this.errorMessage}</div>} {/* Display error message if isError is true */}
      </div>
    );
  }
  
}
