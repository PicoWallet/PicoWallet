import { ViewChild, Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import jsQR from "jsqr";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';
import { HomePage } from '../home/home';
import { Store } from '@ngrx/store';
import * as Action from '../../store/actions/account';


import {WALLET_QR, INVOICE_QR} from '../../config';


@IonicPage()
@Component({
    selector: 'page-qrcode',
    templateUrl: 'qrcode.html',
})
export class QrcodePage {
    @ViewChild('camera') camera: any;
    showing:boolean = false;
    faildFlg:boolean = false;
    hide:boolean = false;
    obs:any;
    canvasElement;
    canvas;
    guard:boolean = false;
    isiOS:boolean = false;

    QR_TYPE:number = 1;
    INVOICE_QR = INVOICE_QR;
    readonly medias: MediaStreamConstraints = {audio: false, video:  { facingMode: "environment" } };

    constructor(
        private store: Store<any>,
        public navCtrl: NavController,
        public plt: Platform,
        public nem: NemProvider,
        public util: UtilProvider,
        public navParams: NavParams
    ) {
    }

    ionViewDidLoad() {
        this.QR_TYPE = this.navParams.data.type;
        if(this.plt.is('ios')){
            this.isiOS = true;
        }
    }
    ionViewDidEnter() {
        this.guard = false;
        this.getCanvasElement();
        this.obs = Observable.interval(1).subscribe((x) => {
            if(this.showing){
                this.drawCanvasImage();
            }
        });
        this.showCamera();
    }
    ionViewWillLeave(){
        this.hideCamera();
        this.obs.unsubscribe();
    }
    getCanvasElement(){
        this.canvasElement = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas = this.canvasElement.getContext("2d");
    }
    drawCanvasImage(){
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasElement.hidden = false;
        this.canvasElement.height = this.camera.nativeElement.videoHeight;
        this.canvasElement.width = this.camera.nativeElement.videoWidth;
        this.canvas.drawImage(this.camera.nativeElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvas.width = this.camera.nativeElement.videoWidth;
        this.canvas.height = this.camera.nativeElement.videoHeight;
        if(this.canvas.width > 0 && this.canvas.height > 0){
            this.guard = true;
            try{
                let imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
                let ret = this.chkQRCode(imageData);
                if(ret == -1){
                    this.showing = true;
                }
            }catch(e){
                console.log(e);
            }
        }
    }
    chkQRCode(imageData){
        let success = -1;
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if(code){
            if(this.util.isJson(code.data) && this.showing){
                let obj = JSON.parse(code.data);
                let s = this.nem.validQRCode(obj);
                if(s && obj["type"] == this.QR_TYPE){
                    success = 1;
                    this.showing = false;
                    if(this.QR_TYPE == WALLET_QR){
                        this.importWallet(obj);
                    }else{
                        if(obj.data.amount==0 && !obj.data.mosaics){
                            this.navCtrl.push('PayEditPage', {qr: obj});
                        }else{
                            this.navCtrl.push('PayConfirmPage', {qr: obj});
                        }
                    }
                }else{
                    this.failedAlert("QR__FAILED_QR");
                }
            }
        }
        return success;
    }
    async importWallet(obj){
        let title = await this.util.getTransalte("QR__PLEASE_PASSWORD");
        let msg = await this.util.getTransalte("QR__PLEASE_PASSWORD_MSG");
        let inputs =  [ { name: 'password', placeholder: 'password', type: 'password' }, ];
        let okHandler = (data) => {
            if(data.password){
                let pass = data.password;
                let wallet = this.nem.importPrivateKeyWallet(obj["data"].name, pass, obj["data"].priv_key, obj["data"].salt, data.password, obj["v"]);
                if(wallet){
                    this.nem.disconnect();
                    this.store.dispatch(new Action.Delete());
                    this.nem.createAccount(wallet.accounts[0].address, pass, wallet, obj["v"]);
                    this.navCtrl.setRoot(HomePage);
                }else{
                    this.failedAlert("QR__FAILED_MSG");
                }
            }
        };
        let cHandler = () => {
            this.showing = true;
        };
        this.util.promptAlert(title, msg, inputs, okHandler, cHandler);
    }
    async failedAlert(key){
        if(this.faildFlg){
            return;
        }
        this.faildFlg = true;
        this.showing = false;
        let title = await this.util.getTransalte("GENERAL__FAILED");
        let msg = await this.util.getTransalte(key);
        let okHandler = () => {
            this.showing = true;
            this.faildFlg = false;
        };
        this.util.basicAlert(title, msg, { text: 'OK', handler: okHandler });
    }
    async showCamera(){
        try{
            let stream = await window.navigator.mediaDevices.getUserMedia(this.medias)
            this.camera.nativeElement.srcObject = stream;
            this.camera.nativeElement.setAttribute("playsinline", true);
            this.showing = true;
        }catch(e){
            alert(e);
            this.guard = true;
            this.showing = false;
            this.failedAlert("QR__FAILED_CAMERA_NOTFOUND");
        }
    }
    hideCamera(){
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.camera.nativeElement.pause(); 
        if(this.camera.nativeElement.srcObject){
            const track = this.camera.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;;
            track.stop(); 
        }
        this.hide = true;
        setTimeout(()=>{
            this.hide = false;
        },30);
    }
    back(){
        if(this.guard == true){
            this.navCtrl.pop();
        }
    }
    handleFileInput(e: any) {
        if(!e.target.files[0]){
            return;
        }
        let reader = new FileReader();
        reader.onload = (event) => { 
            let img = new Image();
            img.onload = () => {
                this.canvasElement.width = img.width;
                this.canvasElement.height = img.height;
                this.canvas.drawImage(img, 0, 0);
                let imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
                let ret = this.chkQRCode(imageData);
                if(ret == -1){
                    this.showing = true;
                }
                e.srcElement.value = "";
            };
            let target: any = event.target;
            img.src = target.result;
        };
        reader.readAsDataURL(e.target.files[0]); 
    }
    goToPayEditPage(){
        this.navCtrl.push('PayEditPage');
    }
}
