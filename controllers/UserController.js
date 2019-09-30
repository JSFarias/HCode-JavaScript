class UserController{
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){

        let _this = this; 
        //interessante, este this refere-se à este escopo, que será resgatado" para getValues,
        //pois se usar "this".getValues o escopo é dentro da função do addEventListener 'submit'

        this.formEl.addEventListener("submit", function(event){
            event.preventDefault();
            let values = _this.getValues();   
            
            //usando callback         
            // _this.getPhoto((content)=>{
            //     values.photo = content;
            //     _this.addLine(values);
            // });       

            _this.getPhoto().then(function(content){
                values.photo = content;
                _this.addLine(values);
            }, function(e){
                console.error(e);
            });
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

   getPhoto(){
    
    let _this = this;

    return new Promise(function(resolve, reject){

        let fileReader = new FileReader();

        let photoElement = [..._this.formEl.elements].filter(item=>{
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

    getValues(){

        let user = {};

        [...this.formEl.elements].forEach(function(field, index){
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
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    };

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.innerHTML = 
            `
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${dataUser.birth}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;
    
        this.tableEl.appendChild(tr);
    }
}