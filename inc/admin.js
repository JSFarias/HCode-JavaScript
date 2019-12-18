var conn = require('./db')

module.exports = {

    dashboard(){
        
        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_users) AS nrusers;
            `, (err, results)=>{

                if(err)
                    reject(err);
                else
                {
                    resolve(results[0]);
                }

            });

        });        
        
    },

    getParams(req, params){
        return Object.assign({}, {
            activeUrl: req.url,
            user: req.session.user
        }, params);
    },

}