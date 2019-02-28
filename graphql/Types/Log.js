module.exports = `
        "A type that describes the log."
        type Log {
          "the elasticsearch id"
          _id: ID!
          "function where the log originated from"
          source_function: String!
          "system can be oracle, sap, sharepoint,..."
          source_system: String!
          "globally unique identifier"
          log_guid: String!
          "log_level"
          log_level: String!
          "application code (LDS,MZE,LDSI,...)"
          application_code: String!
          "log attachments, ..."
          application_context: String!
          "created_at format: yyyy-MM-dd'T'HH:mm:ss (example:2019-02-04T15:19:03)"
          created_at: String!
          log_message: String!
          "the stack trace"
          call_stack: String!
          created_by: String!
        }
        "the optional inputs that can be inserted"
        input SearchInput{
          application_code: String
          log_level: String
          source_system: String
          "created at must be greater than or equal to... date format:YYYY-MM-DD"
          created_at_gte: String
          "created at must be less than or equal to... date format:YYYY-MM-DD"
          created_at_lte: String
        }

        type Query {
          "Can search all logs or search with optional filters."
          logsSearch(searchInput : SearchInput) : [Log]
        }
`