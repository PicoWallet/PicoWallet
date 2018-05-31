import { Injectable } from '@angular/core';
import {ToastController, AlertController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class UtilProvider {

    constructor(
        private toastCtrl: ToastController,
        public translate: TranslateService,
        private alertCtrl: AlertController
    ) {
    }

    basicAlert(title:string, subtitle:string = "", buttons:any = {text:'OK'}) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: [buttons]
        });
        alert.present();
    }
    promptAlert(title:string, msg:string = "", inputs:any = [], okHandler:any = (data) => {},cancelHandler:any = (data) => {}) {
        let prompt = this.alertCtrl.create({
            title: title,
            message: msg,
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    handler: cancelHandler
                },
                {
                    text: 'OK',
                    handler: okHandler
                }
            ]
        });
        prompt.present();
    }
    confirmAlert(title:string, msg:string = "", OK:any = {text:"OK"},Cancel:any = {text:"Cancel"}) {
        let prompt = this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: [
                Cancel, OK
            ]
        });
        prompt.present();
    }
    showCheckbox(title:string, inputs:any = [], okHandler:any = (data) => {}) {
        let alert = this.alertCtrl.create();
        alert.setTitle(title);
        for(let i=0;i<inputs.length;i++){
            alert.addInput(inputs[i]);
        }
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: okHandler
        });
        alert.present();
    }
    toast(message, duration:number = 300, pos:string = "top",css:string = ""): void {
        let toast = this.toastCtrl.create({
            message:  message,
            duration: duration,
            position: pos,
            cssClass: css
        });
        toast.present();
    }
    copy(text){
        var temp = document.createElement('div');
        temp.appendChild(document.createElement('pre')).textContent = text;

        var s = temp.style;
        s.position = 'fixed';
        s.left = '-100%';

        document.body.appendChild(temp);
        document.getSelection().selectAllChildren(temp);

        var result = document.execCommand('copy');

        document.body.removeChild(temp);
        if(result){
            let toast = this.toastCtrl.create({
                message: 'コピーしました',
                duration: 300,
                position: 'top'
            });
            toast.present();
        }
        return result;
    }
    getTransalte(key) {
        return this.translate.get(key).toPromise();
    }
    setTransalte(lang) {
        localStorage.setItem("lang", lang);
        try{
            this.translate.use(lang);
        }catch(e){
            console.log(e);
        }
    }
    isJson(arg){
        arg = (typeof(arg) == "function") ? arg() : arg;
        if(typeof(arg) != "string"){return false;}
        try{arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);return true;}catch(e){return false;}
    }
}
