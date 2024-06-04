import { Component, Prop, h, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'custom-button',
  styleUrl: 'custom-button.css',
  shadow: true,
})
export class CustomButton {
  @Element() el: HTMLElement;
  @Prop() label: string;

  @Prop() variant: 'default' | 'outline' = 'default';
  @Prop() secondary: boolean = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() disabled: boolean = false; 
  @Prop() size: 'default' | 'short' | 'tall' = 'default'; 

  @Event() customClick: EventEmitter<void>;

  handleButtonClick = (event: Event) => {
    if (this.type === 'submit') {
      event.preventDefault();
    }
    if (!this.disabled) {
      this.customClick.emit();
    }
  }

  render() {
    let buttonClass = 'my-button';

    if (this.variant === 'outline') {
      buttonClass += ' my-button--outline';
    } else if (this.secondary) {
      buttonClass += ' my-button--secondary';
    }

    if (this.size === 'short') {
      buttonClass += ' my-button--short';
    } else if (this.size === 'tall') {
      buttonClass += ' my-button--tall';
    }
    

    return (
      <button type={this.type} class={buttonClass} onClick={this.handleButtonClick} disabled={this.disabled}>
        {this.label}
        <slot></slot>
      </button>
    );
  }
}
