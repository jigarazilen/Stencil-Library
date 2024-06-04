
import { User } from "../udp-utilities/user";

export type UserAction = { type: 'SET_USER'; payload: User | null };
export type AccessTokenAction = { type: 'SET_ACCESS_TOKEN'; payload: string | null };
export type UserActionTypes = UserAction | AccessTokenAction;
