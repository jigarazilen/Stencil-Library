import { Component, h } from '@stencil/core';

@Component({
  tag: 'udp-column-header',
  styleUrl: 'udp-column-header.css',
  shadow: true
})
export class UdpColumnHeader {
  render() {
    return (
      <div class="header-container">
        <div class="column"> <unity-typography variant="button" >Column  </unity-typography>   </div>
        <div class="operator"><unity-typography variant="button" >Operator </unity-typography> </div>
        <div class="criteria"><unity-typography variant="button" >Criteria  </unity-typography>  </div>
      </div>
    );
  }
}
