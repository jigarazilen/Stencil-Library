import { createStore } from '@stencil/store';
import { FormApi } from 'final-form';
interface FinalFormStore {
  api: FormApi;
  registeredFields: {
    [key: string]: {
      required: boolean;
    };
  };
}
// @ts-ignore
const intialState: FinalFormStore = { api: {}, registeredFields: {} };
const { state } = createStore(intialState);

export default state;
