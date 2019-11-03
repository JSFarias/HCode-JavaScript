import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent{
    constructor(){

        super();

        this._mimeType = 'audio/webm';
        this._available = false;

        navigator.mediaDevices.getUserMedia({ 
            audio: true
        }).then(stream=>{

            console.log('sucess', stream);
            
            this._stream = stream;   
            this._available = true;
            
            this.trigger('ready', this._stream);

        }).catch(err=>{
            console.log('err', err);
        });

    }

    sendAudio(){

        this._stream.getTracks().forEach(track => {
            track.stop();
        });
        return this._audio;

    }

    stop(){

        this._stream.getTracks().forEach(track => {
            track.stop();
        });

    }

    isAvailable(){

        return this._available;

    }

    startRecord(){

        if(this.isAvailable()){

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });
            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e=>{

                if(e.data.size > 0) this._recordedChunks.push(e.data);

            });

            this._mediaRecorder.addEventListener('stop', e=>{

                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                });
                let filename =  `rec_${Date.now()}.webm`;
                let file = new File([blob], filename, {
                    type: this._mimeType,
                    lastModified: Date.now(),
                });

                console.log('file',file);

                let reader = new FileReader();
                reader.onload = e=>{
                    console.log('reader', file);
                    let audio = new Audio(reader.result);
                    audio.play();
                }
                reader.readAsDataURL(file);

            });   
            
            this._mediaRecorder.start();
            this.startTimer();

        }

    }

    stopRecord(){
        if(this.isAvailable()){

            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();

        }
    }

    startTimer() {

        let start = Date.now();
        this._recordmicrophoneInterval = setInterval(() => {
            this.trigger('recordtimer', Date.now() - start);
            
        }, 100);

    }

    stopTimer(){
        clearInterval(this._recordmicrophoneInterval);
    }
}