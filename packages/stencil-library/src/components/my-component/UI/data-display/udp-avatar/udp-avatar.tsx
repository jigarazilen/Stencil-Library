import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'udp-avatar',
  styleUrl: 'udp-avatar.css',
  shadow: true,
})
export class UdpAvatar {
  @Prop() username: string;

  private colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFC107', '#FF9800', '#FF5722', '#795548',
  ];

  getInitial() {
    return this.username ? this.username[0].toUpperCase() : '?';
  }

  getColor() {
    const charCode = this.username ? this.username.charCodeAt(0) : 0;
    return this.colors[charCode % this.colors.length];
  }

  render() {
    return (
      <div class="avatar" style={{ 'background-color': this.getColor() }}>
        <unity-typography variant='data-display-two' > {this.getInitial()}</unity-typography>
       
      </div>
    );
  }
}
