const oracledb = require('oracledb') // node official oracle driver

oracledb.outFormat = oracledb.OBJECT // rows will be fetched as javascript objects. the property names will follow oracles standar name casing rules
module.exports.get = async function (req, res) {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.ORPWD,
            connectString: process.env.CONN_STRING
        })
        let emails = await connection.execute(`SELECT EMAIL FROM JALD_ALERTING_EMAILS WHERE APP_CODE LIKE '${req.params.app_code}'`)
        let result = {emails:emails.rows}
        //returns all emails given a specific app_code
        res.send(result)
    } catch (error) {
        console.log(error)
    }
}