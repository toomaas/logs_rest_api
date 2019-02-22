const oracledb = require('oracledb') // node official oracle driver

oracledb.outFormat = oracledb.OBJECT // rows will be fetched as javascript objects. the property names will follow oracles standar name casing rules
module.exports.get = async function (req, res) {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.ORPWD,
            connectString: process.env.CONN_STRING
        })
        let app_codes = await connection.execute('SELECT DISTINCT APP_CODE FROM JALD_ALERTING_EMAILS')
        let result = {app_codes:app_codes.rows}
        //returns all app_codes 
        res.send(result)
    } catch (error) {
        console.log(error)
    }
}
