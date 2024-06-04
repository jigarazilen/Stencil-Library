import { Component, State, h, Prop, Element, Watch, Method, Event, EventEmitter } from '@stencil/core';
//import Menu16 from '@carbon/icons/es/menu/16';

function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

@Component({
  tag: 'udp-dynamic-container-with-menu',
  styleUrl: 'udp-dynamic-container-with-menu.css',
  shadow: true,
})
export class DynamicContainerWithMenu {
  @Element() el: HTMLElement;
  @State() visibleChildren: any[] | null = null;

  @State() menuChildren = [];
  @State() anchorEl: HTMLElement | null = null;
  containerWidth: number = 0;
  @State() rerender: number = 0;
  @State() renderReady: boolean = false; // a flag to indicate readiness to render
  @State() popoverOpen: boolean = false;
  @Prop() externalToggle: string = '';

  @Prop() menuItems: any[] = []; // renamed from children

  @Event() udpChipClicked: EventEmitter<string>;

  open: boolean = false;
  id: string = '';
  boundCalculateChildren: any;

  constructor() {
    this.boundCalculateChildren = debounce(this.calculateChildren.bind(this), 300);
  }
  
// Was causing a loop when connected to the api
  // connectedCallback() {
  //   this.calculateChildren();
  // }


  componentWillLoad() {
    // This lifecycle hook will be called before the first render,
    // ensuring calculateChildren is called before the component renders
    // this.calculateChildren();
  }

  componentWillUpdate() {
    // This lifecycle hook will be called before every update (re-render),
    // ensuring calculateChildren is called before the component re-renders
    // this.calculateChildren();
  }

  
  


  @Method()
  async calculateChildren() {
    if (!this.el.shadowRoot) return;
  
    console.log('Calculating children...');
    console.log('Menu Items:', JSON.stringify(this.menuItems));
    
    const container: HTMLElement | null = this.el.shadowRoot.querySelector('.container')  ;
    console.log('Container:', container);


    
    if (container) {
      this.containerWidth = container.offsetWidth ;
      console.log('Container Width:', this.containerWidth);
    }
  
    let currentWidth = 0;
    const newVisibleChildren = [];
    const newMenuChildren = [];
  
    this.menuItems.forEach((child) => {
      if (child) {
        const childWidth = (child as any).props?.width || 100;
        // console.log(`Child[${index}] Width:`, childWidth);
        
        if (currentWidth + childWidth <= this.containerWidth) {
          currentWidth += childWidth;
          newVisibleChildren.push(child);
        } else {
          newMenuChildren.push(child);
        }
      }
    });

    
    this.visibleChildren = [...newVisibleChildren];
    this.menuChildren = [...newMenuChildren];
    this.rerender += 1;
  }
  

  @Watch('menuItems')
  childrenChanged() {
    this.calculateChildren();
  }

  async componentDidLoad() {
    // Existing logic
    await this.calculateChildren().then(() => {
      this.renderReady = true;  // set the flag to true after calculating
    });
    window.addEventListener('resize', this.boundCalculateChildren);

    // New logic for listening to stencil-chip click events
    const chips = Array.from(document.querySelectorAll('stencil-chip'));
    chips.forEach(chip => {
      chip.addEventListener('chipClicked', (event: CustomEvent) => {
        // Forward this data to the upper-level parent
        const chipText = event.detail;
        this.handleChipClick(chipText);
      });
    });
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.boundCalculateChildren);
  }

  // handlePopoverClick(event?: Event) {
  //   if (!event) return;
  //   this.anchorEl = event.target as HTMLElement;
  //   this.open = Boolean(this.anchorEl);
  //   this.id = this.open ? 'simple-popover' : undefined;
  // }

  // handlePopoverClose() {
  //   this.anchorEl = null;
  //   this.open = false;
  // }

  handlePopover = () => {
    this.popoverOpen = !this.popoverOpen;
  }


  // handleChipClick = (event: CustomEvent) => {
  //   const chipLabel = event.detail;
   
  // }

  handleChipClick(chipText: string) {
    this.udpChipClicked.emit(chipText);
  }


  render() {
  
    return (
      <div class="container">
        {/* <div class="chips">
          {this.visibleChildren && this.visibleChildren.map((child, index) => (
            <stencil-chip color="secondary" key={index} text={child.label} show-delete="false" > </stencil-chip>
          ))}
        </div> */}

<div class="chips">
{console.log('Received data for chips via executeQwith', this.visibleChildren)}
      {this.visibleChildren && this.visibleChildren.map((child, index) => (
        <stencil-chip
          color="secondary"
          key={index}
          text={child.description
          }
          show-delete="false"
          externalToggleString={this.externalToggle}
        >
        </stencil-chip>
      ))}
      
    </div>


    <div class="overflow" >
      {/* @todo: overflow button commented out */}
        {/* <stencil-icon-button showLabel={false}  icon={Menu16}  onClick={this.handlePopover}></stencil-icon-button> */}
        <udp-pop-over isOpen={this.popoverOpen} anchorElement={document.getElementById('anchorElement')}>
            <div class="menu" >
            {this.menuChildren && this.menuChildren.map((child, index) => (
                        <stencil-chip key={index} text={child.label}  show-delete="false" > </stencil-chip>
            ))}
            </div>
        </udp-pop-over>
       
        </div>      
      </div>
    );
  }
  
  

}
