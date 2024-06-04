import { Component, Prop, h } from '@stencil/core';
 
@Component({
  tag: 'stencil-icon-button',
  styleUrl: 'stencil-icon-button.css',
  shadow: true,
})
export class StencilIconButton {
  @Prop() iconName: string;
  //@Prop() onClick: () => void;
  @Prop() onClick: (event: MouseEvent) => void;
 
  @Prop() iconClassName: string;
  @Prop() tooltip: string;
  @Prop() icon: any;  // Removed the default value
  @Prop() secondary: boolean = false;
  @Prop() noBackground: boolean = false;
  @Prop() darkIcon: boolean = true;
  @Prop() showLabel: boolean = true;  
 
  render() {
    let buttonClass = this.secondary ? 'icon-button-secondary' : 'icon-button'; // conditional class
    let buttonStyle = this.showLabel ? {} : { paddingLeft: '10px', paddingRight: '10px' };  // conditional style
 
    // Use the 'noBackground' prop to add another conditional class
    if (this.noBackground) {
      buttonClass += ' no-background';
    }
 
    // Your existing code for setting up the icon
    const iconColor = this.darkIcon ? 'black' : 'white';
    const iconData = this.icon;  // Removed the default value
 
    return (
      <udp-ambient-tool-tip content={this.showLabel ? '' : this.tooltip}>
        <button class={buttonClass} onClick={this.onClick} title={this.showLabel ? this.tooltip : ''} style={buttonStyle}>
          {/* Conditionally render the icon if one is provided */}
          {iconData && (
            <svg {...iconData.attrs} fill={iconColor}>
              {iconData.content.map((item, index) => {
                if (item.elem === 'path') {
                  return <path {...item.attrs} key={index} />;
                }
                return null;
              })}
            </svg>
          )}
          {this.showLabel && <slot></slot>}
        </button>
      </udp-ambient-tool-tip>
    );
  }
}