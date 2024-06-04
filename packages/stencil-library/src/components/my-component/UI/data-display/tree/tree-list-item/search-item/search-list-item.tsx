import { Component, Prop, State, Watch, Event, EventEmitter, h } from '@stencil/core';
import Close24 from '@carbon/icons/es/close/24';

@Component({
  tag: 'search-list-item',
  styleUrl: 'search-list-item.css',
  shadow: true
})
export class SearchListItem {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() handleDelete: (event: MouseEvent) => void;
  @Prop() groupId: string;
  @Prop() operator: string; // Prop to receive the current operator

  @State() searchOperator: string = '='; // Default value

  @Event({ bubbles: true, composed: true }) searchItemChanged: EventEmitter;

  @Watch('operator')
  operatorChanged(newValue: string) {
    if (newValue !== this.searchOperator && newValue !== null) {
      this.searchOperator = newValue;
      console.log('Operator changed:', newValue);
    }
  }

  componentWillUpdate() {
    if (this.operator && this.operator.length > 0) {
      this.searchOperator = this.operator; // Manually sync inside lifecycle if @Watch doesn't catch
    }
  }
  
conponentDidLoad() {
  console.log('Component did load:',  this.operator);
}


handleOperatorSelected(event: CustomEvent) {
  console.log('event.detail', event.detail.value)
  // const newOperator = newOperator;  
  this.searchOperator = event.detail.value;
  this.emitChange(); // Emit the change to ensure it is captured
}


emitChange(newValue = this.name) {
  // Ensure the operator is passed as a string, not an object
  this.searchItemChanged.emit({
    searchField: this.label,
    groupId: this.groupId,
    searchOperator: this.searchOperator || '=',  // Ensure default to '=' if undefined
    searchValue: newValue,
    uniqueId: this.generateUniqueId()
  });
}


  generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  handleInputBlur(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputVal = inputElement.value;
    console.log('this.searchOperator', this.searchOperator)
    if (inputVal !== this.name) {
      this.searchItemChanged.emit({
        searchField: this.label,
        groupId: this.groupId,
        searchOperator: this.searchOperator,
        searchValue: inputVal,
        uniqueId: this.generateUniqueId()
      });
    }
  }

  

  private selectorOptions = [
    {
      value: '=',
      label: 'Equals'
    },
    {
      value: 'IN',
      label: 'Contains'
    },
    {
      value: '<>',
      label: 'Does not Equal'
    },
    {
      value: '>',
      label: 'Greater Than'
    },
    {
      value: '<',
      label: 'Less Than'
    },
    {
      value: '>=',
      label: 'Greater Than or Equal To'
    },
    {
      value: '<=',
      label: 'Less Than or Equal To'
    },
    {
      value: 'LIKE',
      label: 'Like'
    },
    {
      value: 'STARTSWITH',
      label: 'Starts With'
    },
    {
      value: 'BETWEEN',
      label: 'Between'
    }
  ];

  render() {
    return (
      <div class="list-item">
        <div class="list-body">
          
        <div class="name">
          <unity-typography variant="button">{this.label}</unity-typography>
        </div>
        <div style={{width: '200px'}}>
          <udp-selector
            defaultOption={this.searchOperator}
            onOptionSelected={(event: CustomEvent) => this.handleOperatorSelected(event)}
            options={this.selectorOptions}
          ></udp-selector>
        </div>
        <div class="input">
        <text-field
          value={this.name}
          handleBlur={(event: Event) => this.handleInputBlur(event)}
        ></text-field>
        </div>
      </div>

        <stencil-icon-button icon={Close24} onClick={this.handleDelete}></stencil-icon-button>


      </div>
    );
  }

}
 