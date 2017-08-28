webpackJsonp([0],{

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__characters_json__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__characters_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__characters_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_less__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_less__);




var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 120;

var cluster = __WEBPACK_IMPORTED_MODULE_0_d3__["cluster"]().size([360, innerRadius]);

var svg = __WEBPACK_IMPORTED_MODULE_0_d3__["select"]("body").append("svg").attr("width", diameter).attr("height", diameter);

var chart = svg.append("g").attr("transform", "translate(" + radius + "," + radius + ")");

var links = {};
links.wed = chart.append("g").selectAll(".link.wed");
links.parented = chart.select("g").selectAll(".link.parented");
links.killed = chart.select("g").selectAll(".link.killed");
links.resurrected = chart.select("g").selectAll(".link.resurrected");

var legend = svg.append("g").attr("class", "legend");

var legendData = [["Killed", "link killed source"], ["Killed By", "link killed target"], ["Parented", "link parented source"], ["Parented By", "link parented target"], ["Resurrected", "link resurrected source"], ["Resurrected By", "link resurrected target"], ["Married", "link wed source"]];

var lineGenerator = __WEBPACK_IMPORTED_MODULE_0_d3__["line"]();

var node = chart.append("g").selectAll(".node");
var root = family(__WEBPACK_IMPORTED_MODULE_1__characters_json__);
var map = {};
var allPaths = [];

function line(linknum, d) {
  var beta = 0.95 - linknum * 0.15;
  return __WEBPACK_IMPORTED_MODULE_0_d3__["radialLine"]().curve(__WEBPACK_IMPORTED_MODULE_0_d3__["curveBundle"].beta(beta)).radius(function (d) {
    return d.y;
  }).angle(function (d) {
    return d.x / 180 * Math.PI;
  });
}

function setClasses(d) {
  d.links.forEach(function (l) {
    Object.keys(links).forEach(function (linkType) {
      links[l.linkType].filter(function (p) {
        return p == l;
      }).classed("target", function (l) {
        if (l.target === d) {
          l.source.linkType = linkType;
          return l.source.source = true;
        }
      }).classed("source", function (l) {
        if (l.source === d) {
          l.target.linkType = linkType;
          return l.target.target = true;
        }
      }).filter(function (l) {
        return l.target === d || l.source === d;
      }).raise();
    });
    node.filter(function (n) {
      return n == l.target || n == l.source;
    }).classed(l.linkType, function (n) {
      return n !== d;
    }).classed("target", function (n) {
      return n.target;
    }).classed("source", function (n) {
      return n.source;
    });
  });
}

function purgeClasses() {
  Object.keys(links).forEach(function (linkType) {
    links[linkType].classed("target", false).classed("source", false);
  });
  node.attr("class", "node");
}

function mouseovered(d) {
  node.each(function (n) {
    n.target = n.source = false;
  });
  setClasses(d);
}

function mouseouted(d) {
  purgeClasses();
}

function family(characters) {
  var map = {};

  function find(name, data) {
    var node = map[name],
        i;
    if (!node) {
      node = map[name] = data || { name: name, children: [] };
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  characters.forEach(function (d) {
    find(d.name, d);
  });

  return __WEBPACK_IMPORTED_MODULE_0_d3__["hierarchy"](map[""]);
}

root.leaves().forEach(function (d) {
  map[d.data.name] = d;
});

cluster(root);

// Loop over each leaf node
root.leaves().forEach(function (d) {
  // For each link type (killed, parented, etc)
  Object.keys(links).forEach(function (linkType) {
    // For each link of said type on this leaf node
    d.data[linkType].forEach(function (linkTarget) {
      // Create path from this node through the hierarchy to the target node
      let path = map[d.data.name].path(map[linkTarget]);
      // Save the link type on the path for later use
      path.linkType = linkType;
      // Save a reference to the path for later use
      allPaths.push(path);
    });
  });
});

// Loop over each leaf node again
root.leaves().forEach(function (d) {
  // Create an array to hold references to links to/from this node
  d.links = [];
  // Loop over our handy array of links we created in the previous loop
  allPaths.forEach(function (p) {
    // If the link is to or from this node
    if (p[0].data.name == d.data.name || p[p.length - 1].data.name == d.data.name) {
      // Stuff it in the links member array for this node
      d.links.push(p);
    }
  });
});

// Loop over all links
allPaths.forEach(function (i, idx) {
  // Initiate a count representing the number of links between two given nodes
  var linknum = 1;
  // Loop over a shrinking set of all the links again
  allPaths.slice(idx + 1).forEach(function (j) {
    // Easier to grok when these are named
    var s1Name = i[0].data.name,
        t1Name = i[i.length - 1].data.name,
        s2Name = j[0].data.name,
        t2Name = j[j.length - 1].data.name;
    // If a link already exists between the two nodes represented in THIS link
    if (s1Name == s2Name && t1Name == t2Name || s1Name == t2Name && t1Name == s2Name) {
      // Increment the link number
      linknum++;
    }
  });
  // Assign the link number to the link, to be used in determining the beta of the curved line between the two.
  i.linknum = linknum;
});

Object.keys(links).forEach(function (linkType) {
  links[linkType] = links[linkType].data(allPaths.filter(function (path) {
    return path.linkType == linkType;
  })).enter().append("path").each(function (d) {
    d.source = d[0];
    d.target = d[d.length - 1];
    __WEBPACK_IMPORTED_MODULE_0_d3__["select"](this).attr("d", line(d.linknum, d));
  }).attr("class", `link ${linkType}`);
});

node = node.data(root.leaves()).enter().append("text").attr("class", "node").attr("dy", "0.31em").attr("transform", function (d) {
  return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)");
}).attr("text-anchor", function (d) {
  return d.x < 180 ? "start" : "end";
}).text(function (d) {
  return d.data.key;
}).on("mouseover", mouseovered).on("mouseout", mouseouted);

legend.selectAll("path").data(legendData).enter().append("path").attr("class", function (d) {
  return d[1];
}).attr("d", function (d, i) {
  return lineGenerator([[25, 32 + i * 12], [55, 32 + i * 12]]);
});

legend.selectAll("text").data(legendData).enter().append("text").text(function (d) {
  return d[0];
}).attr("y", function (d, i) {
  return 35 + i * 12;
}).attr("x", 60);

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(333)();
// imports


// module
exports.push([module.i, "body,\nhtml {\n  margin: 0;\n  background-color: #111;\n}\ntext {\n  fill: #ccc;\n}\n.legend {\n  font: 600 12px \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n}\n.node {\n  font: 400 9px \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  fill: #bbb;\n}\n.node:hover {\n  fill: white;\n  font-weight: 600;\n}\n.node.parented.source,\n.node.parented.target {\n  fill: #4fd64f;\n}\n.node.resurrected.source,\n.node.resurrected.target {\n  fill: #e4cc33;\n}\n.node.wed.source,\n.node.wed.target {\n  fill: #2a94bb;\n}\n.node.killed.source,\n.node.killed.target {\n  fill: #ec3d3d;\n}\n.link {\n  stroke: #333;\n  stroke-opacity: 0.4;\n  fill: none;\n  pointer-events: none;\n}\n.link.source,\n.link.target {\n  stroke-opacity: 1;\n  stroke-width: 2px;\n}\n.link.killed.target,\n.link.parented.target,\n.link.resurrected.target {\n  stroke-dasharray: 2px 2px;\n}\n.link.resurrected.source,\n.link.resurrected.target {\n  stroke: #e4cc33;\n}\n.link.killed.source,\n.link.killed.target {\n  stroke: #ec3d3d;\n}\n.link.wed.source,\n.link.wed.target {\n  stroke: #2a94bb;\n}\n.link.parented.source,\n.link.parented.target {\n  stroke: #4fd64f;\n}\n", ""]);

// exports


/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(332);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(335)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/less-loader/index.js!./index.less", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/less-loader/index.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 337:
/***/ (function(module, exports) {

module.exports = [{"name":"Arryn.John Arryn","killed":[],"wed":["Tully.Lyssa Tully"],"parented":["Arryn.Robyn Arryn"],"resurrected":[]},{"name":"Arryn.Robyn Arryn","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Arryn.Hugh","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Arryn.Vardis Egen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Astapor.Kraznys Mo Nakloz","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Astapor.Missandei","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Astapor.White Rat","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Astapor.Grey Worm","killed":["Meereen.Belicho Paenymion","Meereen.Razdal Mo Eraz"],"wed":[],"parented":[],"resurrected":[]},{"name":"Baelish.Petyr Baelish","killed":["Tully.Lyssa Tully"],"wed":["Tully.Lyssa Tully"],"parented":[],"resurrected":[]},{"name":"Baelish.Baelish Soldiers","killed":["Baratheon.Dontos Hollard"],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Steffon Baratheon","killed":[],"wed":["Estermont.Cassana Estermont"],"parented":["Baratheon.Robert Baratheon","Baratheon.Stannis Baratheon","Baratheon.Renly Baratheon"],"resurrected":[]},{"name":"Baratheon.Robert Baratheon","killed":["Targaryen.Rhaegar Targaryen"],"wed":["Lannister.Cersei Lannister"],"parented":["Baratheon.Gendry","Baratheon.Barra"],"resurrected":[]},{"name":"Baratheon.Stannis Baratheon","killed":["Baratheon.Shireen Baratheon"],"wed":["Florent.Selyse Florent"],"parented":["Baratheon.Shireen Baratheon","Baratheon.Petyr Baratheon","Baratheon.Tommard Baratheon","Baratheon.Edric Baratheon"],"resurrected":[]},{"name":"Baratheon.Renly Baratheon","killed":[],"wed":["Tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"Baratheon.Shireen Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Dontos Hollard","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Brienne of Tarth","killed":["Baratheon.Stannis Baratheon"],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Gendry","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Petyr Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Tommard Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Edric Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Meryn Trant","killed":["Braavos.Syrio Forel"],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Maester Cressen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Mandon Moore","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Barristan Selmy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Ormund Baratheon","killed":[],"wed":["Targaryen.Rhaelle Targaryen"],"parented":["Baratheon.Steffon Baratheon"],"resurrected":[]},{"name":"Baratheon.Janos Slynt","killed":["Baratheon.Barra"],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Barra","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Grand Maester Pycelle","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Baratheon.Podrick Payne","killed":["Baratheon.Mandon Moore"],"wed":[],"parented":[],"resurrected":[]},{"name":"Braavos.Jaqen H'ghar","killed":["Clegane.The Tickler","Lannister.Amory Lorch"],"wed":[],"parented":[],"resurrected":[]},{"name":"Braavos.Ghita","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Braavos.Syrio Forel","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Braavos.The Waif","killed":["Braavos.Lady Crane"],"wed":[],"parented":[],"resurrected":[]},{"name":"Braavos.Lady Crane","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Brotherhood Without Banners.Steve","killed":["Smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"Brotherhood Without Banners.Gatins","killed":["Smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"Brotherhood Without Banners.Lem Lemoncloak","killed":["Smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"Brotherhood Without Banners.Beric Dondarrion","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Brotherhood Without Banners.Thoros of Myr","killed":[],"wed":[],"parented":[],"resurrected":["Brotherhood Without Banners.Beric Dondarrion"]},{"name":"Bolton.Ramsay Bolton","killed":["Greyjoy.Dagmer","Free Folk.Osha","Free Folk.Wun Weg Wun Dar Wun","Stark.Rickon Stark","Greyjoy.Adrack Humble","Smallfolk.Tansy","Bolton.Roose Bolton","Frey.Walda Frey"],"wed":["Stark.Sansa Stark"],"parented":[],"resurrected":[]},{"name":"Bolton.Roose Bolton","killed":["Stark.Robb Stark"],"wed":["Frey.Walda Frey"],"parented":["Bolton.Ramsay Bolton"],"resurrected":[]},{"name":"Bolton.Locke","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Bolton.Myranda","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Children of the Forest.The Three-Eyed Raven","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Children of the Forest.Leaf","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Clegane.Gregor Clegane","killed":["Brotherhood Without Banners.Beric Dondarrion","Sparrows.Unella","Arryn.Hugh","Martell.Oberyn Martell","Martell.Elia Martell","Targaryen.Aegon Targaryen","Targaryen.Rhaenys Targaryen"],"wed":[],"parented":[],"resurrected":[]},{"name":"Clegane.Sandor Clegane","killed":["Smallfolk.Mycah","Brotherhood Without Banners.Beric Dondarrion","Brotherhood Without Banners.Steve","Brotherhood Without Banners.Gatins","Brotherhood Without Banners.Lem Lemoncloak"],"wed":[],"parented":[],"resurrected":[]},{"name":"Clegane.The Tickler","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Khal Drogo","killed":["Dothraki.Mago","Targaryen.Viserys Targaryen"],"wed":["Targaryen.Danaerys Targaryen"],"parented":[],"resurrected":[]},{"name":"Dothraki.Mago","killed":["Dothraki.Khal Drogo"],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Qotho","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Rhaego","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Aggo","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Irri","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Dothraki.Khal Moro","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Erenford.Joyeuse Erenford","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Estermont.Cassana Estermont","killed":[],"wed":[],"parented":["Baratheon.Robert Baratheon","Baratheon.Stannis Baratheon","Baratheon.Renly Baratheon"],"resurrected":[]},{"name":"Florent.Axell Florent","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Florent.Selyse Florent","killed":[],"wed":[],"parented":["Baratheon.Shireen Baratheon","Baratheon.Petyr Baratheon","Baratheon.Tommard Baratheon","Baratheon.Edric Baratheon"],"resurrected":[]},{"name":"Florent.Melessa Florent","killed":[],"wed":[],"parented":["Tarly.Samwell Tarly","Tarly.Talla Tarly","Tarly.Dickon Tarly"],"resurrected":[]},{"name":"Free Folk.Mag Mar Run Doh Weg","killed":["Nights Watch.Grenn"],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Wun Weg Wun Dar Wun","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Dongo","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Ygritte","killed":["Smallfolk.Guymon","Nights Watch.Pypar"],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Magnar Loboda","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Karsi","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Styr","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Orell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Craster","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Mance Rayder","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Tormund Giantsbane","killed":["Umber.John Umber","Free Folk.Lord of Bones"],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Lord of Bones","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Stiv","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Wallen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Free Folk.Osha","killed":["Stark.Maester Luwin","Greyjoy.Drennan"],"wed":[],"parented":[],"resurrected":[]},{"name":"Frey.Walder Frey","killed":[],"wed":["Erenford.Joyeuse Erenford"],"parented":["Frey.Rosalin Frey"],"resurrected":[]},{"name":"Frey.Rosalin Frey","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Frey.Walda Frey","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Frey.Lothar Frey","killed":["Volantis.Talisa Maegyr"],"wed":[],"parented":[],"resurrected":[]},{"name":"Frey.Walder Rivers","killed":["Tully.Catelyn Tully"],"wed":[],"parented":[],"resurrected":[]},{"name":"Frey.Frey Soldiers","killed":["Stark.Grey Wind"],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Balon Greyjoy","killed":[],"wed":["Greyjoy.Alannys Harlaw"],"parented":["Greyjoy.Yara Greyjoy","Greyjoy.Theon Greyjoy"],"resurrected":[]},{"name":"Greyjoy.Yara Greyjoy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Alannys Harlaw","killed":[],"wed":[],"parented":["Greyjoy.Yara Greyjoy","Greyjoy.Theon Greyjoy"],"resurrected":[]},{"name":"Greyjoy.Theon Greyjoy","killed":["Bolton.Myranda","Smallfolk.Billy","Smallfolk.Jack","Free Folk.Stiv","Stark.Rodrik Cassel"],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Euron Greyjoy","killed":["Sand.Nymeria Sand","Sand.Obara Sand","Greyjoy.Balon Greyjoy"],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Adrack Humble","killed":["Greyjoy.Ralf Kenning"],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Ralf Kenning","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Dagmer","killed":["Stark.Maester Luwin"],"wed":[],"parented":[],"resurrected":[]},{"name":"Greyjoy.Drennan","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Hightower.Alerie Hightower","killed":[],"wed":[],"parented":["Tyrell.Margaery Tyrell","Tyrell.Loras Tyrell"],"resurrected":[]},{"name":"Hightower.Gerold Hightower","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Joffrey Baratheon","killed":["Stark.Ros"],"wed":["Tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"Lannister.Myrcella Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Tommen Baratheon","killed":[],"wed":["Tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"Lannister.Alton Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Cersei Lannister","killed":["Sand.Ellaria Sand","Sand.Tyene Sand","Lannister.Lancel Lannister","Tyrell.Margaery Tyrell","Tyrell.Loras Tyrell","Tyrell.Mace Tyrell","Sparrows.The High Sparrow","Lannister.Kevan Lannister"],"wed":[],"parented":["Lannister.Joffrey Baratheon","Lannister.Tommen Baratheon","Lannister.Myrcella Baratheon"],"resurrected":[]},{"name":"Lannister.Jaime Lannister","killed":["Redwyne.Olenna Redwyne","Stark.Torrhen Karstark","Lannister.Alton Lannister","Targaryen.Aerys Targaryen II"],"wed":[],"parented":["Lannister.Joffrey Baratheon","Lannister.Tommen Baratheon","Lannister.Myrcella Baratheon"],"resurrected":[]},{"name":"Lannister.Joanna Lannister","killed":[],"wed":[],"parented":["Lannister.Jaime Lannister","Lannister.Cersei Lannister","Lannister.Tyrion Lannister"],"resurrected":[]},{"name":"Lannister.Kevan Lannister","killed":[],"wed":[],"parented":["Lannister.Lancel Lannister"],"resurrected":[]},{"name":"Lannister.Lancel Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Martyn Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Tyrion Lannister","killed":["Lannister.Tywin Lannister","Lannister.Shae"],"wed":["Stark.Sansa Stark"],"parented":[],"resurrected":[]},{"name":"Lannister.Tywin Lannister","killed":[],"wed":["Lannister.Joanna Lannister"],"parented":["Lannister.Jaime Lannister","Lannister.Cersei Lannister","Lannister.Tyrion Lannister"],"resurrected":[]},{"name":"Lannister.Willem Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Amory Lorch","killed":["Nights Watch.Yoren"],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Polliver","killed":["Smallfolk.Lommy Greenhands"],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Qyburn","killed":["Baratheon.Grand Maester Pycelle"],"wed":[],"parented":[],"resurrected":["Clegane.Gregor Clegane"]},{"name":"Lannister.Rennick","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Rorge","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Shae","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Lannister.Lannister Soldiers","killed":["Tully.Brynden Tully","Stark.Septa Mordane","Stark.Vayon Poole"],"wed":[],"parented":[],"resurrected":[]},{"name":"Lhazar.Mirri Maz Duur","killed":["Dothraki.Rhaego"],"wed":[],"parented":[],"resurrected":[]},{"name":"Light.Melisandre","killed":["Baratheon.Shireen Baratheon","Florent.Axell Florent","Baratheon.Renly Baratheon","Baratheon.Maester Cressen"],"wed":[],"parented":[],"resurrected":["Stark.Jon Snow"]},{"name":"Lys.Doreah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Martell.Areo Hotah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Martell.Maester Caleotte","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Martell.Elia Martell","killed":[],"wed":[],"parented":["Targaryen.Aegon Targaryen","Targaryen.Rhaenys Targaryen"],"resurrected":[]},{"name":"Martell.Trystane Martell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Martell.Doran Martell","killed":[],"wed":["Norvos.Mellario of Norvos"],"parented":["Martell.Trystane Martell"],"resurrected":[]},{"name":"Martell.Oberyn Martell","killed":["Clegane.Gregor Clegane"],"wed":["Sand.Ellaria Sand"],"parented":["Sand.Obara Sand","Sand.Nymeria Sand","Sand.Tyene Sand"],"resurrected":[]},{"name":"Meereen.Oznak zo Pahl","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Meereen.Razdal Mo Eraz","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Meereen.Hizdahr Zo Loraq","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Meereen.Mossador","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Meereen.Belicho Paenymion","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Meereen.Sons of the Harpy","killed":["Astapor.White Rat","Meereen.Hizdahr Zo Loraq","Baratheon.Barristan Selmy"],"wed":[],"parented":[],"resurrected":[]},{"name":"Mormont.Jeor Mormont","killed":[],"wed":[],"parented":["Mormont.Jorah Mormont"],"resurrected":[]},{"name":"Mormont.Jorah Mormont","killed":["Dothraki.Qotho"],"wed":[],"parented":[],"resurrected":[]},{"name":"Mormont.Maege Mormont","killed":[],"wed":[],"parented":["Mormont.Lyanna Mormont"],"resurrected":[]},{"name":"Mormont.Lyanna Mormont","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Grenn","killed":["Free Folk.Mag Mar Run Doh Weg"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Alliser Thorne","killed":["Stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Pypar","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Bowen Marsh","killed":["Stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Othell Yarwyck","killed":["Stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Gared","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Yoren","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Karl Tanner","killed":["Free Folk.Craster"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Olly","killed":["Stark.Jon Snow","Free Folk.Ygritte"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Qhorin Halfhand","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Rast","killed":["Mormont.Jeor Mormont"],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Waymar Royce","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Nights Watch.Will","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Norvos.Mellario of Norvos","killed":[],"wed":[],"parented":["Martell.Trystane Martell"],"resurrected":[]},{"name":"Payne.Ilyn Payne","killed":["Stark.Eddard Stark"],"wed":[],"parented":[],"resurrected":[]},{"name":"Reed.Howland Reed","killed":["Targaryen.Arthur Dayne"],"wed":[],"parented":["Reed.Jojen Reed","Reed.Meera Reed"],"resurrected":[]},{"name":"Reed.Jojen Reed","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Reed.Meera Reed","killed":["Undead.White Walkers","Reed.Jojen Reed"],"wed":[],"parented":[],"resurrected":[]},{"name":"Redwyne.Olenna Redwyne","killed":["Lannister.Joffrey Baratheon"],"wed":[],"parented":["Tyrell.Mace Tyrell"],"resurrected":[]},{"name":"Sand.Ellaria Sand","killed":["Lannister.Myrcella Baratheon","Martell.Doran Martell"],"wed":[],"parented":["Sand.Obara Sand","Sand.Nymeria Sand","Sand.Tyene Sand"],"resurrected":[]},{"name":"Sand.Obara Sand","killed":["Martell.Trystane Martell"],"wed":[],"parented":[],"resurrected":[]},{"name":"Sand.Nymeria Sand","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Sand.Tyene Sand","killed":["Martell.Maester Caleotte","Martell.Areo Hotah"],"wed":[],"parented":[],"resurrected":[]},{"name":"Seaworth.Davos Seaworth","killed":[],"wed":[],"parented":["Seaworth.Matthos Seaworth"],"resurrected":[]},{"name":"Seaworth.Matthos Seaworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Second Sons.Mero","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Second Sons.Daario Naharis","killed":["Dothraki.Aggo","Meereen.Mossador","Meereen.Oznak zo Pahl","Second Sons.Mero","Second Sons.Prendahl na Ghezn"],"wed":[],"parented":[],"resurrected":[]},{"name":"Second Sons.Prendahl na Ghezn","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Lommy Greenhands","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Guymon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Zalla","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Tansy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Billy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Jack","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Ray","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Mycah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Smallfolk.Bronn","killed":["Arryn.Vardis Egen","Seaworth.Matthos Seaworth"],"wed":["Stokeworth.Lollys Stokeworth"],"parented":[],"resurrected":[]},{"name":"Sparrows.The High Sparrow","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Sparrows.Unella","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Rickard Stark","killed":[],"wed":[],"parented":["Stark.Benjen Stark","Stark.Eddard Stark","Stark.Brandon Stark","Stark.Lyanna Stark"],"resurrected":[]},{"name":"Stark.Lyanna Stark","killed":[],"wed":[],"parented":["Stark.Jon Snow"],"resurrected":[]},{"name":"Stark.Benjen Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Brandon Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Eddard Stark","killed":["Nights Watch.Will","Stark.Lady","Targaryen.Arthur Dayne","Hightower.Gerold Hightower"],"wed":["Tully.Catelyn Tully"],"parented":["Stark.Sansa Stark","Stark.Arya Stark","Stark.Bran Stark","Stark.Rickon Stark","Stark.Robb Stark"],"resurrected":[]},{"name":"Stark.Robb Stark","killed":["Free Folk.Wallen","Stark.Rickard Karstark"],"wed":["Volantis.Talisa Maegyr"],"parented":[],"resurrected":[]},{"name":"Stark.Arya Stark","killed":["Baelish.Petyr Baelish","Frey.Walder Frey","Frey.Walder Rivers","Frey.Lothar Frey","Braavos.The Waif","Braavos.Ghita","Lannister.Rorge","Baratheon.Meryn Trant","Lannister.Polliver"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Jon Snow","killed":["Nights Watch.Othell Yarwyck","Nights Watch.Olly","Nights Watch.Bowen Marsh","Nights Watch.Alliser Thorne","Undead.White Walkers","Baratheon.Janos Slynt","Free Folk.Mance Rayder","Free Folk.Styr","Nights Watch.Qhorin Halfhand","Free Folk.Orell","Nights Watch.Karl Tanner"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Sansa Stark","killed":["Bolton.Ramsay Bolton"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Rickon Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Bran Stark","killed":["Bolton.Locke"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Septa Mordane","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Vayon Poole","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Rodrik Cassel","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Maester Luwin","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Torrhen Karstark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Rickard Karstark","killed":["Lannister.Martyn Lannister","Lannister.Willem Lannister"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Ros","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Hodor","killed":["Bolton.Locke"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Grey Wind","killed":["Lannister.Rennick"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Ghost","killed":["Nights Watch.Rast"],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Summer","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Shaggydog","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Nymeria","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stark.Lady","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stokeworth.Lollys Stokeworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stokeworth.Falyse Stokeworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Stokeworth.Tanda Stokeworth","killed":[],"wed":[],"parented":["Stokeworth.Lollys Stokeworth","Stokeworth.Falyse Stokeworth"],"resurrected":[]},{"name":"Targaryen.Duncan Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Aegon Targaryen V","killed":[],"wed":[],"parented":["Targaryen.Rhaelle Targaryen","Targaryen.Jaehaerys Targaryen","Targaryen.Duncan Targaryen"],"resurrected":[]},{"name":"Targaryen.Rhaelle Targaryen","killed":[],"wed":[],"parented":["Baratheon.Steffon Baratheon"],"resurrected":[]},{"name":"Targaryen.Jaehaerys Targaryen","killed":[],"wed":[],"parented":["Targaryen.Aerys Targaryen II","Targaryen.Rhaella Targaryen"],"resurrected":[]},{"name":"Targaryen.Aerys Targaryen II","killed":["Stark.Rickard Stark","Stark.Brandon Stark"],"wed":[],"parented":["Targaryen.Viserys Targaryen","Targaryen.Danaerys Targaryen","Targaryen.Rhaegar Targaryen"],"resurrected":[]},{"name":"Targaryen.Rhaella Targaryen","killed":[],"wed":[],"parented":["Targaryen.Viserys Targaryen","Targaryen.Danaerys Targaryen","Targaryen.Rhaegar Targaryen"],"resurrected":[]},{"name":"Targaryen.Viserys Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Danaerys Targaryen","killed":["Dothraki.Khal Moro","Dothraki.Khal Drogo","Lhazar.Mirri Maz Duur","Lys.Doreah","The Thirteen.Xaro Xhoan Daxos"],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Rhaegar Targaryen","killed":[],"wed":["Martell.Elia Martell","Stark.Lyanna Stark"],"parented":["Stark.Jon Snow","Targaryen.Aegon Targaryen","Targaryen.Rhaenys Targaryen"],"resurrected":[]},{"name":"Targaryen.Aegon Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Rhaenys Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Drogon","killed":["The Thirteen.Pyat Pree","Tarly.Dickon Tarly","Tarly.Randyll Tarly","Smallfolk.Zalla","Astapor.Kraznys Mo Nakloz"],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Rhaegal","killed":["The Thirteen.Pyat Pree"],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Viserion","killed":["The Thirteen.Pyat Pree"],"wed":[],"parented":[],"resurrected":[]},{"name":"Targaryen.Arthur Dayne","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Tarly.Randyll Tarly","killed":[],"wed":["Florent.Melessa Florent"],"parented":["Tarly.Samwell Tarly","Tarly.Talla Tarly","Tarly.Dickon Tarly"],"resurrected":[]},{"name":"Tarly.Samwell Tarly","killed":["Undead.White Walkers"],"wed":[],"parented":[],"resurrected":[]},{"name":"Tarly.Talla Tarly","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Tarly.Dickon Tarly","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"The Thirteen.Xaro Xhoan Daxos","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"The Thirteen.Pyat Pree","killed":["The Thirteen.The Spice King","The Thirteen.The Copper King","The Thirteen.The Silk King"],"wed":[],"parented":[],"resurrected":[]},{"name":"The Thirteen.The Spice King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"The Thirteen.The Copper King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"The Thirteen.The Silk King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Tully.Hoster Tully","killed":[],"wed":["Whent.Minisa Whent"],"parented":["Tully.Catelyn Tully","Tully.Lyssa Tully","Tully.Edmure Tully"],"resurrected":[]},{"name":"Tully.Catelyn Tully","killed":["Erenford.Joyeuse Erenford"],"wed":[],"parented":["Stark.Sansa Stark","Stark.Arya Stark","Stark.Bran Stark","Stark.Rickon Stark","Stark.Robb Stark"],"resurrected":[]},{"name":"Tully.Lyssa Tully","killed":["Arryn.John Arryn"],"wed":[],"parented":["Arryn.Robyn Arryn"],"resurrected":[]},{"name":"Tully.Brynden Tully","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Tully.Edmure Tully","killed":[],"wed":["Frey.Rosalin Frey"],"parented":[],"resurrected":[]},{"name":"Tyrell.Luthor Tyrell","killed":[],"wed":["Redwyne.Olenna Redwyne"],"parented":["Tyrell.Mace Tyrell"],"resurrected":[]},{"name":"Tyrell.Mace Tyrell","killed":[],"wed":["Hightower.Alerie Hightower"],"parented":["Tyrell.Margaery Tyrell","Tyrell.Loras Tyrell"],"resurrected":[]},{"name":"Tyrell.Margaery Tyrell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Tyrell.Loras Tyrell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Umber.Umber Soldiers","killed":["Stark.Shaggydog"],"wed":[],"parented":[],"resurrected":[]},{"name":"Umber.John Umber","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Undead.The Night King","killed":["Targaryen.Viserion","Children of the Forest.The Three-Eyed Raven"],"wed":[],"parented":[],"resurrected":["Targaryen.Viserion"]},{"name":"Undead.White Walkers","killed":["Free Folk.Magnar Loboda","Nights Watch.Waymar Royce","Nights Watch.Gared"],"wed":[],"parented":[],"resurrected":[]},{"name":"Undead.Wights","killed":["Stark.Benjen Stark","Brotherhood Without Banners.Thoros of Myr","Children of the Forest.Leaf","Stark.Summer","Stark.Hodor","Free Folk.Karsi","Reed.Jojen Reed"],"wed":[],"parented":[],"resurrected":[]},{"name":"Volantis.Talisa Maegyr","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"Whent.Minisa Whent","killed":[],"wed":[],"parented":["Tully.Catelyn Tully","Tully.Lyssa Tully","Tully.Edmure Tully"],"resurrected":[]}]

/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
module.exports = __webpack_require__(125);


/***/ })

},[338]);