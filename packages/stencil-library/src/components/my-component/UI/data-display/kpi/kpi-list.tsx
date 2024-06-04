import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'kpi-list',
  styleUrl: 'kpi-list.css',
})
export class KpiList {
  @Prop() kpiValues: Array<{ label: string, value: number }>;

  render() {
    return (
      <div class="kpi-container">
        {this.kpiValues.map((kpi, index) => (
          <div class="kpi-item">
            <span class="kpi-label"  
            style={{
                fontSize:' 0.875rem',
                fontWeight: '300',
                lineHeight: '0.25',
                fontFamily: 'sans-serif'
            }} > <unity-typography  > {kpi.label}: </unity-typography>  </span>
            <span class="kpi-value"
                   style={{
                    fontSize:' 0.875rem',
                    fontWeight: '600',
                    lineHeight: '0.25',
                    fontFamily: 'sans-serif'
                }}
            >  <unity-typography  > {kpi.value.toLocaleString()} </unity-typography> </span>
            {index < this.kpiValues.length - 1 && <div class="divider"></div>}
          </div>
        ))}
      </div>
    );
  }
}
