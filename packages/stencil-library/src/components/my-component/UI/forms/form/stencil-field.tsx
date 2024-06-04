import { Component, Prop, h, State,  Listen } from '@stencil/core';
import state from './stencil-form-store';
 
@Component({
  tag: 'stencil-field',
  styleUrl: 'stencil-field.css',
  shadow: true,
})
export class StencilField {
  @Prop() id: string;
  @Prop() component: string;
  @Prop() defaultValue: string;
  @Prop() name: string;
  @Prop() label: string;
  @Prop() required: boolean = false;
  @Prop({ mutable: true }) value: string;
  @Prop() componentProps: Object;
  @State() errorMessage: string;
  @State() registered: boolean = false;
  @State() finalFormBlur: (e: Event) => void = () => {}; 
  @State() finalFormChange: (value: any) => void = () => {}; 
  @State() finalFormFocus: (e: Event) => void = () => {}; 

  componentWillLoad() {
    state.api.registerField(
      this.name,
      fieldState => {
        const { blur, change, focus, value } = fieldState;
        if (!state.registeredFields[this.name]) {
          state.registeredFields[this.name] = { required: this.required };
          // first time, register event listeners

          this.finalFormBlur =  () => {
            blur();
            this.errorMessage = state.api.getFieldState(this.name)?.error;
          };
          this.finalFormChange = event => {
            change(event);
            // reset the error on change, error state will be re-evaluated when the blur event is triggered
            this.errorMessage = '' 

            
          };
          this.finalFormFocus =  focus;
          this.registered = true
        }

        // update value

        this.value = value
      },
      {
        value: true,
        error: false,
        touched: false,
      },
    );

  }

  @Listen('udpFieldChange')
  change(e){
    this.finalFormChange?.(e.detail)
    if(this.component === 'file-upload')
      this.finalFormBlur(e)
  }
  @Listen('udpFieldFocus')
  focus(e){
    this.finalFormFocus(e)
  }
  @Listen('udpFieldBlur')
  blur(e){
    if(this.component === 'file-upload')
      return;
    this.finalFormBlur(e)
  }

  @Listen('stencilFormInvalidEvent', {target: 'body'})
  stencilInvalid(e){
    this.finalFormBlur(e);
  }
  render() {
    if(!this.registered){
      return null
    }
    const additionalProps: {[key: string]: any} = {}
    if(this.component === 'udp-selector') {
      additionalProps.defaultOption = this.value
    }

    /*
    TODO: investigate below way of rendering a component, 
    this avoids having to use the switch case below, which works in development but when built into react it does not work
    return h(this.component, {
      name: this.name,
      id: this.id,
      label: this.label,
      value: this.value,
      ...this.componentProps,
      ...additionalProps
    });
    */
    const props = {
      name: this.name,
      id: this.id,
      label: this.label,
      error: this.errorMessage,
      value: this.value,
      ...this.componentProps,
      ...additionalProps
    };

    switch(this.component){
      case('text-field'):
        return <text-field {...props}/>
      case('text-area'):
        return <text-area {...props}/>
      case('udp-selector'):
        return <udp-selector {...props}/>
      case('selectable-list'):
        return <selectable-list {...props}/>
      case('udp-time-selector'):
        return <udp-time-selector {...props}/>
      case('udp-datetime-selector'):
        return <udp-datetime-selector {...props}/>
      case('udp-date-selector'):
        return <udp-date-selector {...props}/>
      case('file-upload'):
        return <file-upload {...props}/>
    }
    return null;
  }
}
