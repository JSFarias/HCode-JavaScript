const conn = require('./db')

module.exports = {

    getEmails(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_emails ORDER BY id
            `,(err, result)=>{

                if(err)
                    reject(err);
                else
                    resolve(result);

            });

        });

    },

    delete(id){

        return new Promise((resolve, reject)=>{
console.log('id***',id);
            conn.query(`
                DELETE FROM tb_emails WHERE id = ?                
            `,[
                id
            ], (err, result)=>{

                if(err)
                reject(err)
                else
                resolve(result)

            })

        })

    }

}