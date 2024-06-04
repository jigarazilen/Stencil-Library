import { Component, h, State } from '@stencil/core';
import { useApiServiceMutate } from './useApiServiceMutate';

@Component({
  tag: 'test-api-updated',
  shadow: true,
})
export class TestApi {
  @State() data: any = null;
  @State() loading: boolean = false;
  @State() error: any = null;

  async componentWillLoad() {
    try {
      console.log('Before API call');
      this.loading = true;

      const options = {
        baseURL: 'https://jsonplaceholder.typicode.com',
        url: '/todos/1',
      };

      const { data, loading, error } = await useApiServiceMutate(options);
      
      this.data = data;
      this.loading = loading;
      this.error = error;

      console.log('After API call', { data, loading, error });
    } catch (e) {
      console.error('Error in componentWillLoad', e);
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return <div>Loading...</div>;
    }
    if (this.error) {
      return <div>Error: {this.error.message}</div>;
    }
    return (
      <div>
        <h1>Data:</h1>
        <pre>{JSON.stringify(this.data, null, 2)}</pre>
      </div>
    );
  }
}
