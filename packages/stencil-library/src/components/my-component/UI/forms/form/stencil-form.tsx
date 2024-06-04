import { Component, h, Prop, Event as StencilEvent, EventEmitter } from '@stencil/core';
import state from './stencil-form-store';
import { createForm } from 'final-form';
import debounce from 'lodash.debounce'
@Component({
  tag: 'stencil-form',
})
export class StencilForm {
  @Prop() handleSubmit: (values: Object) => void;
  @Prop() initialValues: Object;
  @Prop() validate: (values: Object, errors: Object) => Object;
  @Prop() validateOnBlur: boolean = true;
  @StencilEvent() stencilFormInvalidEvent: EventEmitter<Object>;


  constructor(){
    this.submitWithValidation = this.submitWithValidation.bind(this)
    this.defaultValidation = this.defaultValidation.bind(this)
    this.submit = this.submit.bind(this)
  }
  componentWillLoad() {
    state.api = createForm({ onSubmit: this.submitWithValidation, initialValues: this.initialValues, validate: this.defaultValidation, validateOnBlur: this.validateOnBlur});
  }

  async submitWithValidation(values: {[key: string] : any}): Promise<void>{
    const errors = this.defaultValidation(values);
    if(Object.keys(errors).length === 0){
      this.handleSubmit(values)
    }else{
      this.stencilFormInvalidEvent.emit(errors)
    }
  }
  


  defaultValidation(values: Object):Object{
    const {registeredFields} = state;
    const errors = {}

    Object.keys(registeredFields).forEach(field => {
      if(registeredFields[field].required && (!values[field] || values[field]?.length === 0) ){
        errors[field] = 'Required'
      }
    })
    if (this?.validate) return this.validate?.(values, errors);

    return errors

  }

  getValues(){
    const values = {}
    state.api.getRegisteredFields().forEach((fieldName: string) => {
      values[fieldName] = state.api.getFieldState(fieldName).value;
    })
    return values
  }

  submit(e) {
    e?.preventDefault?.();
    const submitFunction = () => {
      // const errors = state.api.validate
      const errors = this.defaultValidation(this.getValues())
      if(Object.keys(errors).length){
        this.stencilFormInvalidEvent.emit(errors)
        return
      }
      
      state.api?.submit();
    }

    debounce(submitFunction, 1000, {leading:true, trailing: true})()

  }

  render() {
    return (
      <form
        onSubmit={this.submit}
      >
        <slot />
      </form>
    );
  }
}
