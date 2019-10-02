class UserController{
    constructor(formIdCreate, formIdUpdate, tableId){
        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);        
        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', (e)=>{
            this.showPanelCreate();            
        });

        this.formUpdateEl.addEventListener('submit', e=>{
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);   

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);  

            this.getPhoto(this.formUpdateEl).then((content)=>{

                if(!values.photo) result._photo = userOld._photo;
                else result._photo = content;
            
                let user = new User();               

                user.loadFromJSON(result);

                user.save();

                this.getTr(user, tr);

                this.updateCount();

                this.formUpdateEl.reset();
                
                btn.disabled = false;

                this.showPanelCreate();

            }, function(e){

                console.error(e);

            });

        });
    }

    onSubmit(){

        let _this = this; 
        //interessante, este this refere-se à este escopo, que será resgatado" para getValues,
        //pois se usar "this".getValues o escopo é dentro da função do addEventListener 'submit'

        this.formCreateEl.addEventListener("submit", function(event){
            event.preventDefault();
            let values = _this.getValues(_this.formCreateEl);   
            
            if(values){
                let btn = _this.formCreateEl.querySelector("[type=submit]");
                btn.disabled = true;

                //usando callback         
                // _this.getPhoto((content)=>{
                //     values.photo = content;
                //     _this.addLine(values);
                // });       

                _this.getPhoto(_this.formCreateEl).then(function(content){
                    values.photo = content;
                    values.save();
                    _this.addLine(values);
                    _this.formCreateEl.reset();
                    btn.disabled = false;
                }, function(e){
                    console.error(e);
                });
            }
        });

        //ou
        /*
        //podemos eliminar a palavra 'function' e aplicar um ARROW FUNCTION dizendo ao JS que o (event) é uma função anonima
        //desta forma o perde-se a ideia de escopo e o this.getvalues passa a funcionar e não precisamos mais do _this, este é um recurso no JS 2015

        this.formEl.addEventListener('submit', (event) => { //interessante, como recebe só 1 parâmetro podemos deixar 'event' sem parênteses
            event.preventDefault();
            this.getValues();
        });
        */
    }

    /*
    getPhoto(callback){
        
        let fileReader = new FileReader();

        let photoElement = [...this.formEl.elements].filter(item=>{
            if(item.name === 'photo')
                return item;
        });

        let loadedFile = photoElement[0].files[0];

        fileReader.onload = ()=>{             //
             callback(fileReader.result);
        };    
        fileReader.readAsDataURL(loadedFile);       

    }
    */

   getPhoto(formEl){
    

    return new Promise(function(resolve, reject){

        let fileReader = new FileReader();

        let photoElement = [...formEl.elements].filter(item=>{
            if(item.name === 'photo')
                return item;
        });
    
        let loadedFile = photoElement[0].files[0];
    
        fileReader.onload = ()=>{             
             resolve(fileReader.result);
        };  
        
        fileReader.onerror = (e)=>{
            reject(e);
        };
        
        if(loadedFile) fileReader.readAsDataURL(loadedFile);       
        else resolve("dist/img/boxed-bg.jpg");

    });    

}

    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == "gender")
            {
                if(field.checked) 
                    user[field.name] = field.value;
            }else if(field.name == "admin"){
                user[field.name] = field.checked;//? "Sim": "Não";
            }else{
                user[field.name] = field.value;
            }
        });

        if(!isValid) return false;

        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    };

    selectAll(){

        let users = this.getUsersStorage();

        users.forEach(dataUser=>{

            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user)

        });

    }

    getUsersStorage() {

        let users = [];
        if (localStorage.getItem("users"))
            users = JSON.parse(localStorage.getItem("users"));        
        return users;

    }

    addLine(dataUser){

        let tr = this.getTr(dataUser);
        
        this.tableEl.appendChild(tr);

        this.updateCount();

    }

    getTr(dataUser, tr = null) {
        
        if(tr === null) tr = document.createElement('tr');   

        tr.dataset.user = JSON.stringify(dataUser);    

        tr.innerHTML =
            `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
            `;

        this.addEventsTr(tr);    

        return tr;

    }

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener('click', e => {
            if(confirm("Deseja realmente excliur?")){

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);
            //let form = document.querySelector("#form-user-update");
            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]"); //form.querySelector("[name="+ name.replace("_", "")+"]");                
                this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]"); //form.querySelector("[name="+ name.replace("_", "")+"][value="+json[name]+"]");  
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        });

    }

    showPanelCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

}