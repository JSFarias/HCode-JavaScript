var conn = require('./db');
var Pagination = require('./../inc/Pagination')

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

    getReservations(page){

        if(!page) page = 1;

        let pag = new Pagination(
            `SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ORDER BY name LIMIT ?, ?`
        );

        return pag.getPage(page);

    },

    save(fields){

        return new Promise((resolve, reject)=>{

            let date = '';

            if(fields.date.includes('/')){
                date = fields.date.split('/');  
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;    
            }            

            let query, params;

            params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ]

            if(fields.id){

                params.push(fields.id);

                query = `
                UPDATE tb_reservations SET
                    name=?,
                    email=?,
                    people=?,
                    date=?,
                    time=?
                 WHERE id = ?
                `;

            }
            else{
                query = `
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES(?, ?, ?, ?, ?)
                `
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

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `,[
                id
            ], (err, results)=>{

                if(err){
                    reject(err);
                }
                else{
                    resolve(results);

                }

            });

        });

    }

};
