import { Component, Prop, h, State, Element } from '@stencil/core';

@Component({
  tag: 'edit-view-form-dialog',
  styleUrl: 'edit-view-form-dialog.css',
  shadow: true,
})
export class EditViewFormDialog {
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
  @Prop() currentGridId: string;
  @Prop() currentName: string;
  @Prop() currentGridViewVisibilityTypeId: number;
  @Prop() currentIsDefault: boolean;

  // Adjust the handleFormSubmit to accept a number for isPrivate
  @Prop() handleFormSubmit: (gridId: any, name: string, isPrivate: number, isDefault: boolean) => void;

  // Initialize name with the value of currentName
  @State() name: string = '';
  // Change isPrivate to be a number, defaulting to 2 (false/not private)
  @State() isPrivate: number = 2;
  @State() isDefault: boolean = false;
  @State() fetchedCurrentView: boolean = false;

  componentDidUpdate() {
    if (this.open) {
      this.handleGetExistingView();
    }
  }

  componentWillRender() {
    // console.log("rerendered name");
    this.name = this.currentName;
    this.gridId = this.currentGridId;
  }

  handleGetExistingView = () => {
    this.isPrivate = this.currentGridViewVisibilityTypeId;
    this.isDefault = this.currentIsDefault;
    console.log("isPrivate:", this.isPrivate, "isDefault:", this.isDefault);
    this.fetchedCurrentView = true;
  };

  resetFetchedCurrentView() {
    this.fetchedCurrentView = false;
  }

  handleNameChange = (event) => {
    this.currentName = event.target.value;
    this.name = event.target.value;
  };

  handlePrivateChange = () => {
    this.isPrivate = this.isPrivate === 1 ? 2 : 1;
    this.currentGridViewVisibilityTypeId = this.currentGridViewVisibilityTypeId === 1 ? 2 : 1;
    console.log(this.isPrivate);
  };

  handleDefaultChange = () => {
    this.isDefault = !this.isDefault;
    this.currentIsDefault = !this.currentIsDefault;
    console.log(this.isDefault);
  };

  handleSubmit = () => {
    this.handleFormSubmit(this.gridId, this.name, this.isPrivate, this.isDefault );
  };

  render() {
    return (
      <fluent-dialog
        open={this.open}
        actionOne={() => { this.handleSubmit(); this.closeDialog(); this.resetFetchedCurrentView(); }}
        actionTwo={() => { this.closeDialog(); this.resetFetchedCurrentView(); }}
        handleClose={this.handleClose}
        labelOne="Save Update"
        labelTwo="Cancel"
        title={this.title}
        disableOne={!this.name}
      >
        <form class="edit-form">
          <text-field
            label="View Name"
            value={this.name}
            handleInput={(event: any) => this.handleNameChange(event)}
          ></text-field>
          { this.fetchedCurrentView && 
            <div class="toggle-options" >
              <div><stencil-toggle label="Private" checked={this.isPrivate === 1} onToggledChange={this.handlePrivateChange}></stencil-toggle> </div>
              <div><stencil-toggle label="Default" checked={this.isDefault} onToggledChange={this.handleDefaultChange} style={{ marginTop: '10px' }}></stencil-toggle></div>
            </div>
          }
        </form>
      </fluent-dialog>
    );
  }
}
