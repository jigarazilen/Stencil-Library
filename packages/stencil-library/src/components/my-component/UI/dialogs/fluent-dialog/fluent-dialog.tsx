import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'fluent-dialog',
  styleUrl: 'fluent-dialog.css',
  shadow: true
})
export class FluentDialog {
  @Prop() title: string;
  @Prop() message: string;
  @Prop() actionOne: Function;
  @Prop() actionTwo: Function;
  @Prop() labelOne: string;
  @Prop() labelTwo: string;
  @Prop() open: boolean;
  @Prop() handleClose: Function;
  @Prop() ariaLabelledby: string;
  @Prop() ariaDescribedby: string;
  @Prop() titleId: string;
  @Prop() descriptionId: string;
  @Prop() buttonOneHidden: boolean = false;
  @Prop() buttonTwoHidden: boolean = false;
  @Prop() disableOne: boolean;
  @Prop() disableTwo: boolean;
  @Prop() progress: number;

  render() {
    return (
      <div class={{ 'overlay': true, 'overlay-open': this.open }}>
        <div class={{ 'dialog-container': true, 'dialog-open': this.open }}>
          <div class="dialog-title" id={this.titleId}>
            <unity-typography variant="h3">{this.title}</unity-typography>
          </div>
          <div class="dialog-content">
            <unity-typography variant="h6">{this.message}</unity-typography>
            <unity-typography variant="body">  <slot />  </unity-typography>
          </div>
          <div class="dialog-actions">
            {!this.buttonTwoHidden && (
              <custom-button  size="tall" variant="outline" onClick={() => this.actionTwo()}>
                {this.labelTwo}
              </custom-button>
            )}
            {!this.buttonOneHidden && (
              <custom-button
                class="primary-action"
                onClick={() => this.actionOne()}
                size="tall"
                disabled={this.disableOne}
              >
                {this.labelOne}
              </custom-button>
            )}
          </div>
          {this.progress && <div class="linear-progress"></div>}
        </div>
      </div>
    );
  }
  
}
