// Parses IDs for entities out of the search API and dumps to console as a comma separated list. 
// This script is used for pulling lists of IDs out of the search API into a text file to be used
// in load testing.

// To use, edit the configurable variables below to your needs. Then, copy/paste into chrome dev tools
// and execute.  IDs are dumped to console as a single comma separated line. You can use notepad++ to 
// convert , into \r\n to create a file usable by JMeter CSV Data feature. 

// The searches run synchronously. 

(function(){

    // These variables are configurable
    var index = "cfda"; // index name. Valid values: cfda, opp, fh, ent, ex, wd, fpds
    var is_active = "true"; // active toggle. Valid: true, false
    var max_searches =  600; // Max searches/api calls to make
    var max_ids = 6000; // max IDs to fetch before stopping

    // Environment information
    var api_base_url = "https://api.sam.gov";
    var environment_path = "prodlike";
    var search_api_path = "sgs/v1/search";
    var api_key = "PUT YOUR API KEY HERE";
    
    // Nothing below here is supposed to be configurable. 
    // Edit at your own risk.

    var search_url = api_base_url 
      + "/" + environment_path 
      + "/" + search_api_path 
      + "/" + "?" + "api_key=" + api_key
      + "&" + "index=" + index
      + "&" + "is_active=" + is_active;
    var searches_performed = 0;
    var ids = [];

    // xhr helper to get the json responses from a url
    var getURL = function(url){
      var jsonResponse = {};
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);  //false means syncronous
      xhr.send(null);   
      if (xhr.status === 200) {
        jsonResponse = JSON.parse(xhr.responseText);
      } else {
        // bad, hope this doesn't occur
      }     
      return jsonResponse;
    }

    // helper to get IDs from json and push to the ids array
    var parseIds = function(data){
      var identifierAttribute = "_id";
      for (var i=0; i<data._embedded.results.length; i++){
      	if (index === 'ent') { // entities use dunsNumber, not _id
      		identifierAttribute = "dunsNumber";
      	}
        var id = data._embedded.results[i][identifierAttribute];
        ids.push(id);
      }      
    }

    // main body. hits search API until max search or ids are done
    // and stores ids, then outputs scraped IDs to console.
	var main = function(){	   
	    while (searches_performed < max_searches && ids.length < max_ids) {
	      // console.log("page " + searches_performed);
	      var currentURL = search_url + "&page=" + searches_performed;    
	      try {
	        parseIds(getURL(currentURL));
	      } catch (ex) { 
		console.dir(ex); 
	      }
	      searches_performed++;
	    }
	    console.log(ids.length + " found for index " + index);
	    console.log(ids.join(","));
    }
    if (api_key === "PUT YOUR API KEY HERE") {
	    console.log("You must enter an API key");
    } else {
        main();	
    }
})();
