const oracledb = require('oracledb') // node official oracle driver
const email_validator = require('email-validator') // a simple module to validate an email address
oracledb.outFormat = oracledb.OBJECT // rows will be fetched as javascript objects. the property names will follow oracles standar name casing rules~
oracledb.autoCommit = true; //commit at the end of each execution

//oracle connection
async function oracle_conn() {
    return oracledb.getConnection({
        user: process.env.USER,
        password: process.env.ORPWD,
        connectString: process.env.CONN_STRING
    })
}

//get all app codes and emails to alert for each app code
module.exports.get = async function (req, res) {
    try {
        const connection = await oracle_conn()
        //gets all app codes
        let app_codes = await connection.execute('SELECT DISTINCT APP_CODE FROM JALD_ALERTING_EMAILS')
        let app_emails = {}
        for (let row of app_codes.rows) {
            //gets all emails for each app code
            let emails = await connection.execute(`SELECT EMAIL FROM JALD_ALERTING_EMAILS WHERE APP_CODE = '${row.APP_CODE}'`)
            //constructs an object with all emails per app code
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

//adds an email to a specific app code so that it can later be alerted in case some error or fatal error ocurrs
module.exports.post = async function (req, res) {
    //the request must be an array
    if (Array.isArray(req.body)) {
        const connection = await oracle_conn()
        //for each entry of the array will add an email related to an app code to the db
        for (let row of req.body) {
            try {
                let is_valid_email = await email_validator.validate(row.email)
                //checks if the email is valid and if the app_code exists
                if (is_valid_email && typeof row.app_code !== 'undefined' && row.app_code !== '') {
                    var insert_query = `INSERT INTO JALD_ALERTING_EMAILS (APP_CODE,EMAIL) VALUES ('${row.app_code}','${row.email}')`
                    //inserts in the db
                    let insert_result = await connection.execute(`${insert_query}`)
                    //if everything went fine then outputs successfull insertion
                    console.log(`${row.email} added to ${row.app_code}`)
                    res.write(`${row.email} added to ${row.app_code} \n`)
                } else {
                    //when the validation of email or app_code gives a false
                    console.log(`ERROR: not a valid input {app_code:'${row.app_code}',email:'${row.email}'} \n`)
                    res.write(`ERROR: not a valid input {app_code:'${row.app_code}',email:'${row.email}'} \n`)
                }
            } catch (error) {
                let error_message = `ERROR: ${error.message} on the following query: ${insert_query}`;
                console.log(error_message)
                res.write(`${error_message} \n`)
            }
        }
    }
    res.end()
}

//removes an email from a specific app code
module.exports.delete = async function (req, res) {
    //the request must be an array
    if (Array.isArray(req.body)) {
        const connection = await oracle_conn()
        //for each entry of the array will delete the email related to an app code on the db
        for (let row of req.body) {
            try {
                let is_valid_email = await email_validator.validate(row.email)
                //checks if the email is valid and if the app_code exists
                if (is_valid_email && typeof row.app_code !== 'undefined' && row.app_code !== '') {
                    var delete_query = `DELETE FROM JALD_ALERTING_EMAILS WHERE APP_CODE = '${row.app_code}' AND EMAIL = '${row.email}'`
                    //inserts in the db
                    let delete_result = await connection.execute(`${delete_query}`)
                    //if everything went fine then outputs successfull insertion
                    console.log(`${row.email} deleted from ${row.app_code}`)
                    res.write(`${row.email} deleted from ${row.app_code} \n`)
                } else {
                    //when the validation of email or app_code gives a false
                    console.log(`ERROR: not a valid input {app_code:'${row.app_code}',email:'${row.email}'} \n`)
                    res.write(`ERROR: not a valid input {app_code:'${row.app_code}',email:'${row.email}'} \n`)
                }
            } catch (error) {
                let error_message = `ERROR: ${error.message} on the following query: ${delete_query}`;
                console.log(error_message)
                res.write(`${error_message} \n`)
            }
        }
    }
    res.end()
}