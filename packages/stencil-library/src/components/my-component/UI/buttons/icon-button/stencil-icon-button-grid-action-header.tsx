import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'stencil-icon-button-grid-action-header',
  styleUrl: 'stencil-icon-button-grid-action-header.css',
  shadow: true,
})
export class StencilIconButton {
  @Prop() iconName: string;
  //@Prop() onClick: () => void;
  @Prop() onClick: (event: MouseEvent) => void;
  @Prop() iconClassName: string;
  @Prop() tooltip: string;
  @Prop() icon: any; // Removed the default value
  @Prop() secondary: boolean = false;
  @Prop() noBackground: boolean = false;
  @Prop() darkIcon: boolean = true;
  @Prop() showLabel: boolean = true;

  render() {
    let buttonClass = this.secondary ? 'icon-button-secondary' : 'icon-button'; // conditional class
    let buttonStyle = this.showLabel ? {} : { paddingLeft: '10px', paddingRight: '10px' }; // conditional style

    // Use the 'noBackground' prop to add another conditional class
    if (this.noBackground) {
      buttonClass += ' no-background';
    }

    // Your existing code for setting up the icon
    let iconColor = this.darkIcon ? 'black' : 'white';
    iconColor = this.tooltip.toLowerCase() === 'save view' ? '#1d6bfd' : iconColor;
    const iconData = this.icon; // Removed the default value

    // ToolTip style is being modified in the CSS under title
    return (
      <button class={buttonClass} onClick={this.onClick} title={this.showLabel ? '' : this.tooltip} style={buttonStyle}>
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
        {/* Render slot conditionally based on showLabel */}
        {this.showLabel
          ? !['grid options', 'clear grid'].includes(this.tooltip.toLocaleLowerCase()) && <slot></slot>
          : (this.showLabel || this.tooltip.toLowerCase() === 'save view') && <slot></slot>}
      </button>
    );
  }
}
