const logsSearch = require("./logsSearch")

module.exports={
  logsSearch: async (args)=>{
    return logsSearch(args.searchInput)
  }
}
