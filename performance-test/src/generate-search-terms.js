// Uses the suggestion API to get a list of text to be used as mutli term search queries
// Used for pulling list of terms as input to
// load testing procedures. This runs syncronously to reduce load on search API.
// Edit the configurable variables below then copy/paste this into the chrome dev tools console to run it.

(function(){

    // These variables are configurable
    
    // Environment information
    var api_base_url = "https://api.sam.gov";
    var environment_path = "prodlike";
    var search_api_path = "sgs/v1/suggestions";
    var api_key = "PUT YOUR API KEY HERE";
    var suggestion_size=100;
    var index_name=""; // cfda, opp, ex, ent, wd, fh, fpds or use empty string "" for all
    
    // Nothing below here is supposed to be configurable. 
    // Edit at your own risk.

    var search_url = api_base_url 
      + "/" + environment_path 
      + "/" + search_api_path 
      + "" + "?" + "api_key=" + api_key
      + "&size=" + suggestion_size;
  
    // 3 spaces are added to each suggestion in this array and ran against the suggestion API
    var suggestions = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    
    // holds returned terms from suggestions API
    var terms = [];

    // xhr helper to get the json responses from a url
    var getURL = function(url){
      var jsonResponse = {};
      var xhr = new XMLHttpRequest();
      console.log(url);
      xhr.open('GET', url, false);  //false means syncronous
      xhr.send(null);   
      if (xhr.status === 200) {
        jsonResponse = JSON.parse(xhr.responseText);
      } else {
        // bad, hope this doesn't occur
      }     
      return jsonResponse;
    }

    // helper to get suggestions from json and push to the terms array
    var parseTerms = function(data){
      for (var i=0; i<data.length; i++){          
        terms.push(data[i]);
      }      
    }

    var do_output = function(data){
      //add_results_to_ui(data.join(String.fromCharCode(13, 10)));
      console.log(data.length + " terms found for index " + index_name);
      console.log(data.join("\n"));
    }

    // main body. hits suggestion API for each suggestion fragment
    // and stores results, then outputs scraped suggestions to console.
    var main = function(){     
     for (var i=0; i<suggestions.length; i++){
        var currentURL = search_url + "&q=" + suggestions[i] + "%20%20%20";
        parseTerms(getURL(currentURL))
     }   
      do_output(terms);       
    }

    main();    
})();
