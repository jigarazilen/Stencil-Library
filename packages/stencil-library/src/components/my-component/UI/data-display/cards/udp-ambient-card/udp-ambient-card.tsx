import { Component, State, h, Prop } from '@stencil/core';
import ChevronDown16 from '@carbon/icons/es/chevron--down/16';
import ChevronUp16 from '@carbon/icons/es/chevron--up/16';

@Component({
  tag: 'udp-ambient-card',
  styleUrl: 'udp-ambient-card.css',
  shadow: true,
})  
export class UdpAmbientCard {

  @Prop() width: string = '600px';
  @State() isExpanded: boolean = false;
  @State() title: string = '';
  @Prop() overflow: string ='';
  @Prop() moreText: string = '';

  toggleExpand = () => {
    this.isExpanded = !this.isExpanded;
  };

  render() {
    return (
        <div class="wrapper"  style={{ width: this.width }} >
          <div class="adornment" > <udp-adornment status="info"></udp-adornment> </div>
      <div class="card" style={{width: '100%'}} >
        
              <div class="card-data" >
                    <div class="title">
                        <unity-typography variant='data-display-four'>{this.title}</unity-typography>
                    </div>
                    <div class="body">
                        <unity-typography  variant='body'>
                           <slot></slot>
                        </unity-typography>
                    </div>
                    <div class="footer">
                    {/* <button onClick={this.toggleExpand}>
                        {this.isExpanded ? 'Collapse' : 'Expand'}
                    </button> */}
                { this.overflow && 
                
                <div class="more-button" >
                   <unity-typography variant='caption-text'>{this.moreText} </unity-typography>
                    <stencil-icon-button 
                      onClick={this.toggleExpand} 
                      icon={this.isExpanded ? ChevronUp16 : ChevronDown16}
                      showLabel={false}>
                  </stencil-icon-button>
                </div>

                }
                    </div>
                    <div class={`expandable ${this.isExpanded ? 'expanded' : ''}`}>
                        <unity-typography  variant='body'>
                         {this.overflow}
                        </unity-typography>
                    </div>
                </div>

               
                
        </div>
        
      </div>
    );
  }
}
