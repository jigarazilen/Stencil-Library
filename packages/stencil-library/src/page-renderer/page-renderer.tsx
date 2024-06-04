import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'page-renderer',
  styleUrl: 'page-renderer.css',
  shadow: true,
})
export class PageRenderer {
  @Prop() pageData: any;
  @Prop() accessToken: string;
  @Prop() tenantId: string;
  @Prop() productId: string;
  @Prop() gridId: string;

  @Prop() userId: string;



  private renderUnknownComponent(componentName: string) {
    // Log a detailed error message for developers in the console
    console.error(`Error rendering ${componentName}. No matching component found. Please check your component mappings and passed properties.`);

    // Render a user-friendly message
    return (
      <div style={{ border: '1px solid #ff6a00', padding: '10px', margin: '10px 0', borderRadius: '5px', color: '#ff6a00', backgroundColor: '#fff3e0' }}>
        <unity-typography>Content currently unavailable ( <span style={{fontWeight: '700'}} >{componentName}</span> ). We're working to make this available to you soon!</unity-typography>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.pageData.map((data) => {
          // Prepare properties from metaData, ensuring any existing keys that
          // match your direct props are overridden.
          const gridProps = {
            ...data.properties, // Spread metaData properties first
            // Directly set/override specific props afterwards
            'access-token': this.accessToken, // Ensure custom elements use kebab-case for attributes
            tenantId: this.tenantId,
            //productId: this.productId, This is for the product id. Currently this will be set in the meta data but can be set here as well
            //gridId: this.gridId, This is for the grid id. Currently this will be set in the meta data but can be set here as well
            userId: this.userId,
          };

          switch (data.componentName) {
            case 'AmbientGrid':
              return <ambient-template-grid key={data.id} {...gridProps}></ambient-template-grid>;
            default:
                return this.renderUnknownComponent(data.componentName);
          }
        })}
      </div>
    );
  }
}
