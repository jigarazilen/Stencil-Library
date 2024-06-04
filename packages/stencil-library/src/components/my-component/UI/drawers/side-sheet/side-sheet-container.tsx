import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'side-sheet-container',
  styleUrl: 'side-sheet-container.css',
  shadow: true,
})
export class SideSheetContainer {
  @Prop() padding: boolean = true;

  render() {
    const style = this.padding ? {'padding': '16px'} : {};
    return (
      <div class="container" style={style}>
        <slot />
      </div>
    );
  }
  
}
