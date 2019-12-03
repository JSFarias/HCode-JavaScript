import { Model } from "./Model";
import { Firebase } from "../util/Firebase";

export class Chat extends Model{
    constructor(){
        super();        
    }

    get users(){ return this._data.users; }
    set users(value){ return this._data.users = value; }

    get timeStamp() { return this._data.timeStamp; }
    set timeStamp(value) { return this._data.timeStamp = value; }

    // get type() { return this._data.type; }
    // set type(value) { return this._data.type = value; }

    // get status() { return this._data.status; }
    // set status(value) { return this._data.status = value; }

    // get from() { return this._data.from; }
    // set from(value) { return this._data.from = value; }

    static getRef(){ 
        return Firebase.db().collection('/chats');
    }

    static createIfNotExists(meEmail, contactEmail){
        return new Promise((s, f)=>{
            Chat.find(meEmail, contactEmail).then(()=>{
                //found
            }).catch(()=>{
                //create
            });
        });
    }
}