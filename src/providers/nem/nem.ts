import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import nem from "nem-sdk";
import 'rxjs/add/observable/interval';
import CryptoJS from 'crypto-js';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import * as AccountAction from '../../store/actions/account';

import {TESTNET_V, MAINNET_V, INVOICE_QR} from '../../config';
import {MAINNET_NODE_LIST, TESTNET_NODE_LIST, NODE} from '../../nodelist';

@Injectable()
export class NemProvider {
    public address:string = "";
    public v:number = 0;
    public connecting:boolean = false;
    public ws_connector:any;
    public wallet:any;
    public network_id:number;
    public password:string;
    public account$:any;
    public node:NODE;
    public mosaics:any;
    public arr:any = [];
    public obj:any = {};
    public mosaicMetaData:any;

    public TRANSFER = nem.model.transactionTypes.transfer;
    public IMPORTANCETRANSFER = nem.model.transactionTypes.importanceTransfer;
    public MULTISIGMODIFICATION= nem.model.transactionTypes.multisigModification;
    public MULTISIGSIGNATURE= nem.model.transactionTypes.multisigSignature;
    public MULTISIGTRANSACTION= nem.model.transactionTypes.multisigTransaction;
    public PROVISIONNAMESPACE= nem.model.transactionTypes.provisionNamespace;
    public MOSAICDEFINITION= nem.model.transactionTypes.mosaicDefinition;
    public MOSAICSUPPLY = nem.model.transactionTypes.mosaicSupply;

    constructor(
        public translate: TranslateService,
        public store: Store<any>
    ) {
        this.arr = new Array(100);
        this.init();
        this.setup();
    }
    init(){
        this.network_id = 0;
        this.connecting = false;
        this.ws_connector = null;
        this.wallet = null;
        this.password = "";
        this.address = "";
        this.node = null;
        this.v = 0;
        this.mosaics = null;
        this.mosaicMetaData= null;
    }
    setup(){
        this.account$ = this.store.select("account").subscribe(res =>{
            if(res){
                if(res.created == true){
                    this.setV(res.v);
                    this.setNetworkId(this.v);
                    this.setNode(res.node);
                    if(this.node == null){
                        this.setNodeInit(this.v);
                    }
                    this.setAddress(res.address);
                    this.setPassword(res.password);
                    this.setWallet(res.wallet);
                }
            }
        });
        this.store.select(fromRoot.getAccountAddress).subscribe((res)=>{
            if(res!=""){
                this.setAddress(res);
                this.asyncSetup();
            }
        });
    }
    async asyncSetup(){
        try{
            let data = await this.getAccountTransactionAll(this.address);
            this.store.dispatch(new AccountAction.SetTransactions({t:data, concat:false}));
            this.getAccountMosaicsOwned(this.address);
            await this.initMetaData();
        }catch(e){
            console.log(e);
        }
    }
    setAddress(val){
        this.address = val;
    }
    setV(val){
        this.v = val;
    }
    setNetworkId(v){
        if(v == TESTNET_V){
            this.network_id = nem.model.network.data.testnet.id;
        }else if(v == MAINNET_V){
            this.network_id = nem.model.network.data.mainnet.id;
        }else{
            throw Error("v is not setting.");
        }
    }
    setNode(val){
        this.node = val;
    }
    setNodeInit(v){
        if(v == TESTNET_V){
            this.node = this.getNodeUrl(TESTNET_NODE_LIST);
        }else if(v == MAINNET_V){
            this.node= this.getNodeUrl(MAINNET_NODE_LIST);
        }else{
            throw Error("v is not setting.");
        }
        this.store.dispatch(new AccountAction.SetNode(this.node));
    }
    setWallet(val){
        this.wallet = val;
    }
    setPassword(val){
        this.password = val;
    }

    getNodeUrl(list){
        return list[Math.floor(Math.random() * list.length)];
    }

