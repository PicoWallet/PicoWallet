import * as AccountActions from '../actions/account'

export type Action = AccountActions.All;

export interface Account {
    v:number,
    created:boolean,
    address:string,
    password:string,
    amount:number,
    wallet:any,
    node:any,
    unconfirms:any,
    confirms:any,
    mosaic:any,
    save_password:boolean
}

let unconfirms:number = 0;
let ws_connecting:boolean = false;

let initialAccount = {
    created:false,
    v:0,
    address:"",
    password:"",
    wallet:null,
    amount: 0,
    node:null,
    unconfirms:[],
    confirms:[],
    mosaic:[],
    save_password:false,
};

export function reducer(account:Account = initialAccount, action: Action) {
    let a = {
        created:account.created,
        v:account.v,
        address:account.address,
        password: account.password,
        amount: account.amount,
        wallet: account.wallet,
        node: account.node,
        unconfirms: account.unconfirms,
        confirms: account.confirms,
        mosaic: account.mosaic,
        save_password: account.save_password,
    };
    switch (action.type) {
        case AccountActions.DELETE:{
            localStorage.removeItem("account");
            unconfirms = 0;
            ws_connecting = false;
            return initialAccount;
        }
        case AccountActions.RESTORE:{
            let r = localStorage.getItem("account");
            let n = account;
            if(r){
                let restore = JSON.parse(r);
                if("created" in restore){
                    n = restore;
                }
                n.unconfirms = [];
                n.confirms = [];
            }
            return n;
        }
        case AccountActions.SET_ADDRESS:{
            a.address = action.payload;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_PASSWORD:{
            a.password = action.payload;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_AMOUNT:{
            a.amount = action.payload;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_NETWORK:{
            a.v = action.payload;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_NODE:{
            a.node = action.payload;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_WALLET:{
            a.wallet = action.payload;
            a.created = true;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.ADD_UNCONFIRM:{
            let res = action.payload;
            let tmp = a.unconfirms.concat();
            let flg = false;
            for(let j=0;j<tmp.length;j++){
                if(res.meta.hash.data== tmp[j].meta.hash.data){
                    flg=true;
                }
            }
            if(flg==false){
                a.unconfirms = tmp.concat(res);
            }
            unconfirms = a.unconfirms.length;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.DEL_UNCONFIRM:{
            let res = action.payload;
            let tmp = a.unconfirms.concat();
            for(let i=0;i<tmp.length;i++){
                if(res.meta.hash.data==tmp[i].meta.hash.data){
                    tmp.splice(i, 1);
                    break;
                }
            }
            a.unconfirms = tmp.concat();
            unconfirms = tmp.length;
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_TRANSACTIONS:{
            let d = action.payload;
            if(d){
                if(d.concat){
                    a.confirms = a.confirms.concat(d.t);
                }else{
                    a.confirms = d.t;
                }
                saveLocalStorage(a);
            }
            return a;
        }
        case AccountActions.ADD_TRANSACTIONS:{
            let t  = action.payload;
            let flg=false;
            let transactions = a.confirms;
            for(let i=0;i<transactions.length;i++){
                if(transactions[i]["meta"]["hash"].data == t["meta"]["hash"].data){
                    flg = true;
                }
            }
            if(!flg){
                transactions.unshift(t);
            }
            a.confirms = transactions.concat();
            saveLocalStorage(a);
            return a;
        }
        case AccountActions.SET_WS_CONNECTING:{
            ws_connecting = action.payload;
            return a;
        }
        case AccountActions.SET_MOSAIC:{
            if(action.payload){
                a.mosaic = action.payload;
            }
            return a;
        }
        case AccountActions.SET_SAVE_PASSWORD:{
            a.save_password = action.payload;
            saveLocalStorage(a);
            return a;
        }
        default:
            return account;
    };
};

function saveLocalStorage(a) {
    try {
        let save = JSON.parse(JSON.stringify(a));
        save.unconfirms = [];
        save.confirms = [];
        if(!save.save_password){
            save.password = "";
        }
        localStorage.setItem("account", JSON.stringify(save));
    }
    catch (e) {
        console.log("Local Storage is full, Please empty data");
        console.log(e);
    }
};

export const getAccountCreated = (account: Account) => account.created;
export const getAccountWallet = (account: Account) => account.wallet;
export const getAccountPassword = (account: Account) => account.password;
export const getAccountAddress = (account: Account) => account.address;
export const getAccountUnconfirms = (account: Account) => unconfirms;
export const getAccountUnconfirmsObj = (account: Account) => account.unconfirms;
export const getAccountAmount = (account: Account) => account.amount;
export const getAccountTransactions = (account: Account) => account.confirms;
export const getAccountNetwork = (account: Account) => account.v;
export const getAccountNode = (account: Account) => account.node;
export const getAccountWSConnecting = (account: Account) => ws_connecting;
export const getAccountMosaic = (account: Account) => account.mosaic;
export const getAccountSavePassword = (account: Account) => account.save_password;
