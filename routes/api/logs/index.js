// api/logs/..... 
const express = require('express')
const router = express.Router() // get an instance of the express Router
const axios = require('axios')
const fs = require('fs')
const validator = require('validator')
const elasticsearch_connection = require(`../../../elasticsearch/connection`)

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
    argsBuilder = [...argsBuilder, { "match": { "source_system": `${req.params.source_system}` } }, { "match": { "application_code": `${req.params.app_code}` } }]
    // console.log(Object.keys(req.query).length)
    if (Object.keys(req.query).length !== 0) {
        if (req.query.log_level)
            argsBuilder = await [...argsBuilder, { "match": { "log_level": `${req.query.log_level}` } }]
        if(req.query.log_guid) argsBuilder = await [...argsBuilder, { "match": { "log_guid": `${req.query.log_guid}` } }]
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
    let elasticResponse = await conn.search({
        index: 'logstash*',
        type: 'doc',
        body: {
            "query": queryBuilder,
            "_source": { "includes": include_fields },
            "size": "500",
            "sort": { "created_at": { "order": "asc" } }
        }
    })
    res.json({ 'params': req.params, 'query string': req.query , 'response':elasticResponse.hits.hits})
})

module.exports = router

//     var graphQLResponse = [] // initialization of the graphql response
//     elasticResponse.hits.hits.forEach(async (row) => {
//         row._source._id = row._id   // putting the elasticserach unique _id
//         graphQLResponse = [...graphQLResponse, row._source]
//     })
//     return graphQLResponse
// }