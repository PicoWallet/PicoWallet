import { Action } from '@ngrx/store';

export const DELETE = '[Account] Delete';
export const RESTORE = '[Account] Restore';
export const SET_ADDRESS = '[Account] SetAddress';
export const SET_NETWORK = '[Account] SetNetwork';
export const SET_WALLET = '[Account] SetWallet';
export const SET_PASSWORD = '[Account] SetPassword';
export const SET_AMOUNT = '[Account] SetAmount';
export const ADD_UNCONFIRM = '[Account] AddUnconfirm';
export const DEL_UNCONFIRM = '[Account] DelUnconfirm';
export const SET_TRANSACTIONS = '[Account] SetTransactions';
export const ADD_TRANSACTIONS = '[Account] AddTransactions';
export const SET_NODE = '[Account] SetNode';
export const SET_WS_CONNECTING = '[Account] SetWsConnecting';
export const SET_MOSAIC = '[Account] SetMosaic';
export const SET_SAVE_PASSWORD = '[Account] SetSavePassword';

export class Delete implements Action {
    readonly type = DELETE;
}

export class Restore implements Action {
    readonly type = RESTORE;
}

export class SetAddress implements Action {
    readonly type = SET_ADDRESS;
    constructor(public payload: any) {}
}

export class SetNetwork implements Action {
    readonly type = SET_NETWORK;
    constructor(public payload: any) {}
}

export class SetWallet implements Action {
    readonly type = SET_WALLET;
    constructor(public payload: any) {}
}

export class SetAmount implements Action {
    readonly type = SET_AMOUNT;
    constructor(public payload: any) {}
}

export class SetPassword implements Action {
    readonly type = SET_PASSWORD;
    constructor(public payload: any) {}
}

export class AddUnconfirm implements Action {
    readonly type = ADD_UNCONFIRM;
    constructor(public payload: any) {}
}

export class DelUnconfirm implements Action {
    readonly type = DEL_UNCONFIRM;
    constructor(public payload: any) {}
}

export class SetTransactions implements Action {
    readonly type = SET_TRANSACTIONS;
    constructor(public payload: any) {}
}

export class AddTransactions implements Action {
    readonly type = ADD_TRANSACTIONS;
    constructor(public payload: any) {}
}

export class SetNode implements Action {
    readonly type = SET_NODE;
    constructor(public payload: any) {}
}

export class SetWsConnecting implements Action {
    readonly type = SET_WS_CONNECTING;
    constructor(public payload: any) {}
}

export class SetMosaic implements Action {
    readonly type = SET_MOSAIC;
    constructor(public payload: any) {}
}

export class SetSavePassword implements Action {
    readonly type = SET_SAVE_PASSWORD;
    constructor(public payload: any) {}
}

export type All
= Delete | Restore | SetAddress | SetNetwork | SetWallet | SetAmount | SetPassword | AddUnconfirm | DelUnconfirm | SetTransactions | AddTransactions | SetNode | SetWsConnecting | SetMosaic | SetSavePassword;
