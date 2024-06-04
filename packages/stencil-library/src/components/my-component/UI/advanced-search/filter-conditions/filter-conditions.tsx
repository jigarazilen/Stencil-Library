import { Component, h } from '@stencil/core';

@Component({
  tag: 'filter-conditions',
  styleUrl: 'filter-conditions.css',
  shadow: true,
})
export class AdvancedSearch {
  render() {
    return (
      <div class="container">
        <udp-column-header></udp-column-header>
      </div>
    );
  }
}
