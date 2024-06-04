import { Component, Prop, h, State, Watch } from '@stencil/core';
import Save16 from '@carbon/icons/es/save/16';
import Close16 from '@carbon/icons/es/close/16';
import List16 from '@carbon/icons/es/list/16';
import Download16 from '@carbon/icons/es/download/16';
import Settings16 from '@carbon/icons/es/settings/16';
import Star16 from '@carbon/icons/es/star/16';
import AdvancedQuery16 from '@carbon/icons/es/ibm-watson--discovery/16'

@Component({
  tag: 'grid-primary-bar',
  styleUrl: 'grid-primary-bar.css',
  shadow: true,
})
export class GridPrimaryBar {
  @Prop() title: string;
  @Prop() hiddenActionButtons: string[] = [];
  @Prop() hiddenLabels: string[] = [];
  @Prop() actionButtons: any[] = [];
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
  @Prop() customShowHotlistClick?: (event?: MouseEvent) => void;
  @Prop() customShowCustomSearchClick?: (event?: MouseEvent) => void;
  @Prop() customToggleServerClientClick?: (event?: MouseEvent) => void;
  @Prop() customAdvancedSearchClick?: (event?: MouseEvent) => void;
  @Prop() customInsightsClick?: (event?: MouseEvent) => void;
  @Prop() customShowGridOptionsClick?: (event?: MouseEvent) => void;
  @Prop() showAdvancedSearchFeature: boolean = true; 
  @Prop() showFilterColumnFeature: boolean = true; 
  @Prop() showGridOptions: boolean = true;
  @Prop() showHotlistButton: boolean = false;

  @State() defaultActionButtons: any[] = [];
  @State() showLabels: boolean = true;

  checkWindowWidth(){
    const windowWidth = window.innerWidth;
    this.showLabels = windowWidth >= 1000;
  }

  @Watch('window:resize')
  onResize() {
    this.checkWindowWidth();
  }

  componentWillLoad() {
    console.log("customSaveViewClick received:", this.customSaveViewClick);
    console.log("primaryActionClick received:", this.primaryActionClick);

    this.checkWindowWidth();

    this.defaultActionButtons = [
      {
        icon: Save16,
        tooltip: 'Save View',
        label: 'Save View',
        visible: true,
        showLabel: true,
        iconClassName: 'save-icon-class',
        clickHandler: this.customSaveViewClick,
        //secondary: true - @todo: used to remove the white background on the button in the toolbar
      },
      {
        icon: Star16,
        tooltip: 'Views',
        label: 'Views',
        visible: true,
        showLabel: true,
        iconClassName: 'save-icon-class',
        clickHandler: this.customShowViewClick
      },
      {
        icon: List16,
        tooltip: 'Hotlists',
        label: 'Hotlists',
        visible: true,
        showLabel: true,
        iconClassName: 'save-icon-class',
        clickHandler: this.customShowHotlistClick
      },
      {
        icon: Download16,
        tooltip: 'Export',
        label: 'Export',
        visible: true,
        showLabel: true,
        iconClassName: 'size-to-fit-icon-class',
        clickHandler: this.customExportClick
      },
      {
        icon: AdvancedQuery16,
        tooltip: 'Search',
        label: 'Search',
        visible: true,
        showLabel: true,
        iconClassName: 'save-icon-class',
        clickHandler: this.customShowCustomSearchClick
      },
      {
        icon: Close16,
        tooltip: 'Clear Grid',
        label: 'Clear Grid',
        visible: true,
        showLabel: false,
        iconClassName: 'save-icon-class',
        clickHandler: this.customClearClick
      },
    ];

    if (this.showHotlistButton == false) {
      const defaultActionButtonsNoHotlist = this.defaultActionButtons.filter((obj: { label: string }) => obj.label !== 'Hotlists');
      this.defaultActionButtons = defaultActionButtonsNoHotlist;
    }

    if (this.showGridOptions) {
      this.defaultActionButtons.push({
        icon: Settings16,
        tooltip: 'Grid Options',
        label: 'Grid Options',
        visible: true,
        showLabel: false,
        iconClassName: 'save-icon-class',
        clickHandler: this.customShowGridOptionsClick
      });
    }

  }

  componentDidLoad() {
    // Add event listener for window resize
    window.addEventListener('resize', this.checkWindowWidth.bind(this));
  }

  disconnectedCallback() {
    // Remove event listener when component is unloaded
    window.removeEventListener('resize', this.checkWindowWidth.bind(this));
  }

  render() {
    return (
      <div class="header-bar" >
        <div class="title-section">
          <div> <unity-typography variant="h4"  >{this.title}  </unity-typography> </div>
            
          {/* <div> <slot></slot> </div> */}
        </div>
        <div class="button-section">
          <div> <slot></slot> </div>
          
          {this.defaultActionButtons.map((btn) => {

            const clickHandler = (event?: MouseEvent) => {
              if (btn.clickHandler) {
                btn.clickHandler(event);
              } else {
                console.log(`${btn.label} Clicked but no custom handler defined`);
              }
            };

            if (!this.hiddenActionButtons.includes(btn.label) && btn.visible) {
              return (
                <stencil-icon-button-grid-action-header 
                showLabel={this.showLabels}
                secondary={btn.secondary}
                icon={btn.icon}
                  onClick={clickHandler}
                  tooltip={btn.tooltip}
                  iconClassName={btn.iconClassName}
                >
                  {btn.icon && <i class={btn.icon}></i>}
                  {btn.label.toLowerCase() === "save" || (!this.hiddenLabels.includes(btn.label) && btn.showLabel) ? <span>{btn.label}</span> : null}
                </stencil-icon-button-grid-action-header>
              );
            }
            return null;
          })}
          {/* <custom-button label="Primary Action Button" onClick={(event: MouseEvent) => this.primaryActionClick(event)}> Add</custom-button> */}
        </div>
      </div>
    );
  }
}
