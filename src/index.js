import * as d3 from 'd3'
import * as allCharacters from './characters.json'
import './index.less'

var diameter = 960,
  radius = diameter / 2,
  innerRadius = radius - 120;

var cluster = d3.cluster()
  .size([360, innerRadius]);

var line = d3.radialLine()
  .curve(d3.curveBundle.beta(0.85))
  .radius(function(d) { return d.y; })
  .angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("body").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + radius + "," + radius + ")");

var kill = svg.append("g").selectAll(".link.kill"),
  wed = svg.append("g").selectAll(".link.wed"),
  parented = svg.append("g").selectAll(".link.parented"),
  node = svg.append("g").selectAll(".node");

var root = family(allCharacters);

cluster(root);

kill = kill
  .data(characterKilled(root.leaves()))
  .enter()
  .append("path")
  .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
  .attr("class", "link kill")
  .attr("d", line);

wed = wed
  .data(characterWed(root.leaves()))
  .enter()
  .append("path")
  .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
  .attr("class", "link wed")
  .attr("d", line);

parented = parented
  .data(characterParented(root.leaves()))
  .enter()
  .append("path")
  .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
  .attr("class", "link parented")
  .attr("d", line);

node = node
  .data(root.leaves())
  .enter()
  .append("text")
  .attr("class", "node")
  .attr("dy", "0.31em")
  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
  .text(function(d) { return d.data.key; })
  .on("mouseover", mouseovered)
  .on("mouseout", mouseouted);

function mouseovered(d) {
  node
    .each(function(n) { n.target = n.source = false; });

  setClasses(wed, d);
  setClasses(kill, d);
  setClasses(parented, d);

  node
    .classed("target", function(n) { return n.target; })
    .classed("source", function(n) { return n.source; });
}

function setClasses(link, d) {
  link
    .classed("target", function(l) { if (l.target === d) return l.source.source = true; })
    .classed("source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
    .raise();
}

function purgeClasses(link, d) {
  link
    .classed("target", false)
    .classed("source", false);
}

function mouseouted(d) {
  purgeClasses(kill, d);
  purgeClasses(wed, d);
  purgeClasses(parented, d);

  node
    .classed("target", false)
    .classed("source", false);
}

// Lazily construct the package hierarchy from class names.
function family(characters) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  characters.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function characterKilled(characters) {
  var map = {},
      killed = [];

  // Compute a map from name to node.
  characters.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  characters.forEach(function(d) {
    //console.log(d)
    if (d.data.killed) d.data.killed.forEach(function(i) {
      killed.push(map[d.data.name].path(map[i]));
    });
  });

  return killed;
}

function characterParented(characters) {
  var map = {},
      parented = [];

  // Compute a map from name to node.
  characters.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  characters.forEach(function(d) {
    if (d.data.parented) d.data.parented.forEach(function(i) {
      parented.push(map[d.data.name].path(map[i]));
    });
  });

  return parented;
}

function characterWed(characters) {
  var map = {},
      wed = [];

  // Compute a map from name to node.
  characters.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  characters.forEach(function(d) {
    if (d.data.wed) d.data.wed.forEach(function(i) {
      wed.push(map[d.data.name].path(map[i]));
    });
  });

  return wed;
}