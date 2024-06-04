import { Component, Prop, h, State, Element } from '@stencil/core';

@Component({
  tag: 'udp-hotlist-form',
  styleUrl: 'udp-hotlist-form.css',
  shadow: true,
})
export class UdpHotlistForm {
  @Element() el: HTMLElement;
  @Prop() refetchViews: () => void;
  @Prop() handleFormSubmit: (name: string, isPrivate: boolean, columnState: any) => void;
  @Prop() handleCancelClick: () => void;

  @State() name: string = '';
  @State() isPrivate: boolean = false;
  // Add a state or prop for columnState
  @State() columnState: any; // Adjust this according to your needs

  handleNameChange = (event) => {
    this.name = event.target.value;
  };

  handlePrivateChange = () => {
    this.isPrivate = !this.isPrivate;
  };

// Refreshes the page 
//   handleSubmit = () => {
//     // Now passing columnState as well
//     this.handleFormSubmit(this.name, this.isPrivate, this.columnState);
//   };
  

handleSubmit = (event: Event) => {
    event.preventDefault();
    this.handleFormSubmit(this.name, this.isPrivate, this.columnState);
  };

  // Handling custom button click
  onCustomButtonClick = () => {
    this.handleFormSubmit(this.name, this.isPrivate, this.columnState);
  };


//   handleCancelClick = () => {
//     console.log('Cancel button clicked');
//   }

  render() {
    return (
      <div class="wrapper" >
         <form class="save-form" onSubmit={this.handleSubmit}>
            <text-field
            label="Hotlist Name"
            placeholder="Create a name for your Hotlist"
            value={this.name}
            handleInput={(event: any) => this.handleNameChange(event)}
            ></text-field>
            <stencil-toggle
            label="Private"
            checked={this.isPrivate}
            onToggledChange={this.handlePrivateChange}
            ></stencil-toggle>
         {/* <button type="submit">Save List</button> */}
         <div class="submit-button" >
         <custom-button 
              variant='outline'  
              type="submit" 
              onCustomClick={this.handleCancelClick}>
              Cancel
            </custom-button>
            <custom-button 
              disabled={!this.name} 
              type="submit" 
              onCustomClick={this.onCustomButtonClick}>
              Create List
            </custom-button>
         </div>
          
      </form>
      </div>
    );
  }
}


