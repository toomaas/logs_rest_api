module.exports = `
        "A type that describes the log."
        type Log {
            "the elasticsearch unique id of this entry"
          _id: ID!
            "function where the log originated from"
          source_function: String!
           "system can be oracle, sap, sharepoint,..."
          source_system: String!
            "globally unique identifier"
          log_guid: String!
            "INFO, ERROR, FATAL_ERROR, DEBUG, WARNING"
          log_level: String!
            "application code (LDS,MZE,LDSI,...)"
          application_code: String!
            "log attachments, ..."
          application_context: String!
            "created_at response format: yyyy-MM-dd'T'HH:mm:ss (example:2019-02-04T15:19:03)"
          created_at: String!
          log_message: String!
            "the stack trace"
          call_stack: String!
          created_by: String!
        }
          "the optional inputs that can be inserted"
        input LogsSearchInput{
            "application code (ex: MAT, MZE, LDS)"
          application_code: String
            "INFO, ERROR, FATAL_ERROR, DEBUG, WARNING"
          log_level: String
            "system can be oracle, sap, sharepoint,..."
          source_system: String
            "created at must be greater than or equal to... date format: YYYY-MM-DD"
          created_at_gte: String
            "created at must be less than or equal to... date format: YYYY-MM-DD"
          created_at_lte: String
          log_guid: String
        }

        type Query {
            "Can search all logs or search with optional filters."
          logsSearch(searchInput : LogsSearchInput) : [Log]
        }
`