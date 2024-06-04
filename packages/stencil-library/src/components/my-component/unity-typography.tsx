import { Component, h, Prop } from '@stencil/core';

export type TypographyVariant = 'body' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'caption-text' | 'data-display-one' | 'data-display-two'  | 'data-display-three'  |'data-display-four'  | 'button'; 

@Component({
  tag: 'unity-typography',
  styleUrl: 'typography.css',
  shadow: true
})
export class typography {
  @Prop() variant: TypographyVariant = 'body';

  render() {
    switch (this.variant) {
      case 'h1':
        return <h1><slot /></h1>;
      case 'h2':
        return <h2><slot /></h2>;
      case 'h3':
        return <h3><slot /></h3>;
      case 'h4':
        return <h4><slot /></h4>;
      case 'h5':
        return <h5><slot /></h5>;
      case 'h6':
        return <h6><slot /></h6>;
      case 'caption-text':  // Added case for 'caption-text'
        return <span class="caption-text"><slot /></span>;
      case 'data-display-one':  // Added case for 'data-display-one'
        return <span class="data-display-one"><slot /></span>;
      case 'data-display-two':  // Added case for 'data-display-two'
        return <span class="data-display-two"><slot /></span>;
      case 'data-display-three':  // Added case for 'data-display-two'
        return <span class="data-display-three"><slot /></span>;
      case 'data-display-four':  // Added case for 'data-display-two'
        return <span class="data-display-four"><slot /></span>;
      case 'button':  // Added case for 'data-display-two'
        return <span class="button"><slot /></span>;
      default:
        return <p><slot /></p>;
    }
  }
}