    createWallet(walletName, password, v){
        let network_id = 0;
        if(v == TESTNET_V){
            network_id = nem.model.network.data.testnet.id;
        }else{
            network_id = nem.model.network.data.mainnet.id;
        }
        let wallet = nem.model.wallet.createPRNG(walletName, password, network_id);
        return wallet;
    }
    getRandomKey(){
        return nem.crypto.helpers.randomKey();
    }
    importPrivateKeyWallet(walletName, password, privateKey,salt,  pass, v){
        let network_id = 0;
        if(v == TESTNET_V){
            network_id = nem.model.network.data.testnet.id;
        }else{
            network_id = nem.model.network.data.mainnet.id;
        }
        salt = CryptoJS.enc.Hex.parse(salt);
        let key = CryptoJS.PBKDF2(pass, salt, {
            keySize: 256 / 32,
            iterations: 2000
        });
        let iv = privateKey.substring(0, 32);
        let encryptedPrvKey = privateKey.substring(32, 128);

        let obj = {
            ciphertext: CryptoJS.enc.Hex.parse(encryptedPrvKey),
            iv: nem.utils.convert.hex2ua(iv),
            key: nem.utils.convert.hex2ua(key.toString())
        }

        let priv = nem.crypto.helpers.decrypt(obj);
        if(64 <= priv.length && priv.length <= 66){
            let wallet = nem.model.wallet.importPrivateKey(walletName, password, priv, network_id);
            return wallet;
        }
        return null;
    }
    createAccount(address, password, wallet, network){
        this.store.dispatch(new AccountAction.SetNetwork(network));
        this.store.dispatch(new AccountAction.SetPassword(password));
        this.store.dispatch(new AccountAction.SetWallet(wallet));
        this.store.dispatch(new AccountAction.SetAddress(address));
    }
    async addTransactions(txId){
        let data = await this.getAccountTransactionAll(this.address, txId);
        if(data.length > 0){
            this.store.dispatch(new AccountAction.SetTransactions({t:data, concat:true}));
        }
    }
    async getAccountTransactionAll(address, txId:any=null){
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        let ret = [];
        try{
            let res = await nem.com.requests.account.transactions.all(endpoint, address, null, txId);
            if(res){
                let data = res["data"];
                if(res["data"].length > 0){
                    for(let i = 0; i < data.length; i++){
                        data[i] = await this.addExtendsField(this.address, data[i]);
                    }
                    ret = data;
                }
            }
        }catch(e){
            console.log(e);
        }
        return ret;
    }
    async getAccountMosaicsOwned(address){
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        let res = await nem.com.requests.account.mosaics.owned(endpoint, address);
        if(res){
            this.store.dispatch(new AccountAction.SetMosaic(res.data));
            for(let i=0;i<res.data.length;i++){
            }
        }
    }
    async initMetaData(){
        this.mosaicMetaData= nem.model.objects.get("mosaicDefinitionMetaDataPair");
        let s = await this.getMosaicSupply("nem:xem");
        this.mosaicMetaData["nem:xem"].supply = s.supply;
    }
    getMosaicMetaData(){
        return this.mosaicMetaData;
    }
    async getMosaicDivisibility(mosaicName){
        if(!this.mosaicMetaData[mosaicName]){
            await this.addMosaicMetaData(mosaicName);
        }
        let p = this.mosaicMetaData[mosaicName].mosaicDefinition.properties;
        let dp = nem.utils.helpers.grep(p, function(w) {
            return w.name === "divisibility";
        });
        let d = dp.length === 1 ? ~~(dp[0].value) : 0;
        return d;
    }
    async calcMosaicAmount(mosaicName, amount){
        let d = await this.getMosaicDivisibility(mosaicName);
        let ret = amount;
        if(d>0){
            let pow = Math.pow(10, d)
            ret = amount / pow;
        }
        return ret;
    }

