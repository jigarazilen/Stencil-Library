import { 
  Component, 
  Prop, 
  State, 
  Event as StencilEvent, 
  EventEmitter, 
  h, 
} from '@stencil/core';
@Component({
  tag: 'selectable-list',
  styleUrl: 'selectable-list.css',
  shadow: true,
})
export class SelectableList {
  @Prop() disableSelection: boolean = false;
  @Prop() multiSelect: boolean = false;
  @Prop() items: any[] = [];
  @Prop() displayKey: string = '';
  @Prop() useCheckbox: boolean = false;
  @Prop() value: string;
  @Prop() required: boolean;
  @Prop() onInput: (event: Event) => void; 
  @Prop() valueKey: string = '';
  @Prop() error: string = '';
  @Prop() id: string;

  @State() internalItems: any[] = [];

  @StencilEvent() udpFieldChange: EventEmitter<Object[]>;
  @StencilEvent() udpFieldBlur: EventEmitter<Event>;

  constructor() {
    this.handleItemClick = this.handleItemClick.bind(this);
    this.getSelectedItems = this.getSelectedItems.bind(this);
    this.getValue = this.getValue.bind(this);
  }
  componentWillLoad() {
    if(!this.value){
      this.internalItems = this.items
      return;
    }
      

    if(!this.valueKey)
    {
      console.error('valueKey is required')
      return
    }

    let selectedItems = this.items.filter(item => this.value.split(',').includes(item[this.valueKey]))
    const items = this.items;
    if(selectedItems.length > 1 && !this.multiSelect){
      selectedItems = [selectedItems[0]]
      console.warn('multiple values are selected, but multiselect is disabled')
    }
    items.forEach(item => 
      {
        if(selectedItems.find(selectedItem => selectedItem[this.valueKey]===item[this.valueKey])){
          item.selected = true
        }
      }
    )
    this.internalItems = items
  }
  getSelectedItems(items:any[] = null):any[]{
    
    const itemsToCheck = items ?? this.internalItems;
    return itemsToCheck.filter(item => item.selected) ?? [];
  }

  getValue(items:any[] = null): string{
    const itemsToCheck = items ?? this.internalItems
    return this.getSelectedItems(itemsToCheck).map(item => item[this.valueKey] ?? item[this.displayKey]).join(',') ?? ""
  }


  handleItemClick(item: any, event: Event) {
    if (this.disableSelection) return;
    let newItems = [...this.internalItems]
    const selectedIndex = this.internalItems.findIndex(
        selectedItem => (this.valueKey && selectedItem[this.valueKey] === item[this.valueKey]) || (!this.valueKey && selectedItem === item),
      );
    
    newItems.splice(selectedIndex, 1, {...item, selected: !item.selected});
    if (!this.multiSelect && !item.selected) {
      newItems = newItems.map((item, i) => ({...item, selected: i === selectedIndex}))
    } 
    this.internalItems = newItems;
    this.udpFieldChange.emit(this.getSelectedItems(newItems))
    this.udpFieldBlur.emit(event)
    this.onInput?.(event);
  }
  render() {
    if(!this.valueKey)
      return null;
    return (
      <ul>
        {this.internalItems.map((item, i) => (
          <li
            key={item.id || item[this.displayKey]}
            onClick={(event:Event) => this.handleItemClick(item, event)} 
            class={item.selected && !this.useCheckbox ? 'selected' : ''}
            id={'udpRecord-selectable-list-input-' + i + '-' + this.id} 
            //@ts-ignore
            udprecordid={'udpRecord-selectable-list-input-' + i + '-' + this.id} 
          >
            {this.useCheckbox ? (
              <label>
                <input
                  type={this.multiSelect ? 'checkbox' : 'radio'}
                  name={(this.valueKey && item[this.valueKey]) || (item.id ?? item[this.displayKey])}
                  disabled={this.disableSelection}
                  value={(this.valueKey && item[this.valueKey]) || (item.id ?? item[this.displayKey])}
                  checked={item.selected}
                  onChange={(event:Event) => this.handleItemClick(item, event)}
                />
                {item[this.displayKey]}
              </label>
            ) : (
              <div>{item[this.displayKey]}</div>
            )}
          </li>
        ))}
        {this.error && <unity-typography class="error" variant='caption-text'>{this.error}</unity-typography>}
      </ul>
    );
  }
}
