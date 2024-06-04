import { Component, Prop, h, State, Watch } from '@stencil/core';

@Component({
  tag: 'status-chip',
  styleUrl: 'status-chip.css',
  shadow: true
})
export class StatusChip {
  // State to handle the internal status class
  @State() internalStatusClass: string;

  // Prop for the status value, which now can be string or boolean
  @Prop() statusValue: string | boolean;

  // Define a mapping of possible status values to CSS classes
  @Prop() statusClasses: { [key: string]: string } = {};


  // Watch for changes in statusValue
  @Watch('statusValue')
  protected statusValueWatcher(newValue: string | boolean) {
    const valueKey = typeof newValue === 'boolean' ? newValue.toString() : newValue;
    this.internalStatusClass = this.statusClasses && this.statusClasses[valueKey] ? this.statusClasses[valueKey] : 'default';
  }
  

  // Initial call to set the status based on the initial statusValue
  componentWillLoad() {
    this.statusValueWatcher(this.statusValue);
  }

  render() {
    return (
      <div class={`chip ${this.internalStatusClass}`}>
        <unity-typography variant='data-display-three'>
          <slot></slot> {/* Slot for content */}
        </unity-typography>
      </div>
    );
  }
}
