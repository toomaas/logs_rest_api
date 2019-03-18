// api/logs/..... 
const express = require('express')
const router = express.Router() // get an instance of the express Router
const axios = require('axios')
const fs = require('fs')
const elasticsearch_connection = require(`../../../elasticsearch/connection`)
const Joi = require('joi')

// fields to include in the "_source" response object
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
    if(req.query.limit && req.query.limit.match("^[0-9]+$")) limit = req.query.limit
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
    console.log('rest api querybuilder', JSON.stringify(queryBuilder))
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
        if(elasticResponse.hits.total <= 0){
            res.status(404).send({error: 'No logs found matching the Request parameters'})
            return
        }
        var response = [] // initialization of the graphql response
        elasticResponse.hits.hits.forEach(async (row) => {
            // row._source._id = row._id   // putting the elasticserach unique _id
            response = [...response, row._source]
        })
        res.send({ 'total hits': elasticResponse.hits.total, 'data': response })
    } catch (error) {
        let jsn = JSON.parse(error.response)
        res.send({ error: jsn.error.failed_shards[0].reason.caused_by.reason })
        console.log({ error: jsn.error.failed_shards[0] })
    }
})

router.route('/').post(async (req, res) => {
    try {
        let data = req.body
        let url = 'http://10.11.112.38:5000'
        let config = {
            headers: {
                'Content-Type': 'application/json'
            },
            maxContentLength: 31457280 // maxlength 30 mb
        }
        let result = await axios.post(url, data, config)
        res.send({ data: result.data })
        let stream = fs.createWriteStream('axios_logs.txt', { flags: 'a' })
        stream.write(`${new Date().toISOString()} ${result.data}\n`)
    } catch (error) {
        res.send({ error: error })
        stream.write(`${new Date().toISOString()} error\n`)
    }
})

module.exports = router