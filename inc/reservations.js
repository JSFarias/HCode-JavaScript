var conn = require('./db');

module.exports = {

    render(req, res, error, success){
        
        res.render('reservations',{
            title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });
        
    },

    getReservations(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_reservations ORDER BY id
            `,(err, results)=>{

                if(err)
                    reject(err);
                else{
                    resolve(results);
                }

            });

        });

    },

    save(fields){

        return new Promise((resolve, reject)=>{

            let date = '';

            if(fields.date.includes('/')){
                date = fields.date.split('/');  
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;    
            }
            
            console.log(fields);
            conn.query(`
            INSERT INTO tb_reservations (name, email, people, date, time)
            VALUES(?, ?, ?, ?, ?)
            `,[
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ], (err, results)=>{

                if(err){
                    console.log("err",err);
                    reject(err);
                }else{
                    console.log("results",results);
                    resolve(results);
                }

            });

        });
      
    }

};
