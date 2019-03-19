// api/logs/..... 
const express = require('express')
const router = express.Router() // get an instance of the express Router
const axios = require('axios')
// const fs = require('fs')
const elasticsearch_connection = require(`../../../elasticsearch/connection`)
const BaseJoi = require('joi')
//joi-date-extensions are Joi extensions for extra date rules, such as .format(). uses moment.js format
const JoiDateExtension = require('joi-date-extensions')
const Joi = BaseJoi.extend(JoiDateExtension)
// fields to include in the "_source" response object. this is used in the GET route
const include_fields = [
    "source_system",
    "application_code",
    "log_guid",
    "log_level",
    "source_function",
    "log_message",
    "application_context",
    "call_stack",
    "created_by",
    "created_at"
]

router.route('/:source_system/:app_code').get(async (req, res) => {
    // implicit coercion. turning query variables into a string
    let queryBuilder = {}   // initialization of the query as an object
    let argsBuilder = []
    for (const key in req.query) {
        req.query[key] += ""
    }
    // maximum number of logs in the response
    let limit
    if (req.query.limit && req.query.limit.match("^[0-9]+$")) limit = req.query.limit
    else limit = '500'
    argsBuilder = [...argsBuilder, { "match": { "source_system": `${req.params.source_system}` } }, { "match": { "application_code": `${req.params.app_code}` } }]
    // console.log(Object.keys(req.query).length)
    if (Object.keys(req.query).length !== 0) {
        if (req.query.log_level)
            argsBuilder = await [...argsBuilder, { "match": { "log_level": `${req.query.log_level}` } }]
        if (req.query.log_guid) argsBuilder = await [...argsBuilder, { "match": { "log_guid": `${req.query.log_guid}` } }]
        // if there are dates in the arguments then the range query will be constructed
        if (req.query.created_at_gte || req.query.created_at_lte) {
            // these are the formats allowed. dates will be parsed bases on the specified formats. 
            // If a date with a wrong format is sent, an error will ocurr from the elasticsearch database
            let created_at = { "format": "yyyy-MM-dd" }
            if (req.query.created_at_gte) created_at['gte'] = `${req.query.created_at_gte}`
            if (req.query.created_at_lte) created_at['lte'] = `${req.query.created_at_lte}`
            // the "crated_at" field is the date that the log occured (it is not the date that the log was introduced in elasticsearch DB)
            argsBuilder = await [...argsBuilder, { "range": { "created_at": created_at } }]
        }
    }
    queryBuilder = { "bool": { "must": argsBuilder } }
    let conn = await elasticsearch_connection() // makes the connection to elaticsearch
    try {
        let elasticResponse = await conn.search({
            index: 'logstash*',
            type: 'doc',
            body: {
                "query": queryBuilder,
                "_source": { "includes": include_fields },
                "size": limit,
                "sort": { "created_at": { "order": "asc" } }
            }
        })
        var response = [] // initialization of the graphql response
        elasticResponse.hits.hits.forEach(async (row) => {
            // row._source._id = row._id   // putting the elasticserach unique _id
            response = [...response, row._source]
        })
        res.send({ 'total hits': elasticResponse.hits.total, 'data': response })
    } catch (error) {
        let jsn = JSON.parse(error.response)
        //sends a 400 status code response with the details of the error, wich originated from elasticsearch
        res.status(400).send({ error:{name:jsn.error.root_cause[0].type,details:`${jsn.error.root_cause[0].reason}.${jsn.error.failed_shards[0].reason.caused_by.reason}`}})
    }
})

router.route('/').post(async (req, res) => {
    try {
        // Joi schema used to validate the input
        const schema = Joi.array().items(Joi.object().keys({
            source_system: Joi.string().regex(/^[a-zA-Z]*$/).required(),    // allows only letters with no spaces in between 
            application_code: Joi.string().regex(/^[a-zA-Z]*$/).required(),
            log_guid: Joi.string().required(),
            log_level: Joi.string().required(),
            source_function: Joi.string().required(),
            log_message: Joi.string().allow('').required(),
            application_context: Joi.string().allow('').required(),
            call_stack: Joi.string().allow('').required(),
            created_by: Joi.string().required(),
            created_at: Joi.date().format('YYYY-MM-DD HH:mm:ss').raw().required()   //uses the moment.js dates format                                                
        }));
        let data = req.body // request body
        let url = 'http://10.11.112.38:5000'    // logstash url
        let config = {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            },
            maxContentLength: 31457280 // maxlength 30 mb
        }
        // will validate the array of json logs with the joi schema.
        // allowUnknown:false doesnt allow the object to contain unknown keys
        let joiValidatedResult = await Joi.validate(data, schema, { allowUnknown: false })   // joiValidatedResult contains the validated original array of objects (if the validation went ok).
        let result = await axios.post(url, joiValidatedResult, config).catch(error => {throw {name:"Error with the logstash endpoint",details:error.message}})
        //if the post to logstash went ok, then will return an 'ok message' 
        res.send({ result: result.data })
        // //logs in a txt file the date and response of the post request to logstash
        // let stream = fs.createWriteStream('axios_logs.txt', { flags: 'a' })
        // stream.write(`${new Date().toISOString()} ${result.data}\n`)
    } catch (error) {
        if(typeof error.details === "object"){
            res.status(400)
            error.details = error.details[0].message  //when the error is from the validator, goes to the object and gets the message to be presented in the response 
        }
        else if (error.name && error.name === "Error with the logstash endpoint"){res.status(500)}
        else res.status(501) 
        // //logs in a txt file the date and response of the post request to logstash
        // let stream = fs.createWriteStream('axios_logs.txt', { flags: 'a' })
        // stream.write(`${new Date().toISOString()} ${JSON.stringify(error.details)}\n`)
        res.send({ error: { name: error.name, details: error.details} })
    }
})

module.exports = router