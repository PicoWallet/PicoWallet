import { ViewChild, Component } from '@angular/core';
import { IonicPage, Content,Platform, AlertController, ModalController, NavController, NavParams } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';


@IonicPage()
@Component({
    selector: 'page-collect',
    templateUrl: 'collect.html',
})
export class CollectPage {
    @ViewChild(Content) content: Content;
    myAngularxQrCode: string = '';
    show:boolean = false;
    moreFlg:boolean = false;
    qr:any;
    constructor(
        public navCtrl: NavController,
        public plt: Platform, 
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public nem: NemProvider,
        public util: UtilProvider,
        public navParams: NavParams
    ) {
        this.qr = this.nem.getInvoice(0);
    }

    ionViewDidLoad() {
        this.refresh(this.qr);
    }
    async setAmount(){
        let modal = this.modalCtrl.create('SetAmountModalPage', {qr:this.qr});
        modal.onDidDismiss((qr)=> {
            if(qr){
                this.qr = qr;
                this.refresh(this.qr);
            }
        });
        modal.present();
    }
    async moreRefresh(qr){
        let msg = await this.util.getTransalte("COLLECT__REFRESH_QRCODE");
        this.util.toast(msg, 600, 'bottom');
        this.refresh(qr);
    }
    async refresh(qr){
        this.qr = qr;
        this.show = false;
        let obj = JSON.parse(JSON.stringify(this.qr));
        if(obj.data.mosaics){
            obj.data.mosaics.forEach(async (m) => {
                let d = await this.nem.getMosaicDivisibility(m.name);
                if(d>0){
                    let pow = Math.pow(10, d)
                    m.amount= pow * m.amount;
                }
            });
        }
        setTimeout(()=>{
            this.myAngularxQrCode = JSON.stringify(obj);
            this.show = true;
            this.content.scrollToTop(800);
        },30);
    }
    saveImage(){
        let b64Data= document.querySelector('#qrcode img').getAttribute("src");
        let blob = this.dataURItoBlob(b64Data);

        var url = window.URL || (window as any).webkitURL;
        var blobURL = url.createObjectURL(blob);

        if(this.plt.is('iphone')){
            window.location.href = blobURL;
        }else{
            let date = this.nem.getDateTime();
            var a = document.createElement('a');
            a.download = "payme_qr_" + date + ".png";
            a.href = blobURL;
            a.click();
        }
    }
    dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0){
            byteString = atob(dataURI.split(',')[1]);
        } else{
            return
        }
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }
    more(){
        this.moreFlg = true;
    }
}
