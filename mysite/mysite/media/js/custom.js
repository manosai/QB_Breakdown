$(function() {
  var arr = [
  "Carson Palmer", 
  "Matt Ryan", 
  "Joe Flacco", 
  "Thad Lewis",  
  "Cam Newton",  
  "Jay Cutler", 
  "Andy Dalton", 
  "Jason Campbell",  
  "Tony Romo",
  "Peyton Manning",  
  "Matthew Stafford", 
  "Matt Flynn",
  "Matt Schaub",  
  "Andrew Luck", 
  "Chad Henne",  
  "Alex Smith",  
  "Ryan Tannehil", 
  "Matt Cassel",
  "Tom Brady",  
  "Drew Brees",  
  "Eli Manning", 
  "Geno Smith",
  "Matt McGloin", 
  "Nick Foles",
  "Ben Roethlisberger",
  "Philip Rivers",
  "Colin Kaepernick", 
  "Russell Wilson", 
  "Kellen Clemens", 
  "Mike Glennon", 
  "Ryan Fitzpatrick", 
  "Kirk Cousins", 
  "Sam Bradford", 
  "Aaron Rodgers", 
  "Terelle Pryor", 
  "Josh McCown", 
  "Robert Griffin", 
  "Christian Ponder", 
  "Josh Freeman", 
  "Kyle Orton"
  ]; 
  $( "#qb_names" ).autocomplete({
    source: arr
  });
});
function keyPressListener(e) { 
  if (e.keyCode == 13) {
    loadGraph(); 
  }
}

function loadGraph() {
    // remove landing page content 
    var el = document.getElementById('landing');
    if (el != null) {
      el.parentNode.removeChild(el);
    }

    // check for empty input 
    var name = document.getElementsByName("qb_name")[0].value;
    if (name == "") {
      alert("You must enter a quarterback's name!");
      return; 
    }
    var children; 
    $.ajax({
      'async': false, 
      'url': 'http://qb-breakdown/get_qb_breakdown', 
      'type': 'GET', 
      'data': {
        'qb': name
      }, 
      'success': function(myData) {
          children = $.parseJSON(myData); 
          if ($.isEmptyObject(children)) {
            alert("It seems there's no passing TD information about this quarterback! Please send me an email at mano.eerabathini@gmail.com");
            return; 
          }
      }

    });
    data = {
            "name": name, 
            "type": "quarterback",
            "children": children
          };   
    drawGraph(data); 
}
function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}




function drawGraph(data) {
  // check to see if legend has been added
  var el = document.getElementById('legend');
  if (el == null) {
    $('body').append('<div id="legend"><h3>QB Breakdown<h3><h4><span style="color:#FDD017">Gold-colored edges denote favorite endzone targets</span><br><span style="color:#ccc">Gray-colored edges denote all other endzone targets </span><h4><div>');
  } 

// remove any existing graphs from the page
d3.selectAll("svg").remove(); 


var width = 530,
    height = 450;
 

var cluster = d3.layout.cluster()
    .size([height, width - 220]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(110,0)");

// draw the arrowhead
svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 9) 
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
        .attr("d", "M 0,0 V 4 L6,2 Z");

var nodes = cluster.nodes(data);
var links = cluster.links(nodes);

var path = svg.append("g").selectAll("path")
  .data(links)
  .enter().append("path") 
    .attr("class", function(d) {return ("link"+d.target.star);})
    .attr("marker-end", "url(#arrowhead)")
    .attr("d", diagonal);

var node = svg.selectAll(".node")
  .data(nodes)
    .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

node.append("circle")
        .attr("r", 4.5);

node.append("text")
  .attr("dx", function(d) { return d.children ? -8 : 8; })
  .attr("dy", function(d) { return d.children ? -5 : 3; })
  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
  .text(function(d) { return d.name; });
 

node.append("text")
  .attr("dx", function(d) { return d.children ? -8 : 8; })
  .attr("dy", function(d) { return d.children ? -5: 20; })
  .text(function(d) { 
  			if (d.type == 'receiver') {
  				return "TDs: " + d.touchdowns; 
  			}
  });
d3.select(self.frameElement).style("height", height + "px");
}
