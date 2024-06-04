import { Component, h, Prop, State, Element, Watch, Listen } from '@stencil/core';

@Component({
  tag: 'chip-section',
  styleUrl: 'chip-section.css',
  shadow: true
})
export class ChipSection {
  @Element() el: HTMLElement;

  // Props
  @Prop() filterChips: Array<any> = [];
  @Prop() viewChips: Array<any> = [];
  @Prop() menuItems: Array<any> = [];
  @Prop() additionalFilterChips: Array<any> = [];
  @Prop() hideKpiSection: boolean = false;
  @Prop() kpiValues: Array<any> = [];
  @Prop() maxKPIsDisplayed: number = 4;
  @Prop() handleDelete: Function;

  // States
  @State() allFilterChips: Array<any>;
  @State() visibleFilterChips: Array<any>;
  @State() anchorEl: any = null;
  @State() chipsReceived: boolean = false;
  @State() selectedFilterChip: any = null;

  chipSectionContainer!: HTMLElement;
  viewChipsContainer!: HTMLElement;
  filterChipsContainer!: HTMLElement;
  additionalFilterChipsContainer!: HTMLElement;
  kpiContainer!: HTMLElement;

  // Watchers and lifecycle methods
  @Watch('filterChips')
  filterChipsChanged(newValue: any) {
    if (!this.chipsReceived && newValue.length > 0) {
      this.allFilterChips = newValue;
      this.visibleFilterChips = newValue;
    }
  }

  componentWillLoad() {
    // Equivalent to useEffect
    console.log("componentWillLoad in ChipSection", this.filterChips);
    if (!this.chipsReceived && this.filterChips.length > 0) {
      this.allFilterChips = this.filterChips;
      this.visibleFilterChips = this.filterChips;
    }
  }

  
  componentDidLoad() {
    console.log("componentDidLoad in ChipSection");
    this.chipSectionContainer = this.el.shadowRoot!.querySelector('#chipSectionContainer') as HTMLElement;
    this.viewChipsContainer = this.el.shadowRoot!.querySelector('#viewChipsContainer') as HTMLElement;
    this.filterChipsContainer = this.el.shadowRoot!.querySelector('#filterChipsContainer') as HTMLElement;
    this.additionalFilterChipsContainer = this.el.shadowRoot!.querySelector('#additionalFilterChipsContainer') as HTMLElement;
    this.kpiContainer = this.el.shadowRoot!.querySelector('#kpiContainer') as HTMLElement;
  }

  // Helper Functions
    abbrNum =  (number, decPlaces) => {
        if (typeof number === 'string' && !isNaN(Number(number))) {
          number = Number(number);
        } else if (typeof number !== 'number') {
          throw new Error(
            'The input must be a number or a string that can be converted to a number.'
          );
        }
    
        if (typeof decPlaces !== 'number') {
          return null;
        }
    
        decPlaces = Math.pow(10, decPlaces);
        let abbrev = ['k', 'm', 'b', 't'];
    
        for (let i = abbrev.length - 1; i >= 0; i--) {
          let size = Math.pow(10, (i + 1) * 3);
    
          if (size <= number) {
            number = Math.round((number * decPlaces) / size) / decPlaces;
    
            if (number === 1000 && i < abbrev.length - 1) {
              number = 1;
              i++;
            }
    
            number += abbrev[i];
            break;
          }
        }
    
        return number;
      };


  isEmpty = (array) => Array.isArray(array) && array.length === 0;


  abbreviateLabel = (label) => {
    const maxLength = 10;

    if (label.length > maxLength) {
      const newLabel = label.slice(0, maxLength - 3) + '...';
      return newLabel;
    } else {
      return null;
    }
  };

  handleFilterChipToggle = (chip) => {
    this.selectedFilterChip = chip; // <-- changed here
  
    if (typeof chip.onToggle === 'function') {
      chip.onToggle();
    }
  };
  
  handleFilterChipUntoggle = () => {
    if (this.selectedFilterChip) {
      // if the user wants extra functionality when the filter chip is untoggled, call the function
      if (typeof this.selectedFilterChip.onUntoggle === 'function') {
        this.selectedFilterChip.onUntoggle();
      }
  
      this.selectedFilterChip = null; // <-- changed here
    }
  };
  

  @Listen('click', { capture: true })
  handleClick(ev) {
    console.log("Click event", ev);
  }

  render() {
    console.log("Rendering ChipSection", this.visibleFilterChips);
    return (
        <div class="wrapper" id="chipSectionContainer">
          <div class="chipHolder">
          
            {/* Your View Chips */}
            <div id="viewChipsContainer">
              {this.viewChips.map((chip, index) => (
                <stencil-chip
                  onOnDelete={() => this.handleDelete('view', index)}
                  text={chip.label}
                  class="viewChip"
                ></stencil-chip>
              ))}
            </div>
  
            {/* Dynamic filter chip container */}
            <udp-dynamic-container-with-menu id="filterChipsContainer"  menuItems={this.menuItems} >
  {this.selectedFilterChip && (
    <stencil-chip
      onOnDelete={this.handleFilterChipUntoggle}
      text={this.selectedFilterChip.label}
      class="viewChip"
    ></stencil-chip>
  )}
{console.log('filtering here...', this.filterChips)}
  {this.filterChips.map((chip) => {
    if (this.selectedFilterChip && chip.id === this.selectedFilterChip.id) {
      console.log('returning null...')
      return null;
    }
    return (
      <stencil-chip
        text={`${chip.label} ${chip.value}`}
        class="filterChip"
        onClick={() => this.handleFilterChipToggle(chip)}
      ></stencil-chip>
    );
  })}

</udp-dynamic-container-with-menu>
  
            {/* {this.filterChips.map((chip, index) => {
              if (this.selectedFilterChip && chip.id === this.selectedFilterChip.id) {
                return null;
              }
              return (
                <stencil-chip
                  text={`${chip.label} ${chip.value}`}
                  class="filterChip"
                  onClick={() => this.handleFilterChipToggle(chip)}
                ></stencil-chip>
              );
            })} */}
  
            {/* Your Additional Filter Chips */}
            <div id="additionalFilterChipsContainer">
              {this.additionalFilterChips.map((chip, index) => (
                <stencil-chip
                  onOnDelete={() => this.handleDelete('additionalFilter', index)}
                  text={chip.label}
                  class="additionalFilterChip"
                ></stencil-chip>
              ))}
            </div>
  
            {/* KPI Section */}
            {!this.hideKpiSection && (
              <div class="KPI" id="kpiContainer">
                {this.kpiValues.slice(0, this.maxKPIsDisplayed).map((kpi) => (
                  <div class="kpiItem">
                    <span class="kpiLabel">{this.abbreviateLabel(kpi.label) || kpi.label}</span>
                    <span class="kpiValue">{this.abbrNum(kpi.value, 1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
  }
  

}
