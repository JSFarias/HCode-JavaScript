export class MicrophoneController{
    constructor(){

        navigator.mediaDevices.getUserMedia({ 
            audio: true
        }).then(stream=>{

            console.log('sucess', stream);
            
            this._stream = stream;   
            
            let audio2 = new Audio();
            audio2.srcObject = stream;
            audio2.play();

        }).catch(err=>{
            console.log('err', err);
        });

    }

    SendAudio(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
        return this._audio;
    }

    Stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}