const firebase = require('firebase');
require('firebase/firestore');

export class Firebase{
    constructor(){
        
        // Your web app's Firebase configuration
        this._firebaseConfig = {
            apiKey: "AIzaSyALLo6BwxVVgnaYhyiC6Mxwrfn7geYVloM",
            authDomain: "whatsapp-clone-16d37.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-16d37.firebaseio.com",
            projectId: "whatsapp-clone-16d37",
            storageBucket: "whatsapp-clone-16d37.appspot.com",
            messagingSenderId: "584908329849",
            appId: "1:584908329849:web:215f61335439d269e995a8",
            measurementId: "G-R2M8304T58"
          };

        this.init()
    }

    init(){
        if(!this._initialized){
            firebase.initializeApp(this._firebaseConfig);
            firebase.analytics();

            // firebase.firestore().settings({
            //     timestampsInSnapshots: true
            // });

            this._initialized = true;
        }
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }
}