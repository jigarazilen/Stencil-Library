// udp-menu-item.tsx
import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'udp-menu-item',
  styleUrl: 'udp-menu-item.css',
  shadow: true
})
export class UdpMenuItem {
  @Prop() label: string;

  @Event() itemClick: EventEmitter;

  handleItemClick = () => {
    this.itemClick.emit();
  }

  render() {
    return (
      <div 
        class="menu-item-root" 
        onClick={this.handleItemClick}
        id={"udpRecord-udp-menu-item-ItemClick"}
        //@ts-ignore
        udprecordid={"udpRecord-udp-menu-item-ItemClick"}
      >
        <span class="menu-item-label">
         <unity-typography variant='button' > {this.label} </unity-typography> 
        </span>
      </div>
    );
  }
}
