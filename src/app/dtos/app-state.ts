import { DataState } from "../enum/datastate.enum";

export interface AppState<T>{

    dataState:DataState;
    appData?: T,
    error?: string;
}