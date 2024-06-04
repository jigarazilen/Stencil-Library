import { Component, h } from '@stencil/core';


@Component({
    tag: 'simple-card',
    styleUrl: 'simple-card.css',
    shadow: true
  })
  export class SimpleCard {
    render() {
      return (
        <div class="card">
          <slot></slot>
        </div>
      );
    }
  }
  