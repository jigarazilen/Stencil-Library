import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'ambient-demo-container',
  styleUrl: 'ambient-demo-container.css',
  shadow: true,
})
export class AmbientDemoContainer {
  @Prop() title: string;

  render() {
    return (
      <div class="container">
        <div class="title-container" > <unity-typography variant="button"> {this.title} </unity-typography> </div>
        
        <slot></slot>
      </div>
    );
  }
}
 