const conn = require('./db')

module.exports ={

    render(req, res, error, success, menuResults){

        res.render('index', {
            title: 'Restaurante Saboroso!',
            menus: menuResults,
            isHome: true,
            body: req.body,
            error,
            success
          })

    },

    save(fields){

        return new Promise((resolve, reject)=>{

            if(!fields.email){
                reject()
            }else{

                conn.query(`
                    INSERT INTO tb_emails (email)
                    VALUES(?)
                `,[
                    fields.email
                ],(err, result)=>{

                    if(err)
                    reject(err)
                    else
                    resolve(result)

                })
            }
        })

    }

}