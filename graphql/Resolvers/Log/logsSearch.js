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

module.exports = async function (args) {
    let queryBuilder = {}   // initialization of the query as an object
    if (typeof args === 'undefined') {
        // when no arguments are passed, a full query will be made
        queryBuilder = await {
            "match_all": {}
        }
    } else {
        //if there are arguments, then the query must be constructed based on the argument
        let argsBuilder = []
        if (args.application_code)
            argsBuilder = await [...argsBuilder, { "match": { "application_code": `${args.application_code}` } }]
        if (args.log_level)
            argsBuilder = await [...argsBuilder, { "match": { "log_level": `${args.log_level}` } }]
        if (args.source_system)
            argsBuilder = await [...argsBuilder, { "match": { "source_system": `${args.source_system}` } }]
        if (args.log_guid) argsBuilder = await [...argsBuilder, { "match": { "log_guid": `${args.log_guid}` } }]
        // if there are dates in the arguments then the range query will be constructed
        if (args.created_at_gte || args.created_at_lte) {
            // these are the formats allowed. dates will be parsed bases on the specified formats. 
            // If a date with a wrong format is sent, an error will ocurr from the elasticsearch database
            let created_at = { "format": "yyyy-MM-dd" }
            if (args.created_at_gte) created_at['gte'] = `${args.created_at_gte}`
            if (args.created_at_lte) created_at['lte'] = `${args.created_at_lte}`
            // the "crated_at" field is the date that the log occured (it is not the date that the log was introduced in elasticsearch DB)
            argsBuilder = await [...argsBuilder, { "range": { "created_at": created_at } }]
        }
        // "bool:must" means that all these filters must occur for the log to be a match
        queryBuilder = { "bool": { "must": argsBuilder } }
    }
    console.log('graphql querybuilder', JSON.stringify(queryBuilder))
    //makes an elasticsearch query, returning documents that match the query
    var conn = await elasticsearch_connection() // makes the connection to elaticsearch
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
    var graphQLResponse = [] // initialization of the graphql response
    elasticResponse.hits.hits.forEach(async (row) => {
        row._source._id = row._id   // putting the elasticserach unique _id
        graphQLResponse = [...graphQLResponse, row._source]
    })
    return graphQLResponse
}