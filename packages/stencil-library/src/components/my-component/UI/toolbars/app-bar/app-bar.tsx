import { Component, Prop, h } from '@stencil/core';
import Menu24 from '@carbon/icons/es/menu/24';

@Component({
  tag: 'app-bar',
  styleUrl: 'app-bar.css',
  shadow: true
})
export class AppBar {
  @Prop() username: string;

    render() {

    return (
      <div class="header">
        <stencil-icon-button noBackground darkIcon={false} icon={Menu24}  ></stencil-icon-button>
         <unity-typography variant='data-display-one'> <slot></slot>   </unity-typography>  
        <a class="skip-to-content" href="#main-content">Skip to main content</a>
        <div class="header__logo">
          {/* Logo here */}
        </div>
        <div class="header__nav" role="navigation" aria-label="Carbon Design System">
          {/* Navigation here */}
        </div>
        <div class="header__global">
          {/* Global actions here */}
          <udp-avatar username={this.username}/>
        </div>
      </div>
    );
  }
}
