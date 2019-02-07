var axios = require('axios');

module.exports.get = async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    res.write('<iframe src="http://10.11.112.38:5601/api/reporting/jobs/download/jrs1o51o05uw6c16d27jn3z0" height="100%" width="100%" style="border:none;"></iframe>');
    res.end();
    //res.sendFile(__dirname+'/downloadcsv.html');
};

module.exports.post = async function (req, res) {
    let data = req.body;
    let url = 'http://10.11.112.38:5601/api/reporting/generate/csv?jobParams=(conflictedTypesFields:!(),fields:!(created_at,source_system,source_function,log_message,log_level,log_guid,created_by,created_at,call_stack,application_context,application_code),indexPatternId:%2719ae4010-231b-11e9-ab06-89935a905d0b%27,metaFields:!(_source,_id,_type,_index,_score),searchRequest:(body:(_source:(excludes:!(),includes:!(created_at,source_system,source_function,log_message,log_level,log_guid,created_by,call_stack,application_context,application_code)),docvalue_fields:!(),query:(bool:(filter:!((match_all:())),must:!((range:(created_at:(format:epoch_millis,gte:1516579200000,lte:1517184000000)))),must_not:!(),should:!())),script_fields:(),sort:!((created_at:(order:desc,unmapped_type:boolean))),stored_fields:!(created_at,source_system,source_function,log_message,log_level,log_guid,created_by,call_stack,application_context,application_code),version:!t),index:%27logstash*%27),title:%27full%20query%20search%27,type:search)';
    let config = {
        headers: {
            'kbn-xsrf': 'true'
        }
    }
    try {
       let result = await axios.post(url, data, config);
       res.send(result.data.path); 
       console.log(result);
    } catch (error) {
        console.log(error);
    }
};

