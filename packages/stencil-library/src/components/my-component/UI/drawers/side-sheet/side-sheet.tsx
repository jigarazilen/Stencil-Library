import { Component, Prop, h } from '@stencil/core';
import Close24 from '@carbon/icons/es/close/24';

@Component({
  tag: 'side-sheet',
  styleUrl: 'side-sheet.css',
})
export class SideSheet {
  @Prop() open: boolean;
  @Prop() title: string;
  @Prop() buttonLabel: string;
  @Prop() toggleDrawer: () => void;
  @Prop() position: 'left' | 'right' = 'left';
  @Prop() handleSideSheetButton: () => void;
  @Prop() sideSheetButtonLabel: string;
  @Prop() widthOption: 'short' | 'long' | number = 'long';
  @Prop() disabled: boolean = false;
  @Prop() padding: boolean = true;
  @Prop() buttonTransform: string = "translate(0,0)";
  
  render() {
    const widthClass = typeof this.widthOption === 'number' ? 'custom-width' : this.widthOption;
    const sideSheetStyle = typeof this.widthOption === 'number' ? { width: `${this.widthOption}px` } : {};

    return (
      <div>
        <div class={{ 'backdrop': true, 'open': this.open }} onClick={this.toggleDrawer}></div>
        
        <div class={{ 'side-sheet': true, 'open': this.open, 'close': !this.open, [this.position]: true, [widthClass]: true }}
             style={sideSheetStyle}>
          <div class="title">
            <div class='close-button'>
              <stencil-icon-button icon={Close24} onClick={this.toggleDrawer}></stencil-icon-button>
            </div>
            <div class='title'>
              <unity-typography variant="data-display-four">{this.title}</unity-typography>
            </div>
          { this.sideSheetButtonLabel && <custom-button style={{ transform: this.buttonTransform, }} size='tall' disabled={this.disabled} onCustomClick={() => this.handleSideSheetButton()}>
            {this.sideSheetButtonLabel}
          </custom-button>}
          </div>
          
          <side-sheet-container padding={this.padding} >
            <slot></slot>
          </side-sheet-container>
        </div>
      </div>
    );
  }
}

