import * as d3 from 'd3'
import * as allCharacters from './characters.json'
import _ from 'lodash'
import './index.less'

var diameter = 960,
  radius = diameter / 2,
  innerRadius = radius - 120

var cluster = d3.cluster()
  .size([360, innerRadius])

var svg = d3.select("body").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + radius + "," + radius + ")")

var killed = svg.append("g").selectAll(".link.killed"),
  wed = svg.select("g").selectAll(".link.wed"),
  parented = svg.select("g").selectAll(".link.parented"),
  node = svg.append("g").selectAll(".node")

var root = family(allCharacters)
var map = {}
root.leaves().forEach(function(d) {
  map[d.data.name] = d
})

cluster(root);

function line(linknum) {
  var beta = 0.95 - (linknum * 0.10)
  return d3.radialLine()
    .curve(d3.curveBundle.beta(beta))
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; })
}

function drawPaths(pathSet, dataSet) {
  return pathSet
    .data(characterLinked(dataSet))
    .enter()
    .append("path")
    .each(function(d) {
      d.source = d[0]
      d.target = d[d.length - 1]
      d3.select(this).attr("d", line(d.linknum))
    })
    .attr("class", `link ${dataSet}`)
}

killed = drawPaths(killed, "killed")
wed = drawPaths(wed, "wed")
parented = drawPaths(parented, "parented")

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

function setClasses(link, d) {
  link
    .classed("target", function(l) { if (l.target === d) return l.source.source = true; })
    .classed("source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
    .raise()
}

function purgeClasses(link) {
  link
    .classed("target", false)
    .classed("source", false);
}

function mouseovered(d) {
  node.each(function(n) { n.target = n.source = false; })

  setClasses(wed, d)
  setClasses(killed, d)
  setClasses(parented, d)

  node
    .classed("target", function(n) { return n.target; })
    .classed("source", function(n) { return n.source; })
}

function mouseouted(d) {
  purgeClasses(killed);
  purgeClasses(wed);
  purgeClasses(parented);

  node
    .classed("target", false)
    .classed("source", false)
}

function family(characters) {
  var map = {};

  function find(name, data) {
    var node = map[name], i
    if (!node) {
      node = map[name] = data || {name: name, children: []}
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")))
        node.parent.children.push(node)
        node.key = name.substring(i + 1)
      }
    }
    return node;
  }

  characters.forEach(function(d) {
    find(d.name, d)
  });

  return d3.hierarchy(map[""])
}

function characterLinked(linkType) {

  var links = [];
  root.leaves().forEach(function(d) {
    d.data[linkType].forEach(function(i) {
      links.push(map[d.data.name].path(map[i]))
    })
  })

  links.forEach(function (i, idx) {
    var linknum = 1
    links.slice(idx + 1).forEach(function (j, idx) {
      if (i[0].data.name == j[j.length - 1].data.name) {
        linknum ++
      }
    })
    i.linknum = linknum
  })

  return links
}
