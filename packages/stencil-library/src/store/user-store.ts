import { createStore } from '@stencil/store';
import { User } from '../udp-utilities/udp-user-creator';
import { UserActionTypes } from './internal';

// Define an interface for the state that includes a User field
interface State {
  user: User | null;
}

const initialState: State = { user: null };
const { state } = createStore<State>(initialState);

export function updateState(action: UserActionTypes) {
  switch (action.type) {
    case 'SET_USER':
      state.user = action.payload;
      break;
    case 'SET_ACCESS_TOKEN':
      if (state.user) {
        state.user.accessToken = action.payload;
      }
      break;
    default:
      break;
  }
}

export default {
  state,
  updateState,
};
