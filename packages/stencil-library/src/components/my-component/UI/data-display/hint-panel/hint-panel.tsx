import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'hint-panel',
  styleUrl: 'hint-panel.css',
  shadow: true,
})
export class HintPanel {
  @Prop() hint: string;
  @Prop() hideHintText: string;
  @State() showHint: boolean = true;

  handleHideHint = () => {
    this.showHint = false;
  };

  render() {
    return (
      <div class="hint-container">
        {this.showHint && (
          <div class="hint-content">
            <div><unity-typography variant='body' >  {this.hint} </unity-typography>
             
              </div>
            <div class="hide-help">
              <button class="hide-hint-button" onClick={this.handleHideHint}>
                {this.hideHintText}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
}
