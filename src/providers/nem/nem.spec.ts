import { TestBed } from '@angular/core/testing';
import { NemProvider } from './nem';
import nemSdk from "nem-sdk";

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { reducers } from '../../store/index';
import * as fromRoot from '../../store/index';
import { Account } from '../../store/reducers/account';
import * as AccountAction from '../../store/actions/account';

import {TESTNET_V, MAINNET_V, INVOICE_QR,WALLET_QR} from '../../config';
import {MAINNET_NODE_LIST, TESTNET_NODE_LIST, NODE} from '../../nodelist';
import {mockWallet, MOCK4} from '../../jestGlobalMocks';

import {TranslateService, TranslateModule, TranslateLoader} from '@ngx-translate/core';

describe('NemProvider', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers),
                TranslateModule.forRoot(),
            ],
            providers: [NemProvider]
        });
    });
    describe('initial Provider',() => {
        let nem: NemProvider;
        beforeEach(() => {
            nem = TestBed.get(NemProvider);
        });
        it('init', () => {
            nem.init();
            expect(nem.network_id).toBe(0);
            expect(nem.connecting).toBe(false);
            expect(nem.ws_connector).toBe(null);
            expect(nem.wallet).toBe(null);
            expect(nem.password).toBe("");
            expect(nem.address).toBe("");
            expect(nem.node).toBe(null);
            expect(nem.v).toBe(0);
            expect(nem.mosaics).toBe(null);
            expect(nem.mosaicMetaData).toBe(null);
        })
    });
    describe('getNodeURL',() => {
        let nem: NemProvider;
        beforeEach(() => {
            nem = TestBed.get(NemProvider);
        });
        it('testnet', () => {
            expect(nem.getNodeUrl(TESTNET_NODE_LIST)).not.toBe("");
        })
        it('mainnet', () => {
            expect(nem.getNodeUrl(MAINNET_NODE_LIST)).not.toBe("");
        })
    });
    describe('setFunction',() => {
        let nem: NemProvider;
        beforeEach(() => {
            nem = TestBed.get(NemProvider);
        });
        it('address', () => {
            nem.setAddress("TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            expect("TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ").toBe(nem.address);
        })
        it('v', () => {
            nem.setV(TESTNET_V);
            expect(TESTNET_V).toBe(nem.v);
        })
        describe('network_id', () => {
            it('mainnet', () => {
                nem.setNetworkId(MAINNET_V);
                expect(nemSdk.model.network.data.mainnet.id).toBe(nem.network_id);
            })
            it('testnet', () => {
                nem.setNetworkId(TESTNET_V);
                expect(nemSdk.model.network.data.testnet.id).toBe(nem.network_id);
            })
            it('error', () => {
                expect(() => nem.setNetworkId(3)).toThrow("v is not setting.");
            })
        })
        it('node', () => {
            let node = nem.getNodeUrl(MAINNET_NODE_LIST);
            nem.setNode(node);
            expect(node.host).toBe(nem.node.host);
            expect(node.port).toBe(nem.node.port);
            expect(node.protocol).toBe(nem.node.protocol);
            expect(node.ws_port).toBe(nem.node.ws_port);
        })
        describe('node_init', () => {
            it('testnet', () => {
                nem.setNodeInit(TESTNET_V);
                expect(nem.node).not.toBe(null);
            })
            it('mainnet', () => {
                nem.setNodeInit(MAINNET_V);
                expect(nem.node).not.toBe(null);
            })
            it('error', () => {
                expect(() => nem.setNodeInit(3)).toThrow("v is not setting.");
            })
        })
        it('wallet', () => {
            nem.setWallet(mockWallet);
            expect(mockWallet).toBe(nem.wallet);
        })
        it('password', () => {
            nem.setPassword("test");
            expect("test").toBe(nem.password);
        })
        it('init', () => {
            nem.setAddress("TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            nem.setV(TESTNET_V);
            nem.setNetworkId(TESTNET_V);
            nem.setNode(nem.getNodeUrl(TESTNET_NODE_LIST));
            nem.setWallet(mockWallet);
            nem.setPassword("test");
            nem.init();
            expect(nem.address).toBe("");
            expect(nem.v).toBe(0);
            expect(nem.network_id).toBe(0);
            expect(nem.ws_connector).toBe(null);
            expect(nem.password).toBe("");
            expect(nem.node).toBe(null);
            expect(nem.connecting).toBe(false);
        })
    });
    describe('fee test with prepareTransaction', () => {
        let nem: NemProvider;
        beforeEach(() => {
            nem = TestBed.get(NemProvider);
            nem.setWallet(mockWallet);
            nem.setPassword("test");
            nem.setNetworkId(TESTNET_V);
            nem.setNode(nem.getNodeUrl(TESTNET_NODE_LIST));
        });
        it('10xem fee"', () => {
            let t= nem.prepareTransaction(nem.convDivToAmount(10) , "TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            expect(nem.convAmountToDiv(t.fee)).toBe(0.05);
        })
        it('10xem and Message fee"', () => {
            let t= nem.prepareTransaction(nem.convDivToAmount(10), "TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ","TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            expect(nem.convAmountToDiv(t.fee)).toBe(0.15);
        })
        it('20000xem fee"', () => {
            let t= nem.prepareTransaction(nem.convDivToAmount(20000), "TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            expect(nem.convAmountToDiv(t.fee)).toBe(0.1);
        })
        it('100000xem fee"', () => {
            let t= nem.prepareTransaction(nem.convDivToAmount(100000), "TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ");
            expect(nem.convAmountToDiv(t.fee)).toBe(0.5);
        })
        it('10 xem and mosaic fee"', async () => {
            await nem.initMetaData();
            await nem.addMosaicMetaData("greeting:yay");
            await nem.addMosaicMetaData("greeting:ya");
            let t = nem.prepareTransaction(nem.convDivToAmount(1), "TAO5MJ7J35XXZFTW6V5BJOAHTORFS7WOE2VKJBFQ", "" , [{name:"greeting:ya",amount:10}]);
            expect(nem.convAmountToDiv(t.fee)).toBe(0.1);
        })
    });
});
