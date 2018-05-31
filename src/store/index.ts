import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
 
import * as fromAccount from './reducers/account';
 
export const reducers: ActionReducerMap<any> = {
  account: fromAccount.reducer,
};

export const getAccount = createFeatureSelector<fromAccount.Account>('account');
export const getAccountCreated = createSelector(getAccount, fromAccount.getAccountCreated);
export const getAccountWallet = createSelector(getAccount, fromAccount.getAccountWallet);
export const getAccountPassword = createSelector(getAccount, fromAccount.getAccountPassword);
export const getAccountAddress = createSelector(getAccount, fromAccount.getAccountAddress);
export const getAccountUnconfirms = createSelector(getAccount, fromAccount.getAccountUnconfirms);
export const getAccountUnconfirmsObj = createSelector(getAccount, fromAccount.getAccountUnconfirmsObj);
export const getAccountAmount = createSelector(getAccount, fromAccount.getAccountAmount);
export const getAccountTransactions = createSelector(getAccount, fromAccount.getAccountTransactions);
export const getAccountNetwork = createSelector(getAccount, fromAccount.getAccountNetwork);
export const getAccountNode = createSelector(getAccount, fromAccount.getAccountNode);
export const getAccountWSConnecting = createSelector(getAccount, fromAccount.getAccountWSConnecting);
export const getAccountMosaic = createSelector(getAccount, fromAccount.getAccountMosaic);
export const getAccountSavePassword = createSelector(getAccount, fromAccount.getAccountSavePassword);
