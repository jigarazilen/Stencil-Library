import { Component, Prop, Event, EventEmitter, h, State, Watch, forceUpdate } from '@stencil/core';


@Component({
  tag: 'tree-list-item',
  styleUrl: 'tree-list-item.css',
  shadow: true
})

export class TreeListItem {
  @Prop() label: string;
  @Prop() reference: string | null;
  @Prop() nestedItems?: any[];
  @State() showNested: boolean = false;
  @Prop() level: number = 0;
  @Event() itemClick: EventEmitter<{ searchField: string, searchOperator: string, searchValue: string, parentName?: string, parentPath?: string }>;
  @Prop() parentFilter: any; 
  @Prop() parentPath: string;
  @Prop() parentName: string = 'defaultParentName';
  @State() showChildren: boolean = false;
  @State() updateTrigger: boolean = false;
  @Prop() customAttribute: string; // New property added
  @Prop() test: string; // New property added
  @Prop() parent: string; // New property added
  @Prop() dataOne: string; // New property added
  @Prop() dataTwo: string; // New property added
  @Prop() statusKey: string;
  @Prop() statusClasses: { [key: string]: string };
  @Prop() statusLabel: string;
  @Prop() statusValue: boolean;
  @Prop() showViewOption: boolean = false; 
  @Prop() showDeleteOption: boolean = false; 
  @Prop() showEditOption: boolean = false; 
  @Prop() showUpdateDefaultOption: boolean = false; 
  @Prop() showAdd: boolean = true; 
  @Prop() viewHandler: (event: MouseEvent) => void;
  @Prop() deleteHandler: (event: MouseEvent) => void;
  @Prop() editHandler: (event: MouseEvent) => void;
  @Prop() updateDefaultHandler: (event: MouseEvent) => void;
  @Prop() isDefault: boolean = false; 
  @Prop() add: boolean = false;
  @Prop() gridViewVisibilityTypeId : number;
  
@Watch('nestedItems')
nestedItemsChanged(newValue: any[], oldValue: any[]) {  
  if (newValue !== oldValue) {
    console.log('Nested items have changed');
    // Perform necessary actions or state updates based on the new value 
    forceUpdate(this); 
  }
}

  @Event({
    eventName: 'reference-clicked',
    bubbles: true,
    composed: true,
    cancelable: true,
  }) referenceClicked: EventEmitter<{ reference: string, name: string, parentReference?: string, parentFilter?: string, parent?: string, parentPath?: string }>;
   

//   componentWillRender() {
//     console.log('Rendering TreeListItem:', this.label, 'Nested Items:', this.nestedItems);
// }

 
  private handleButtonClick = (event: MouseEvent) => {
    this.showChildren = !this.showChildren;
    event.stopPropagation();
    if (this.reference) {
      this.showNested = !this.showNested;
      this.updateTrigger = !this.updateTrigger;
      this.referenceClicked.emit({
        reference: this.reference,
        name: this.label,
        parentReference: this.parentName,
        parentFilter: this.parentFilter,
        parent: this.parent,
        parentPath: this.parentPath
      });
      forceUpdate(this);
    } 
  }  
  
  
private onSelfClick = () => {
 
  if (!this.reference) {
    this.itemClick.emit({
      searchField: this.label,
      searchOperator: "", 
      searchValue: "",    
      parentName: this.parentName,
      parentPath: this.parentPath
    });
  } else {
    // Handle the case for items with children
  }
};

// private someOtherHandler = (event: MouseEvent) => {
//   event.stopPropagation();
//   console.log('someOtherHandler called');
// }


private handleViewClick = (event: MouseEvent) => {
  event.stopPropagation();
  if (this.viewHandler) {
    this.viewHandler(event);
  }
}


private handleDeleteClick = (event: MouseEvent) => {
  event.stopPropagation();
  if (this.deleteHandler) {
    this.deleteHandler(event);
  }
}

private handleEditClick = (event: MouseEvent) => {
  event.stopPropagation();
  if (this.editHandler) {
    this.editHandler(event);
  }
}

private handleUpdateDefaultClick = (event: MouseEvent) => {
  event.stopPropagation();
  if (this.updateDefaultHandler) {
    this.updateDefaultHandler(event);
  }
}


render() {
  
  const indentationStyle = { 'marginLeft': `${this.level * 20}px` };

  // Recursive function to render nested items
  const renderNestedItems = (nestedItems, currentLevel) => {
    
    return nestedItems.map((item, index) => (
      
      <tree-list-item
        key={`${item.name}-${currentLevel}-${index}`}
        label={item.name}
        reference={item.reference}
        nestedItems={item.referenceNode} // Pass the nested items for further recursion
        level={currentLevel + 1} // Increment the level for each nested item
        parentName={this.label}
        parentFilter={item.extendedProperties?.parentFilter}
        parent={item.extendedProperties?.parent}
        parentPath={item.extendedProperties?.parentPath}
        onReference-clicked={(event: CustomEvent<{ reference: string; name: string; parentReference?: string; parentFilter?: string, parent?: string; parentPath?: string }>) => {
          event.stopPropagation();
          // Emitting referenceClicked event with detailed payload
          this.referenceClicked.emit({
            reference: event.detail.reference,
            name: event.detail.name,
            parentReference: this.label,
            parentFilter: event.detail.parentFilter,
            parent: event.detail.parent,
            parentPath: event.detail.parentPath
          });
        }}
      />
    ));
  };   
  
  return (
    <div class="tree-list-item" style={indentationStyle}>
      <div class="label-icon-container" onClick={this.onSelfClick}>
        <div class="tree-label-select">
          <unity-typography variant='data-display-three'>{this.label}</unity-typography>
        </div>
        {/* Conditionally rendered buttons alongside the label */}
        {this.gridViewVisibilityTypeId && <status-chip statusClasses={{"Private" : "error", "Public" : "success" }} statusValue={this.gridViewVisibilityTypeId === 1 ? "Private" : "Public"}>{this.gridViewVisibilityTypeId === 1 ? "Private" : "Public"}</status-chip>}
        {this.showEditOption && <udp-function-button edit onClick={this.handleEditClick}>Edit</udp-function-button>}
        {this.showDeleteOption && <udp-function-button delete onClick={this.handleDeleteClick}>Delete</udp-function-button>}
        {this.showUpdateDefaultOption && <udp-function-button isDefault={this.isDefault} onClick={this.handleUpdateDefaultClick}>Make Default</udp-function-button>}
        {this.showViewOption && <udp-function-button view onClick={this.handleViewClick}>Other Action</udp-function-button>}
        {this.reference ? (
          <udp-function-button expand={true} noBackground  onClick={this.handleButtonClick}>Details</udp-function-button>
        ) : (
          this.showAdd && <udp-function-button add={true}></udp-function-button>
        )}
      </div>
      {this.showNested && this.nestedItems && (
        <div class="nested-list">
          {renderNestedItems(this.nestedItems, this.level)}
        </div>
      )}
    </div>
  );
  
  
}


}