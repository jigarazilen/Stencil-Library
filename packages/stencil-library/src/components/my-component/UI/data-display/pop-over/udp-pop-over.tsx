import { Component, h, Prop, Element, Watch } from '@stencil/core';

@Component({
  tag: 'udp-pop-over',
  styleUrl: 'udp-pop-over.css',
  shadow: true,
})
export class UdpPopOver {
  @Prop() isOpen: boolean = false;
  @Prop() anchorElement: HTMLElement;

  @Element() el: HTMLElement;

  componentWillLoad() {
    if (this.isOpen) {
      document.addEventListener('click', this.handleClose);
    }
    document.removeEventListener('click', this.handleClose);
  }

  @Watch('isOpen')
  watchHandler(newValue: boolean) {
    if (newValue) {
      document.addEventListener('click', this.handleClose);
    } else {
      document.removeEventListener('click', this.handleClose);
    }
  }

  handleClose = (event?: Event) => {
    if (event && this.el.shadowRoot.contains(event.target as Node)) {
      return; // Clicked inside, do nothing
    }
    this.isOpen = false;
    document.removeEventListener('click', this.handleClose);
  };

  render() {
    const style = {
      display: this.isOpen ? 'block' : 'none',
      position: 'absolute',
    };

    if (this.anchorElement) {
      const rect = this.anchorElement.getBoundingClientRect();
      style['top'] = `${rect.bottom}px`;
      style['left'] = `${rect.left}px`;
    }

    return (
      <div class="popover" style={style}>
        <unity-typography variant="caption-text">
          <slot></slot>
        </unity-typography>
      </div>
    );
  }
}