    async addMosaicMetaData(mosaicName){
        let mosaic = this.mosaicNameToId(mosaicName);
        if(this.mosaicMetaData[mosaicName]){
            return;
        }
        let m = await this.getMosaicDefinitions(mosaic.namespaceId, mosaic.name);
        let neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(m, [mosaic.name]);
        if(neededDefinition){
            let s = await this.getMosaicSupply(mosaicName);
            this.mosaicMetaData[mosaicName] = {};
            this.mosaicMetaData[mosaicName].mosaicDefinition = neededDefinition[mosaicName];
            this.mosaicMetaData[mosaicName].supply = s.supply;
        }
    }
    async addExtendsField(address, transaction){
        if(transaction["transaction"]){
            let t = transaction["transaction"];
            if(t["signer"]){
                let signer = nem.model.address.toAddress(t["signer"], this.network_id);
                t["signerAddress"] = signer;
                
                if(t["type"] == this.MULTISIGTRANSACTION){
                    t["recipient"] = t["otherTrans"]["recipient"];
                    t["message"] = t["otherTrans"]["message"];
                    t["amount"] = t["otherTrans"]["amount"];
                }
                if( t["type"] == this.IMPORTANCETRANSFER){
                    let msg = this.getTransalte("TRANSACTION__IMPORTANCE_TRANSFER");
                    t["recipient"] = msg;
                    t["amount"] = 0;
                    t["dw"] = "w";
                }
                if(t["type"] == this.PROVISIONNAMESPACE){
                    let msg = await this.getTransalte("TRANSACTION__PROVISION_NAMESPACE");
                    if(t["parent"]){
                        msg = msg + t["parent"] + "." + t["newPart"];
                    }else{
                        msg = msg + t["newPart"];
                    }
                    t["recipient"] = msg;
                    t["amount"] = 100;
                    t["dw"] = "w";
                }
                if(t["type"] == this.MOSAICSUPPLY){
                    let msg = await this.getTransalte("TRANSACTION__MOSAIC_SUPPLY");
                    let mid = this.mosaicIdToName(t["mosaicId"]);
                    t["recipient"] = msg + " \"" + mid + "\"";
                    t["amount"] = 0;
                    t["dw"] = "w";
                }
                if( t["type"] == this.MOSAICDEFINITION ){
                    let msg = await this.getTransalte("TRANSACTION__MOSAIC_DEFINITION");
                    let mid = this.mosaicIdToName(t["mosaicDefinition"]["id"]);
                    t["recipient"] = msg + " \"" + mid + "\"";
                    t["amount"] = t["creationFee"];
                    t["dw"] = "w";
                }
                if(t["type"] == this.TRANSFER || t["type"] == this.MULTISIGTRANSACTION){
                    if(address == t["recipient"] && signer != address){
                        t["dw"] = "d";
                    }else if(address == t["recipient"] && signer == address){
                        t["dw"] = "e";
                    }else{
                        t["dw"] = "w";
                    }
                }
            }
        }
        return transaction;
    }
    private connector(address, node){
        if(address != "" && this.connecting == false && node){
            let websocket = nem.model.objects.create("endpoint")(node.host, node.ws_port);
            this.ws_connector = nem.com.websockets.connector.create(websocket, address);
            this.ws_connector.connect().then(()=> {
                this.connecting = true;
                this.store.dispatch(new AccountAction.SetWsConnecting(this.connecting));
                nem.com.websockets.subscribe.account.data(this.ws_connector, (res)=> {
                    if(res){
                        this.store.dispatch(new AccountAction.SetAmount(res["account"].balance));
                    }
                });

                nem.com.websockets.subscribe.account.transactions.unconfirmed(this.ws_connector, async (res)=> {
                    let ding = new Audio('../assets/audio/ding.ogg');
                    ding.play();
                    res = await this.addExtendsField(address, res);
                    res["u"] = true;
                    this.store.dispatch(new AccountAction.AddUnconfirm(res));
                    nem.com.websockets.requests.account.data(this.ws_connector);
                });
                nem.com.websockets.subscribe.account.transactions.confirmed(this.ws_connector, async(res)=> {
                    let ding = new Audio('../assets/audio/ding2.ogg');
                    ding.play();
                    this.store.dispatch(new AccountAction.DelUnconfirm(res));
                    nem.com.websockets.requests.account.data(this.ws_connector);
                    res = await this.addExtendsField(address, res);
                    this.store.dispatch(new AccountAction.AddTransactions(res));
                    if(res.transaction.mosaics){
                        this.getAccountMosaicsOwned(address);
                    }
                });

                nem.com.websockets.requests.account.data(this.ws_connector);
            },
            err => {
                this.connecting = false;
                this.store.dispatch(new AccountAction.SetWsConnecting(this.connecting));
                console.error(err);
            });
        }
    }
    connect(address){
        this.connector(address, this.node);
    }
    disconnect(){
        if(this.ws_connector != null){
            this.ws_connector.close();
            this.init();
        }
    }
    reconnector(address){
        if(this.ws_connector != null){
            this.ws_connector.close();
            this.connecting = false
            this.store.dispatch(new AccountAction.SetWsConnecting(this.connecting));
            this.connector(address, this.node);
        }
    }

