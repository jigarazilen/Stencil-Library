import { Component, ComponentInterface, Element, h, Prop } from '@stencil/core';
import { Question } from '../types';
import { UdpFormsFieldTypeEnum } from '../enums';
import { FontOverrides } from '../types';
import { fontOverrideMapping, overrideFont } from '../utils';

@Component({
  tag: 'udp-question',
  styleUrl: 'udp-question.css',
  shadow: true
})
export class UdpQuestion {
  @Prop() question: Question;
  @Prop() questionNumber: number;
  @Prop() value: string; // only used for Paragraph type (UdpFormsFieldTypeEnum.Paragraph)
  @Prop() styleOverrides: {
    helperText: FontOverrides;
    questionText: FontOverrides;
    paragraphText: FontOverrides;
  };

  @Element() el: HTMLElement;

  getFieldComponent(): ComponentInterface {
    const props = {
      name: this.question.name ?? `question-${this.questionNumber}`,
      required: this.question.required,
    };
    const fieldProps = { ... this.question.fieldProperties, id:this.questionNumber};
    switch (this.question.fieldTypeId) {
      case UdpFormsFieldTypeEnum.SingleLineText:
        return <stencil-field {...props} component={'text-field'} componentProps={{ ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.MultiLineText:
        return <stencil-field {...props} component={'text-area'} componentProps={{ fullWidth: true, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.Checkbox:
        return (
          <stencil-field
            component="selectable-list"
            {...props}
            componentProps={{ valueKey: 'value', displayKey: 'display', multiSelect: true, useCheckbox: true, ...fieldProps }}
          />
        );
      case UdpFormsFieldTypeEnum.RadioButton:
        return <stencil-field component="selectable-list" {...props} componentProps={{ valueKey: 'value', displayKey: 'display', useCheckbox: true, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.DropdownSingleSelect:
      case UdpFormsFieldTypeEnum.DropdownMultipleSelect:
        let options: { label: string; value: string } = fieldProps?.items?.map?.(items => ({ label: items.display, value: items.value, ...fieldProps }));
        return (
          <stencil-field
            component="udp-selector"
            {...props}
            componentProps={{ options: options ?? [], multiSelect: this.question.fieldTypeId === UdpFormsFieldTypeEnum.DropdownMultipleSelect, ...fieldProps }}
          />
        );
      case UdpFormsFieldTypeEnum.ListMultiSelect:
        return <stencil-field component="selectable-list" {...props} componentProps={{ valueKey: 'value', displayKey: 'display', multiSelect: true, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.DateSelector:
        return <stencil-field component="udp-date-selector" {...props} componentProps={{ min: fieldProps?.minDate, max: fieldProps?.maxDate, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.TimeSelector:
        return <stencil-field component="udp-time-selector" {...props} componentProps={{ min: fieldProps?.minTime, max: fieldProps?.maxTime, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.DateTimeSelector:
        return <stencil-field component="udp-datetime-selector" {...props} componentProps={{ max: fieldProps?.maxDateTime, min: fieldProps?.minDateTime, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.FileUpload:
        return <stencil-field component="file-upload" {...props} componentProps={{ fullWidth: true, allowMultiple: false, ...fieldProps }} />;
      case UdpFormsFieldTypeEnum.Paragraph:
        return this.value ? <unity-typography id={`paragraphText${this.question.name}`}variant={this.styleOverrides?.paragraphText?.variant ?? 'body'} >{this.value}</unity-typography> : '';
      case UdpFormsFieldTypeEnum.Hidden:
      default:
        return <div />;
    }
  }
  componentDidLoad(){
    // override the fonts based on style overrides
    const variantsAndOverrides = []
    for(const override in this.styleOverrides){
      variantsAndOverrides.push({
        id:override+this.question.name,
        fontOverride: this.styleOverrides?.[override]?.fontFamily,
        variant: this.styleOverrides?.[override]?.variant
      }
      )
    }
    variantsAndOverrides.forEach(override => {
      if(!fontOverrideMapping[override?.fontOverride] || !this.el || !this.el.shadowRoot) return;
      overrideFont(this.el?.shadowRoot?.getElementById?.(override.id),fontOverrideMapping[override?.fontOverride])

    })
  }
  render() {
    
    const component = this.getFieldComponent();
    const titleText = `${this.question.fieldTypeId === UdpFormsFieldTypeEnum.Paragraph ? '' : `${this.questionNumber}.`} ${this.question.questionText}  ${
      this.question.required && this.question.fieldTypeId !== UdpFormsFieldTypeEnum.Paragraph ? '*' : ''
    }`;
    if (!component) return null;
    return (
      <div class={this.question.fieldTypeId === UdpFormsFieldTypeEnum.Hidden ? 'hidden' : ''}>
        {this.question.questionText ? <unity-typography id={`questionText${this.question.name}`} variant={this.styleOverrides?.questionText?.variant ?? 'h3'} >{titleText}</unity-typography> : ''}
        {component}

        <unity-typography id={`helperText${this.question.name}`} variant={this.styleOverrides?.helperText?.variant ?? 'caption-text'} >{this.question.helperText}</unity-typography>
      </div>
    );
  }
}
