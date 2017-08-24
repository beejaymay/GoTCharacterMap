import * as d3 from 'd3'
import * as allCharacters from './characters.json'
import './index.less'

var diameter = 960,
  radius = diameter / 2,
  innerRadius = radius - 120

var cluster = d3.cluster()
  .size([360, innerRadius])

var svg = d3.select("body").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)

var chart = svg.append("g")
  .attr("transform", "translate(" + radius + "," + radius + ")")

var links = {}
  links.wed = chart.append("g").selectAll(".link.wed")
  links.parented = chart.select("g").selectAll(".link.parented")
  links.killed = chart.select("g").selectAll(".link.killed")
  links.resurrected = chart.select("g").selectAll(".link.resurrected")

var legend = svg.append("g")
  .attr("class", "legend")

var legendData = [
  ["Killed", "link killed source"],
  ["Killed By", "link killed target"],
  ["Parented", "link parented source"],
  ["Parented By", "link parented target"],
  ["Resurrected", "link resurrected source"],
  ["Resurrected By", "link resurrected target"],
  ["Married", "link wed source"]
]

var lineGenerator = d3.line()

var node = chart.append("g").selectAll(".node")
var root = family(allCharacters)
var map = {}
var allPaths = []

function line(linknum, d) {
  var beta = 0.95 - (linknum * 0.15)
  return d3.radialLine()
    .curve(d3.curveBundle.beta(beta))
    .radius(function(d) { return d.y })
    .angle(function(d) { return d.x / 180 * Math.PI })
}

function setClasses(d) {
  d.links.forEach(function (l) {
    Object.keys(links).forEach(function (linkType) {
      links[l.linkType].filter(function (p) { return p == l })
        .classed("target", function(l) {
          if (l.target === d) {
            l.source.linkType = linkType
            return l.source.source = true
          }
        })
        .classed("source", function(l) {
          if (l.source === d) {
            l.target.linkType = linkType
            return l.target.target = true
          }
        })
        .filter(function(l) { return l.target === d || l.source === d })
        .raise()
    })
    node
      .filter(function (n) { return n == l.target || n == l.source })
      .classed(l.linkType, function(n) { return n !== d })
      .classed("target", function(n) { return n.target })
      .classed("source", function(n) { return n.source })
  })
}

function purgeClasses() {
  Object.keys(links).forEach(function (linkType) {
    links[linkType]
      .classed("target", false)
      .classed("source", false)
  })
  node
    .attr("class", "node")
}

function mouseovered(d) {
  node.each(function(n) { n.target = n.source = false })
  setClasses(d)
}

function mouseouted(d) {
  purgeClasses()
}

function family(characters) {
  var map = {}

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
    return node
  }

  characters.forEach(function(d) {
    find(d.name, d)
  })

  return d3.hierarchy(map[""])
}

root.leaves().forEach(function(d) {
  map[d.data.name] = d
})

cluster(root)

// Loop over each leaf node
root.leaves().forEach(function(d) {
  // For each link type (killed, parented, etc)
  Object.keys(links).forEach(function (linkType) {
    // For each link of said type on this leaf node
    d.data[linkType].forEach(function(linkTarget) {
      // Create path from this node through the hierarchy to the target node
      let path = map[d.data.name].path(map[linkTarget])
      // Save the link type on the path for later use
      path.linkType = linkType
      // Save a reference to the path for later use
      allPaths.push(path)
    })
  })
})

// Loop over each leaf node again
root.leaves().forEach(function(d) {
  // Create an array to hold references to links to/from this node
  d.links = []
  // Loop over our handy array of links we created in the previous loop
  allPaths.forEach(function (p) {
    // If the link is to or from this node
    if (p[0].data.name == d.data.name || p[p.length - 1].data.name == d.data.name) {
      // Stuff it in the links member array for this node
      d.links.push(p)
    }
  })
})

// Loop over all links
allPaths.forEach(function (i, idx) {
  // Initiate a count representing the number of links between two given nodes
  var linknum = 1
  // Loop over a shrinking set of all the links again
  allPaths.slice(idx + 1).forEach(function (j) {
    // Easier to grok when these are named
    var s1Name = i[0].data.name,
      t1Name = i[i.length - 1].data.name,
      s2Name = j[0].data.name,
      t2Name = j[j.length - 1].data.name
    // If a link already exists between the two nodes represented in THIS link
    if ((s1Name == s2Name && t1Name == t2Name) || (s1Name == t2Name && t1Name == s2Name)) {
      // Increment the link number
      linknum ++
    }
  })
  // Assign the link number to the link, to be used in determining the beta of the curved line between the two.
  i.linknum = linknum
})

Object.keys(links).forEach(function (linkType) {
  links[linkType] = links[linkType]
    .data(allPaths.filter(function (path) {
      return path.linkType == linkType
    }))
    .enter()
    .append("path")
    .each(function (d) {
      d.source = d[0]
      d.target = d[d.length - 1]
      d3.select(this).attr("d", line(d.linknum, d))
    })
    .attr("class", `link ${linkType}`)
})

node = node
  .data(root.leaves())
  .enter()
  .append("text")
  .attr("class", "node")
  .attr("dy", "0.31em")
  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)") })
  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end" })
  .text(function(d) { return d.data.key })
  .on("mouseover", mouseovered)
  .on("mouseout", mouseouted)


legend.selectAll("path")
  .data(legendData)
  .enter()
  .append("path")
  .attr("class", function (d) { return d[1] })
  .attr("d", function (d, i) {
    return lineGenerator([[25, 32 + (i * 12)], [55, 32 + (i * 12)]])
  })

legend.selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .text(function (d) { return d[0] })
  .attr("y", function (d, i) { return 35 + (i * 12) })
  .attr("x", 60)
