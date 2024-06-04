import { Component, Prop, State, h, Event as StencilEvent, EventEmitter, Watch } from '@stencil/core';
export interface UdpSelectorElement extends HTMLElement {
  setDefaultOption: (defaultLabel: string) => void;
}

@Component({
  tag: 'udp-selector',
  styleUrl: 'udp-selector.css',
  shadow: true,
})
export class UdpSelector {
  @Prop() options: Array<{ value: string; label: string }> = [];
  @Prop() defaultOption: string;
  @Prop() large: boolean = false;
  @Prop() multiSelect: boolean = false; // New prop for multi-select functionality
  @State() isOpen = false;
  @Prop() fieldName: string;
  @Prop() label: string;
  @Prop() error: string;
  @Prop() required: boolean;
  @Prop() id: string;
  @State() selectedOptions: Array<{ value: string; label: string }> = []; // For multi-select
  @State() selectedOption: { value: string; label: string } | null = null; // For single-select
  @StencilEvent() optionSelected: EventEmitter;
  @StencilEvent() udpFieldBlur: EventEmitter<Event>;
  @StencilEvent() udpFieldChange: EventEmitter<Object[]>
  
  private selectedOptionRef: HTMLElement;

  componentWillLoad() {
    this.setSelectedOptionToDefault();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    // Toggle 'focused' class based on the isOpen state
    if (this.isOpen) {
      this.selectedOptionRef.classList.add('focused');
    } else {
      this.selectedOptionRef.classList.remove('focused');
      this.selectedOptionRef.blur(); // Optionally blur when closing if no selection is made
    }
  }

  setSelectedOptionToDefault() {
    if (this.defaultOption && this.options.length > 0) {
      const defaultOption = this.options.find(option => option.value === this.defaultOption);
      if (defaultOption) {
        if (this.multiSelect) {
          this.selectedOptions = [defaultOption];
        } else {
          this.selectedOption = defaultOption;
        }
      }
    }
  }

  @Watch('options')
  optionsChanged() {
    this.setSelectedOptionToDefault();
  }

  @Watch('defaultOption')
defaultOptionChanged(newOption: string, oldOption: string) {
    if (newOption !== oldOption) {
        this.setSelectedOptionToDefault();
    }
}

  selectOption(option: { value: string; label: string }) {
    if (this.multiSelect) {
      const isSelected = this.selectedOptions.some(selected => selected.value === option.value);
      if (isSelected) {
        this.selectedOptions = this.selectedOptions.filter(selected => selected.value !== option.value);
      } else {
        this.selectedOptions = [...this.selectedOptions, option];
      }
    } else {
      this.selectedOption = option;
      this.isOpen = false;
    }
    this.emitSelectedOptions();

    // Add or remove selected class based on whether the option is selected
    const selectedOptionIndex = this.options.findIndex(opt => opt.value === option.value);
    if (selectedOptionIndex !== -1) {
      const selectedOptionElement = document.querySelector(`.options-list li:nth-child(${selectedOptionIndex + 1})`);
      if (selectedOptionElement) {
        selectedOptionElement.classList.toggle('selected');
      }
    }
  }

  emitSelectedOptions() {
    let emitValue;
    if (this.multiSelect) {
      emitValue = { fieldName: this.fieldName, value: this.selectedOptions.map(option => option.value) };
    } else {
      emitValue = { fieldName: this.fieldName, value: this.selectedOption ? this.selectedOption.value : null };
    }
    this.optionSelected.emit(emitValue)
    this.udpFieldChange.emit(emitValue)
  }



  render() {
    const selectorClass = {
      'udp-selector': true,
      'udp-selector--large': this.large,
    };

    return (
      <div class={{ ...selectorClass }}>
        {this.label && (
           <unity-typography variant="caption-text">
              <label htmlFor="text-input-3" class="bx--label">
                {this.label}
              </label>
          </unity-typography>
        )}
        <div 
          class="selected-option" 
          onClick={() => this.toggleDropdown()} 
          tabindex="0" 
          role="combobox" 
          aria-haspopup="listbox" 
          aria-expanded={this.isOpen.toString()}
          // no easy way to make unique?
          id={'udpRecord-udp-selector-'+this.id}
          //@ts-ignore
          udprecordid={'udpRecord-udp-selector-'+this.id}
        >
        <unity-typography variant="button">
          <div class="selected-option-label">
            {this.multiSelect
              ? this.selectedOptions.length > 0
                ? this.selectedOptions.map(option => option.label).join(', ')
                : 'Select option(s)'
              : this.selectedOption
              ? this.selectedOption.label
              : 'Select an option'}
          </div>
          </unity-typography>
          {this.multiSelect && this.selectedOptions.length > 0 && <span class="checkmark"></span>}
          <div class="arrow"></div>
        </div>
        {this.isOpen && (
          <ul class="options-list">
            {this.options.map(option => (
              <unity-typography variant="button">
              <li class={this.isOptionSelected(option) ? 'selected' : ''} onClick={() => this.selectOption(option)}>
                {option.label}
                {this.isOptionSelected(option) && <span class="checkmark"></span>}
              </li>
              </unity-typography>
            ))}
          </ul>
        )}
        {this.error && <unity-typography class='error-message' variant='button'>{this.error}</unity-typography>}
      </div>
    );
  }

  isOptionSelected(option: { value: string; label: string }) {
    if (this.multiSelect) {
      return this.selectedOptions.some(selected => selected.value === option.value);
    } else {
      return this.selectedOption && this.selectedOption.value === option.value;
    }
  }
}
