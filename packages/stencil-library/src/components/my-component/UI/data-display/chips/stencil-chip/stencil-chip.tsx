import { Component, Prop, h, Event, EventEmitter, State, Watch } from '@stencil/core';
import Close16 from '@carbon/icons/es/close/16';
import Star16 from '@carbon/icons/es/star/16';

@Component({
  tag: 'stencil-chip',
  styleUrl: 'stencil-chip.css',
  shadow: true
})
export class StencilChip {

  @Prop() text: string;
  @Prop() color: 'primary' | 'secondary' = 'primary';
  @Prop() level: number = 0;
  @Prop() defaultToggled: boolean = false; // New Prop
  @Prop() leftIcon: any; // New Prop for Left Icon
  @Prop() showLeftIcon: boolean = false; // New Prop to control display of Left Icon
  @Prop() showDelete: boolean = true;
  @Prop() externalToggleString: string;

  @Event() onDelete: EventEmitter<void>;
  @Event() onToggle: EventEmitter<boolean>; 
  @Event({ bubbles: true }) udpChipClicked: EventEmitter<string>;


  @State() toggled: boolean;

  @Watch('externalToggleString')
  externalStringChanged(newValue: string) {
    if (newValue && newValue === this.text ) {
      this.toggleOff();
    }
  }
  

  private toggleOff() {
    if (this.toggled) {
      this.toggled = false;
      this.onToggle.emit(this.toggled); // Optionally emit an event
    }
  }

  // Initialize the toggle state with the default value
  componentWillLoad() {
    this.toggled = this.defaultToggled;
  }

  handleClick = () => {
    this.toggled = !this.toggled;
    this.udpChipClicked.emit(this.text); // emit the event when clicked
  }

  handleDelete = (event: Event) => {
    event.stopPropagation();
    this.onDelete.emit();
  }

// Method to lighten the color based on the level
getLightenedColor(color: 'primary' | 'secondary', level: number): string {
  // Static HSL values for primary and secondary colors
  const hslValues = {
    primary: { hue: 156, saturation: 58, lightness: 67 }, 
    secondary: { hue: 156, saturation: 58, lightness: 67 }, 
  };

  // Retrieve the correct color values
  const { hue, saturation, lightness } = hslValues[color];

  // Dramatically increase the lightness based on the level to ensure a noticeable difference
  const lightnessIncrease = 15; // More substantial increase per level
  const newLightness = Math.min(100, lightness + level * lightnessIncrease);

  // Optional: Adjust hue for a more drastic change (future-proofing)
  const hueAdjustment = 50; // Set to non-zero to see hue changes; keep at 0 for no change
  const newHue = (hue + hueAdjustment * level) % 360; // Adjust hue based on level if needed

  // Construct and return the HSL color string
  return `hsl(${newHue}, ${saturation}%, ${newLightness}%)`;
}



  render() {


    

    const additionalPaddingWhenDeleteHidden = {
      paddingRight: '8px',  // Adjust this value according to your needs
    };

    const chipStyle = this.toggled ? {
      //backgroundColor: this.color === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)',
      backgroundColor: this.getLightenedColor(this.color, this.level),
      color: '#000',
      border: '1px solid var(--secondary-color)',
      ...(!this.showDelete ? additionalPaddingWhenDeleteHidden : {}),
    } : {
      backgroundColor: 'transparent',
      color: '#393939',
      border: '1px solid var(--secondary-color)',
      ...(!this.showDelete ? additionalPaddingWhenDeleteHidden : {}),
    }; 

    const deleteButtonStyle = this.toggled ? {
      backgroundColor: '#fff',
      color: '#333'
    } : {
      backgroundColor: '#d3d3d3', // light grey background
      color: '#393939'
    };

    const leftIconStyle = this.toggled ? {
      backgroundColor: '#fff',
      color: '#333'
    } : {
      backgroundColor: 'var(--primary-color)', // Or some darker shade
      color: '#fff'
    };

    const leftIconData = this.leftIcon || Close16; // Fallback to Add16 if no icon is provided

    console.log(leftIconStyle);
    console.log(leftIconData);

return (
  <div class="chip" style={chipStyle} onClick={this.handleClick}>
    {/* {this.leftIcon && (
      <span class="left-icon" style={leftIconStyle}>
        <svg {...leftIconData.attrs} fill={leftIconStyle.color}>
          {leftIconData.content.map((item, index) => {
            if (item.elem === 'path') {
              return <path {...item.attrs} key={index} />;
            }
            return null;
          })}
        </svg>
      </span>
    )} */}
      {this.leftIcon && (
        <span class="left-icon" style={leftIconStyle}>
          <svg fill={leftIconStyle.color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
            {Star16.content.map((item, index) => {
              if (item.elem === 'path') {
                return <path {...item.attrs} key={index} />;
              }
              return null;
            })}
          </svg>
        </span>
      )}
    <unity-typography variant='caption-text'>
      <span class='remove-height'>{this.text}</span>
    </unity-typography>
    {this.showDelete && (
      <button class="delete-button" style={deleteButtonStyle} onClick={this.handleDelete}>
        <svg {...Close16.attrs} fill={deleteButtonStyle.color}>
          {Close16.content.map((item, index) => {
            if (item.elem === 'path') {
              return <path {...item.attrs} key={index} />;
            }
            return null;
          })}
        </svg>
      </button>
    )}
  </div>
);

  }
}