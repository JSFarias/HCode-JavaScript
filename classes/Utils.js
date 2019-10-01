class Utils{
    static dateFormat(date){
        return date.getDate()+'/'+(date.getMonth({month:'short'})+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }
}