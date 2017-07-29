/*
  Parses identifiers for objects out of the search API and dumps them to
  console. Intended use is for creating data CSV files for usage in JMeter
  load testing.
  
  To use, edit the configurable arguments per your needs then run via Chrome's
  dev tools console. The identifiers are output to console from where you can
  copy/paste as needed. 
  
  Searches run sync for ease of code (no callbacks) and to not put
  much load on the API.
*/

(function(args){
  
  /*
    identifierExtractionFunctions is an object holding extractor functions
    tailored to each index's extraction requirements. Most extractions are
    a simple lookup by attribute but some are more complex.
    
    Function names must match args.index because the extraction function
    reference will be obtained via identifierExtractionFunctions()[args.index];
  */
  var identifierExtractionFunctions = function() {
    this.cfda = function(data) {
      return this.genericExtractor(data, "_id");
    };
    this.opp = function(data) {
      return this.genericExtractor(data, "_id");
    };
    this.fh = function(data) {
      return this.genericExtractor(data, "_id");
    };
    this.ei = function(data){
      return this.genericExtractor(data, "dunsNumber");
    };
    this.fpds = function(data){
      return this.genericExtractor(data, "_id");
    };
    // Wage determinations use the id AND a revision number in their
    // access patterns and APIs
    this.wd = function(data){
      var currentIds = [];
      for (var i=0; i<data._embedded.results.length; i++){
        var item = data._embedded.results[i];
        var id = item["_id"] + ", " + item["revisionNumber"]
        currentIds.push(id);
      } 
      return currentIds;
    };
    // Most IDs are just an attribute off each search results
    // and can be extracted in a generic manner
    this.genericExtractor = function(data, identifierAttribute){
      var currentIds = [];
      for (var i=0; i<data._embedded.results.length; i++){
        var id = data._embedded.results[i][identifierAttribute];
        currentIds.push(id);
      } 
      return currentIds;
    }
    return this;
  };
  
  // xhr helper to get the json responses from a url
  var getURL = function(url){
    var jsonResponse = {};
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);  //false means syncronous
    xhr.send(null);   
    if (xhr.status === 200) {
      jsonResponse = JSON.parse(xhr.responseText);
    } else {
      return {err: true};
    }     
    return jsonResponse;
  }

  // Get a reference to the extractor function based on index argument
  var extractorFunction = identifierExtractionFunctions()[args.index];

  // Build the base URL
  var search_url = args.api.base_url
    + "/" + args.api.api_path
    + "/?api_key=" + args.api.api_key
    + "&index=" + args.index
    + "&is_active=" + args.is_active
    + "&size=" + args.page_size;

  var search_counter = 0;
  var ids = [];
  
  // Collect IDs from the search API pages
  while (search_counter < args.max_searches && ids.length < args.max_ids) {
    var currentPage = args.start_page + search_counter;
    var currentURL = search_url + "&page=" + currentPage;
    var data = getURL(currentURL);
    if (data.err) {
      console.log("An error occured fetching data");
      break;
    }
    if (data.page.size == 0){
      console.log("exhausted available search results");
      break;
    }
    var currentIds = extractorFunction(data);
    ids.push.apply(ids, currentIds);
    search_counter++;
  }
  
  // Output the results to console
  console.log("Found " + ids.length + " results for index " + args.index);
  console.log(ids.join("\n"));
  
})({
  index: "cfda",     // index name. Valid values: cfda, opp, fh, ei, wd, fpds 
  is_active: "true", // active toggle. Valid values: true, false
  max_searches: 100, // max searches (api calls) to make
  max_ids: 20000,    // max ids to fetch before stopping (not exact, page size can cause overrun)
  page_size: 100,    // size of each search result page (max 100)
  start_page: 0,     // page to start from, allows for offset/slice the search result dataset
  api: {
    base_url: "https://api.sam.gov/prodlike",
    api_path: "sgs/v1/search",
    api_key: "PUT YOUR API KEY HERE"
  }
});