    getConnecting(){
        return this.connecting;
    }

    prepareTransaction(amount, recipient:string = "", message:string = "",mosaics:any = []) {
        amount = this.convAmountToDiv(amount);
        let cleanTransferTransaction = nem.model.objects.get("transferTransaction");
        cleanTransferTransaction.recipient = recipient;
        cleanTransferTransaction.message = message;
        cleanTransferTransaction.messageType = 1;

        let entity:any;
        let common = nem.model.objects.create("common")(this.password, "");
        nem.crypto.helpers.passwordToPrivatekey(common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
        if(mosaics.length >= 1){
            cleanTransferTransaction.amount = 1;
            let arr = [];
            if(amount>0){
                let xemMosaic = nem.model.objects.create("mosaicAttachment")("nem", "xem", amount);
                arr.push(xemMosaic);
            }
            for(let i=0; i < mosaics.length; i++){
                let mid = this.mosaicNameToId(mosaics[i].name);
                let m = nem.model.objects.create("mosaicAttachment")(mid.namespaceId, mid.name, mosaics[i].amount); 
                arr.push(m);
            }
            let m = this.cleanMosaicAmounts(arr, this.mosaicMetaData);
            cleanTransferTransaction.mosaics = m;
            entity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, cleanTransferTransaction, this.mosaicMetaData, this.network_id);
        }else{
            cleanTransferTransaction.amount = amount;
            cleanTransferTransaction.mosaics = null;
            entity = nem.model.transactions.prepare("transferTransaction")(common, cleanTransferTransaction, this.network_id);
        }
        return entity;
    }
    async getMosaicDefinitions(namespaceId, name): Promise<any>{
        let m = nem.model.objects.create("mosaicAttachment")(namespaceId, name, 0); 
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        nem.com.requests.namespace.mosaicDefinitions(endpoint, m.mosaicId.namespaceId);
        let id = null;
        let flg = true;
        let mosaics = [];
        while (flg) {
            try{
                let res = await nem.com.requests.namespace.mosaicDefinitions(endpoint, namespaceId, "",id);
                if(id == res.data[res.data.length-1].meta.id){
                    flg = false;
                    break
                }
                id = res.data[res.data.length-1].meta.id;
                mosaics = mosaics.concat(res.data);
            }catch(e){
                console.log(e);
                flg = false;
            }
        }
        return mosaics;
    }
    getMosaicSupply(mosaicId): Promise<any>{
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        return nem.com.requests.mosaic.supply(endpoint, mosaicId);
    }
    send(entity){
        let common = nem.model.objects.create("common")(this.password, "");
        nem.crypto.helpers.passwordToPrivatekey(common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        let promise =  nem.model.transactions.send(common, entity, endpoint);
        return Observable.fromPromise(promise);
    }
    cleanMosaicAmounts(elem, mosaicDefinitions) {
        let copy;
        if(Object.prototype.toString.call(elem) === '[object Array]') {
            copy = JSON.parse(JSON.stringify(elem));
        } else {
            let _copy = [];
            _copy.push(JSON.parse(JSON.stringify(elem)))
            copy = _copy;
        }
        for (let i = 0; i < copy.length; i++) {
            if(!nem.utils.helpers.isTextAmountValid(copy[i].quantity)) {
                return [];
            } else {
                let divisibility = mosaicDefinitions[nem.utils.format.mosaicIdToName(copy[i].mosaicId)].mosaicDefinition.properties[0].value;
                copy[i].quantity = Math.round(nem.utils.helpers.cleanTextAmount(copy[i].quantity) * Math.pow(10, divisibility));
            }
        }
        return copy;
    }
    mosaicNameToId(name){
        let m = name.split(":");
        return {namespaceId:m[0], name:m[1]};
    }
    mosaicIdToName(mosaicId){
        return nem.utils.format.mosaicIdToName(mosaicId);
    }
    validQRCode(obj){
        if(obj["v"] && obj["type"] && obj["data"]){
            if((obj["type"] == 1 || obj["type"] == 2) && obj["v"] == this.v){
                let d = obj["data"];
                if(this.isAddressValid(d["addr"])){
                    return true;
                } else{
                    return false;
                }
            }
            if(obj["type"] == 3){
                return true;
            }
        }
        return false;
    }
    convAmountToDiv(amount){
        return amount / 1000000;
    }
    convDivToAmount(amount){
        return amount * 1000000;
    }
    getAliasAddress(name){
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        return nem.com.requests.namespace.info(endpoint, name);
    }
    getSendInvoice(address, amount, msg:string = "", mosaics:any=[]){
        let obj = nem.model.objects.create("invoice")();
        obj["v"] = this.v;
        obj["type"] = INVOICE_QR;
        obj["data"].addr = address;
        obj["data"].amount = amount;
        obj["data"].msg = msg;
        if(mosaics.length>0){
            obj["data"].mosaics = mosaics;
        }
        return obj;
    }
    isAddressValid(address){
        var isValid = nem.model.address.isValid(address);
        return isValid;
    }
    getInvoice(amount){
        let obj = this.getSendInvoice(this.address, amount);
        return obj;
    }
    getDateTime(){
        let today = new Date();
        return today.getFullYear() + "" + ("0" + (today.getMonth()+1)).slice(-2) + "" +  ("0"+today.getDate()).slice(-2) + "" + ("0"+today.getHours()).slice(-2) + "" + ("0"+today.getMinutes()).slice(-2) + "" + ("0"+today.getSeconds()).slice(-2);
    }
    fmtHexToUtf8Pipe(value){
        return nem.utils.format.hexToUtf8(value);
    }
    async decodeMsg(value, signer, recipient){
        let common = nem.model.objects.create("common")(this.password, "");
        nem.crypto.helpers.passwordToPrivatekey(common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
        let kp = nem.crypto.keyPair.create(common.privateKey);
        let decoded = "";
        if(kp.publicKey.toString() !== signer){
            decoded = nem.crypto.helpers.decode(common.privateKey, signer, value);
        }else{
            let a = await this.getAccountData(recipient);
            decoded = nem.crypto.helpers.decode(common.privateKey, a.account.publicKey, value);
        }

        return decoded;
    }
    getAccountData(r){
        let endpoint = nem.model.objects.create("endpoint")(this.node.host, this.node.port);
        return nem.com.requests.account.data(endpoint, r);
    }
    getTransalte(key) {
        return this.translate.get(key).toPromise();
    }
    loginCheck(p){
        try{
            let common = nem.model.objects.create("common")(p, "");
            nem.crypto.helpers.passwordToPrivatekey(common, this.wallet.accounts[0], this.wallet.accounts[0].algo);
            let keyPair = nem.crypto.keyPair.create(common.privateKey);
            let publicKey = keyPair.publicKey.toString();
            let address = nem.model.address.toAddress(publicKey, this.network_id)

            if(address == this.address){
                return true;
            }else{
                return false;
            }
        }catch(e){
            console.log(e);
            return false;
        }

    }
}
