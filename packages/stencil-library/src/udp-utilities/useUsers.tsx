import userStore from '../store/user-store';

export function useUser() {
    return userStore.state.user;
  }