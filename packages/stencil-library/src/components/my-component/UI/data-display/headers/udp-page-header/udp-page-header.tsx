import { Component, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'udp-page-header',
  styleUrl: 'udp-page-header.css',
  shadow: true
})
export class UdpColumnHeader {
  
  @Event() valueChanged: EventEmitter;
  @State() selectedValue: string = '1'; // '1' corresponds to the "And" radio button

  radioClicked(value: string) {
    this.selectedValue = value;
    this.valueChanged.emit(value);
  }

  render() {
    return (
      <div class="header-container">
        <div class="title"> 
          <unity-typography variant="button">Filter Conditions </unity-typography>   
        </div>
        <div class="radio-group"> 
          <div onClick={() => this.radioClicked('1')}>
            <udp-radio-button name="group1" value="1" label="And" checked={this.selectedValue === '1'}></udp-radio-button>
          </div>
          <div onClick={() => this.radioClicked('2')}>
            <udp-radio-button name="group1" value="2" label="Or" checked={this.selectedValue === '2'}></udp-radio-button>
          </div> 
        </div>
      </div>
    );
  }
}
