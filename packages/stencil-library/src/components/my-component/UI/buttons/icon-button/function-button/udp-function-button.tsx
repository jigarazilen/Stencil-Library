import { Component, Prop, h } from '@stencil/core';
import './udp-function-button.css';
import AddIcon16 from '@carbon/icons/es/add/16';
import ChevronDownIcon24 from '@carbon/icons/es/chevron--down/16';
import View16 from '@carbon/icons/es/view/16';
import TrashCan16 from '@carbon/icons/es/trash-can/16';
// import FlagFilled16 from '@carbon/icons/es/flag--filled/16'
import Star16 from '@carbon/icons/es/star/16';
import StarFilled16 from '@carbon/icons/es/star--filled/16';
import Edit16 from '@carbon/icons/es/edit/16'

@Component({
  tag: 'udp-function-button',
  styleUrl: 'udp-function-button.css',
  shadow: true
})
export class UdpFunctionButton {
  @Prop() expand: boolean = false;
  @Prop() view: boolean = false; 
  @Prop() add: boolean = false; 
  @Prop() edit: boolean = false;
  @Prop() delete: boolean = false; 
  @Prop() isDefault: boolean = false;
  @Prop() noBackground: boolean = false;  // New property for controlling background

  renderIcon() {
    let icon;
    let iconStyles = {};

    if (this.delete) {
      icon = TrashCan16;
      iconStyles = { padding: '5px' }; 
    } else if (this.view) {
      icon = View16;
      iconStyles = { padding: '5px' }; 
    } else if (this.isDefault) {
      icon = StarFilled16;
      iconStyles = { padding: '5px' };
    } else if (this.add) {
      icon = AddIcon16; 
      iconStyles = { padding: '5px' };
    } else if (this.edit) {
      icon = Edit16; 
      iconStyles = { padding: '5px' };
    } else if (this.expand) { 
      icon = ChevronDownIcon24; 
      iconStyles = { padding: '5px', color: 'black'}; 
    } else {
      icon = Star16;
      iconStyles = { padding: '5px' };
    }
    
    return (
      <svg {...icon.attrs} style={iconStyles}>
        {icon.content.map((item, index) => {
          if (item.elem === 'path') {
            return <path {...item.attrs} key={index} />;
          }
          return null;
        })}
      </svg>
    );
  }

  render() {
    const btnClass = this.noBackground ? 'udp-btn no-bg' : 'udp-btn';
    return (
      <button class={btnClass}>
        <span class="btn-content">
          {this.renderIcon()}
        </span>
      </button>
    );
  }
}

