// import Fuse from 'fuse.js'
import Mark from 'mark.js'
// How many characters to include on either side of match keyword
const summaryInclude=200;

// Options for fuse.js
let fuseOptions = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  location: 0,
  threshold: 0.4,
  distance: 9000,
  // useExtendedSearch: false,
  ignoreLocation: true,
  ignoreFieldNorm: false,
  keys: [
    "title",
    "content"
  ]
};

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

let searchQuery = getUrlParameter('q');

if(searchQuery){
  document.getElementById("search-query").value = searchQuery;
  executeSearch(searchQuery);
} else if(document.body.classList.contains('search')){
  document.getElementById('search-results').innerHTML = "<p class=\"no-results\">Please enter a word or phrase above</p>";
}

function executeSearch(searchQuery) {
  // Look for "index.json" in the same directory where this script is called.
  const loading = document.querySelector('.loading')
  fetch("./index.json").
    then(function (response) {
      return response.json()
    }).
    then(function (data) {
      loading.remove()
      let fuse = new Fuse(data, fuseOptions);
      let result = fuse.search(searchQuery);
      if (result.length > 0) {
        populateResults(result);
      } else {
        document.getElementById('search-results').innerHTML = "<p class=\"no-results\">No matches found</p>";
      }
    });
 }

function populateResults(result){
  document.querySelector('.found').innerHTML = '<p>Found '+ result.length +' Documents</p>'
  let section = getUrlParameter('section');
  result.forEach( function (value, key) {
    console.log(section,value.item.section)
    if(!section || section === value.item.section ){
      let contents= value.item.content;
      let snippet = "";
      let snippetHighlights=[];
      snippetHighlights.push(searchQuery);
      if(snippet.length<1 && typeof(contents) !== 'undefined'){
        snippet += contents.substring(0,summaryInclude*2);
      }
      snippet += "…";
  
      // Lifted from https://stackoverflow.com/posts/3700369/revisions
      var elem = document.createElement('textarea');
      elem.innerHTML = snippet;
      var decoded = elem.value;
  
      // Pull template from hugo template definition
      let frag = document.getElementById('search-result-template').content.cloneNode(true);
      // Replace values
      frag.querySelector(".search_summary").setAttribute("id", "summary-" + key);
      frag.querySelector(".search_link").setAttribute("href", value.item.permalink);
      frag.querySelector(".search_title").textContent = value.item.title;
      frag.querySelector(".search_snippet").textContent = decoded;
      let tags = value.item.tags;
      snippetHighlights.forEach( function (snipvalue, snipkey) {
        let markjs = new Mark(frag);
        markjs.mark(snipvalue);
      });
      document.getElementById("search-results").appendChild(frag);  
    }
  });
}