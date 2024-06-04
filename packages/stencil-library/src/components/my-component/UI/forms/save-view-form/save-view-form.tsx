import { Component, Prop, h, State, Element } from '@stencil/core';

@Component({
  tag: 'save-view-form-dialog',
  styleUrl: 'save-view-form-dialog.css',
  shadow: true,
})
export class SaveViewFormDialog {
  @Element() el: HTMLElement;
  @Prop() open: boolean;
  @Prop() title: string;
  @Prop() handleClose: Function;
  @Prop() tenant: string;
  @Prop() application: string;
  @Prop() entity: string;
  @Prop() user: any;
  @Prop() refetchViews: () => void;
  @Prop() gApi: any;
  @Prop() gcApi: any;
  @Prop() gridId: any;
  @Prop() domain: any;
  @Prop() apiCatalogId: any;
  @Prop() closeDialog: any;
  // Adjust the handleFormSubmit to accept a number for isPrivate
  @Prop() handleFormSubmit: (name: string, isPrivate: number, isDefault: boolean) => void;

  @State() name: string = '';
  // Change isPrivate to be a number, defaulting to 2 (false/not private)
  @State() isPrivate: number = 2;
  @State() isDefault: boolean = false;

  handleNameChange = (event) => {
    this.name = event.target.value;
  };

  // Update the toggle method to flip between 1 (true/private) and 2 (false/not private)
  handlePrivateChange = () => {
    this.isPrivate = this.isPrivate === 1 ? 2 : 1;
  };

  handleDefaultChange = () => {
    this.isDefault = !this.isDefault;
  };


  // Ensure handleSubmit correctly handles the isPrivate number
  handleSubmit = () => {
    this.handleFormSubmit(this.name, this.isPrivate, this.isDefault );
    this.name = '';
    this.isPrivate = 2;
    this.isDefault = false;
  };

  render() {
    return (
      <fluent-dialog
        open={this.open}
        actionOne={this.handleSubmit}
        actionTwo={this.closeDialog}
        handleClose={this.handleClose}
        labelOne="Save View"
        labelTwo="Cancel"
        title={this.title}
        disableOne={!this.name}
      >
        <form class="save-form">
          <text-field
            label="View Name"
            placeholder="Create a name for your view"
            value={this.name}
            handleInput={(event: any) => this.handleNameChange(event)}
          ></text-field>
          {/* Adjust the toggle to reflect isPrivate's state accurately, might need custom handling based on stencil-toggle's API */}
         
         <div class="toggle-options" >
          <div><stencil-toggle label="Private" checked={this.isPrivate === 1} onToggledChange={this.handlePrivateChange}></stencil-toggle> </div>
          <div><stencil-toggle label="Default" checked={this.isDefault} onToggledChange={this.handleDefaultChange} style={{ marginTop: '10px' }}></stencil-toggle></div>
        </div>
       
        </form>
      </fluent-dialog>
    );
  }
}
