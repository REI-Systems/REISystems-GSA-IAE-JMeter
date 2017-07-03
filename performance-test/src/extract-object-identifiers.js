// Parses IDs for entities out of the search API and dumps to console as
// a comma separated list. Used for pulling list of IDs as input to
// load testing procedures. This runs syncronously to reduce load on search API.
// Edit the configurable variables below then copy/paste this into the chrome dev tools console to run it.

(function(){

    // These variables are configurable
    var index = "ent"; // index name. Valid values: cfda, opp, fh, ent, ex, wd, fpds
    var is_active = "true"; // active toggle. Valid: true, false
    var max_searches =  100; // Max searches/api calls to make
    var max_ids = 50; // max IDs to fetch before stopping

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
	      parseIds(getURL(currentURL));
	      searches_performed++;
	    }

	    console.log(ids.length + " found for index " + index);
	    console.log(ids.join(","));
    }

    main();	
})();
