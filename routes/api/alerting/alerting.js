const oracledb = require('oracledb') // node official oracle driver
const email_validator = require('email-validator') // a simple module to validate an email address
oracledb.outFormat = oracledb.OBJECT // rows will be fetched as javascript objects. the property names will follow oracles standar name casing rules

async function oracle_conn() {
    return oracledb.getConnection({
        user: process.env.USER,
        password: process.env.ORPWD,
        connectString: process.env.CONN_STRING
    })
}

module.exports.get = async function (req, res) {
    try {
        const connection = await oracle_conn()
        let app_codes = await connection.execute('SELECT DISTINCT APP_CODE FROM JALD_ALERTING_EMAILS')
        let app_emails = {}
        for (let row of app_codes.rows) {
            let emails = await connection.execute(`SELECT EMAIL FROM JALD_ALERTING_EMAILS WHERE APP_CODE LIKE '${row.APP_CODE}'`)
            app_emails[[row.APP_CODE]] = emails.rows
        }
        let oracle_configs = {
            emails_per_application: app_emails
        }
        res.send(oracle_configs)
    } catch (error) {
        console.log(error)
    }
}

module.exports.post = async function (req, res) {
    try {
        let validate_email = await email_validator.validate(req.body.email)
        if (validate_email) {
            // valid email



        } else {
            res.send('not a valid email')
        }
        // const connection = await oracledb.getConnection({
        //     user: process.env.USER,
        //     password: process.env.ORPWD,
        //     connectString: process.env.CONN_STRING
        // })
        // let app_codes = await connection.execute('SELECT DISTINCT APP_CODE FROM JALD_ALERTING_EMAILS')
        // let result = {app_codes:app_codes.rows}
        // res.send(result)

    } catch (error) {
        console.log(error)
    }
}