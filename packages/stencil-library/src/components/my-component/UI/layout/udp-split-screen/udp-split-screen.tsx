import { Component, Prop, State, Method, h } from '@stencil/core';

@Component({
  tag: 'udp-split-screen',
  styleUrl: 'udp-split-screen.css',
  shadow: true,
})
export class UdpSplitScreen {
  @Prop() panelContent: string;
  @State() isOpen: boolean = true;
  @State() panelWidth: number = 75;
  @State() isDragging: boolean = false; // Track dragging state

  private element: HTMLElement;

  @Method()
  async toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  componentDidLoad() {
    this.element.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDragging = true;
      //this.element.style.cursor = 'grabbing'; // Change to grabbing when dragging starts
      // Prevent default to avoid any text selection or other default actions
      event.preventDefault();
    });

    // Attach mousemove and mouseup at the document level to ensure smooth dragging
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.isDragging) return;
      if (this.isDragging) {
        const bounds = this.element.getBoundingClientRect();
        const newWidth = ((event.clientX - bounds.left) / bounds.width) * 100;
        this.panelWidth = Math.max(2, Math.min(newWidth, 98)); // Adjusted for a bit of margin
      }
      this.handleDrag(event);
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        //this.element.style.cursor = 'ew-resize'; // Revert cursor when dragging ends
      }
    });
  }


  private handleDrag = (event: MouseEvent) => {
    console.log("Dragging");
    const bounds = this.element.getBoundingClientRect();
    const newWidth = ((event.clientX - bounds.left) / bounds.width) * 100;
    const adjustedWidth = Math.max(2, Math.min(newWidth, 98)); // Keep your existing constraints
  

    localStorage.setItem('panelWidth', this.panelWidth.toString()); 

    if (this.panelWidth !== adjustedWidth) {
      this.panelWidth = adjustedWidth;
      localStorage.setItem('panelWidth', this.panelWidth.toString()); 
    }
  };
  

  async componentWillLoad() {
    const savedWidth = localStorage.getItem('panelWidth');
    if (savedWidth) {
      this.panelWidth = parseFloat(savedWidth);
    }
  }
  

  render() {
    return (
      <div ref={(el) => this.element = el as HTMLElement} class={{ 'container': true, 'open': this.isOpen }}>
        <div class="panel" style={{ width: `${this.panelWidth}%` }}>
          <slot name="first-panel"></slot>
        </div>
        <div class="resizer" onMouseDown={(event) => event.preventDefault()}>
          <div class="drag-handle"></div>
        </div>
        <div class="panel" style={{ width: `${100 - this.panelWidth}%` }}>
          <slot name="second-panel">{this.panelContent}</slot>
        </div>
      </div>
    );
  }
}
