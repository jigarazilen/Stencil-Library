import { Component, Prop, h } from '@stencil/core';
import iconMapping from '../icons/iconMapping';



@Component({
  tag: 'primary-action-header',
  styleUrl: 'primary-action-header.css',
  shadow: true,
})
export class PrimaryActionHeader {
  @Prop() title: string;
  @Prop() hiddenActionButtons: string[] = [];
  @Prop() hiddenLabels: string[] = [];
  @Prop() actionButtons: any[] = [];
  @Prop() defaultActionButtons: any[] = [];
  @Prop() customSaveViewClick?: (event?: MouseEvent) => void;
  @Prop() customSizeToFitClick?: (event?: MouseEvent) => void;
  @Prop() customExportClick?: (event?: MouseEvent) => void;
  @Prop() primaryActionClick?: (event?: MouseEvent) => void;
  @Prop() customColumnViewClick?: (event?: MouseEvent) => void;
  @Prop() customFitColumnClick?: (event?: MouseEvent) => void;
  @Prop() customFilterViewClick?: (event?: MouseEvent) => void;
  @Prop() customClearClick?: (event?: MouseEvent) => void;
  @Prop() customExpandClick?: (event?: MouseEvent) => void;
  @Prop() customShowViewClick?: (event?: MouseEvent) => void;
  @Prop() activeTabIndex: number;
  @Prop() selectTab: (index: number) => void;
  @Prop() tabs: boolean = true;
  @Prop() actionButtonLabel: string = '';
//   @State() activeTabIndex: number = 0;



getIconComponent(icon: string | Function, customIcon: Function) {
  if (customIcon) {
    return customIcon;
  }

  if (typeof icon === 'string') {
    return iconMapping[icon];
  }
  
  return icon; // or handle the 'Function' type however you need to
}



  renderIcon(ActualIcon: any) {
    if (ActualIcon && ActualIcon.elem === 'svg') {
      return (
        <svg {...ActualIcon.attrs}>
          {ActualIcon.content.map((content: any, index: number) => {
            return <path key={index} {...content.attrs} />;
          })}
        </svg>
      );
    }
    return null;
  }

//   selectTab(index: number) {
//     this.activeTabIndex = index;
//   }


  
  render() {

    console.log('active tab',  this.activeTabIndex)

    return (
      <div class="header-bar">
        <div class="title-section">
          <unity-typography variant="h4">{this.title}</unity-typography>
        </div>

    {this.tabs && <div  class="tabs" > 
        <udp-tabs>
      <button 
        class={this.activeTabIndex === 0 ? 'active' : ''} 
        slot="tab-title" 
        onClick={() => this.selectTab(0)}
      >
        Demo Grid
      </button>
      <button 
        class={this.activeTabIndex === 1 ? 'active' : ''} 
        slot="tab-title" 
        onClick={() => this.selectTab(1)}
      >
        Other Content
      </button>
    </udp-tabs>
        </div>}



        <div class="button-section">
          {this.defaultActionButtons.map((btn) => {
  
            // Determine the actual icon to use
            const ActualIcon = this.getIconComponent(btn.icon, btn.customIcon);
  
            const clickHandler = (event?: MouseEvent) => {
              if (btn.clickHandler) {
                btn.clickHandler(event);
              } else {
                console.log(`${btn.label} Clicked but no custom handler defined`);
              }
            };
  
            if (!this.hiddenActionButtons.includes(btn.label) && btn.visible) {
              return (
                <stencil-icon-button
                  secondary={btn.secondary}
                  onClick={clickHandler}
                  tooltip={btn.tooltip}
                  class={btn.iconClassName}
                >
                  {/* Render icon directly */}
                  {this.renderIcon(ActualIcon)}

                  {/* Show label if it's not hidden and should be shown */}
                  {!this.hiddenLabels.includes(btn.label) && btn.showLabel && <span>{btn.label}</span>}
                </stencil-icon-button>
              );
            }
            return null;
          })}
          {  !this.actionButtonLabel && <div class="right-margin" /> }
        
         { this.actionButtonLabel && <custom-button label="Primary Action Button" onClick={(event: MouseEvent) => this.primaryActionClick(event)}>{this.actionButtonLabel} </custom-button>}
        </div>
      </div>
    );
  }
}
