var conn = require('./db')

module.exports = {

    render(req, res, error){

        res.render('admin/login', {
            body: req.body,
            error,
        });

    },

    login(email, password){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
            `,[
                email
            ],(err, results)=>{                

                if(err)
                    reject(err);
                else{

                    if(!results.length > 0){
                        reject({
                            message:"Usuário ou senha incorretos"
                        });
                    }else{

                        let row = results[0];

                        if(row.password !== password){
                            reject({
                                message:"Usuário ou senha incorretos"
                            });
                        }else{
                            resolve(row);
                        }
                        
                    }                    
                
                }

            });

        });

    },

    getUsers(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users ORDER BY id
            `, (err, response)=>{

                if(err)
                    reject(err);
                else{

                    resolve(response);
                    
                }

            });

        });
        
    },

    save(fields){

        return new Promise((resolve, reject)=>{

            let query, params;

            if(fields.id){                

                query = `
                UPDATE tb_users
                SET 
                    name=?, 
                    email=?
                WHERE id=?
                `;
                params = [
                    fields.name,
                    fields.email,
                    fields.id
                ]          
                
            }else{                

                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES(?, ?, ?)
                `;
                params = [
                    fields.name,
                    fields.email,
                    fields.password
                ]
            }

            conn.query(query, params, (err, results)=>{

                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }

            });

        });

    },

    changePassword(fields){

        return new Promise((resolve, reject)=>{

            if(!fields.password){
                reject("Preencha a senha")

            } else if (!fields.passwordConfirm){
                reject("Preencha a confirmação")
    
            }else if(fields.password !== fields.passwordConfirm){
                reject("Senha e confirmção não combinam")
                
            }else{
    
                conn.query(`
                UPDATE tb_users
                SET password=?
                WHERE id=?
                `, [
                    fields.password,
                    fields.id
                ], (err, results)=>{
        
                    if(err){
                        reject(err.message);
                    }else{
                        resolve(results);
                    }
        
                });    
    
            }
    

        })

        
        
    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
            DELETE FROM tb_users WHERE id=?
            `,[
                id
            ], (err, results)=>{
    
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
    
            });

        });        

    }


};