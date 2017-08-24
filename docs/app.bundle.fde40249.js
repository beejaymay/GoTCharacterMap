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

var svg = __WEBPACK_IMPORTED_MODULE_0_d3__["select"]("body").append("svg").attr("width", diameter).attr("height", diameter).append("g").attr("transform", "translate(" + radius + "," + radius + ")");

var links = {};
links.wed = svg.append("g").selectAll(".link.wed");
links.parented = svg.select("g").selectAll(".link.parented");
links.killed = svg.select("g").selectAll(".link.killed");
links.resurrected = svg.select("g").selectAll(".link.resurrected");

var legend = __WEBPACK_IMPORTED_MODULE_0_d3__["select"]("body svg").append("g").attr("class", "legend");

var legendData = [["Killed", "link killed source"], ["Killed By", "link killed target"], ["Wed", "link wed source"], ["Parented", "link parented source"], ["Parented By", "link parented target"], ["Resurrected", "link resurrected source"], ["Resurrected By", "link resurrected target"]];

var lineGenerator = __WEBPACK_IMPORTED_MODULE_0_d3__["line"]();

var node = svg.append("g").selectAll(".node");
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
  Object.keys(links).forEach(function (linkType) {
    links[linkType].classed("target", function (l) {
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

    node.classed(linkType, function (n) {
      return n.linkType == linkType;
    });
  });
  node.classed("target", function (n) {
    return n.target;
  }).classed("source", function (n) {
    return n.source;
  });
}

function purgeClasses() {
  Object.keys(links).forEach(function (linkType) {
    links[linkType].classed("target", false).classed("source", false);
  });
  node.classed("target", false).classed("source", false);
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

root.leaves().forEach(function (d) {
  Object.keys(links).forEach(function (linkType) {
    d.data[linkType].forEach(function (linkTarget) {
      let path = map[d.data.name].path(map[linkTarget]);
      path.linkType = linkType;
      allPaths.push(path);
    });
  });
});

allPaths.forEach(function (i, idx) {
  var linknum = 1;
  allPaths.slice(idx + 1).forEach(function (j) {
    var s1Name = i[0].data.name,
        t1Name = i[i.length - 1].data.name,
        s2Name = j[0].data.name,
        t2Name = j[j.length - 1].data.name;
    if (s1Name == s2Name && t1Name == t2Name || s1Name == t2Name && t1Name == s2Name) {
      linknum++;
    }
  });
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
  console.log(d, i);
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
exports.push([module.i, "body,\nhtml {\n  margin: 0;\n}\n.legend {\n  font: 300 10px \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-weight: 600;\n}\n.node {\n  font: 300 10px \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  fill: #bbb;\n}\n.node:hover {\n  fill: #000;\n}\n.node:hover,\n.node.source,\n.node.target {\n  font-weight: 600;\n}\n.node.parented.source,\n.node.parented.target {\n  fill: green;\n}\n.node.resurrected.source,\n.node.resurrected.target {\n  fill: #c07cff;\n}\n.node.wed.source,\n.node.wed.target {\n  fill: blue;\n}\n.node.killed.source,\n.node.killed.target {\n  fill: red;\n}\n.link {\n  stroke: lightblue;\n  stroke-opacity: 0.4;\n  fill: none;\n  pointer-events: none;\n}\n.link.source,\n.link.target {\n  stroke-opacity: 1;\n  stroke-width: 2px;\n}\n.link.killed.target,\n.link.parented.target,\n.link.resurrected.target {\n  stroke-dasharray: 2px 2px;\n}\n.link.resurrected.source,\n.link.resurrected.target {\n  stroke: #c07cff;\n}\n.link.killed.source,\n.link.killed.target {\n  stroke: red;\n}\n.link.wed.source,\n.link.wed.target {\n  stroke: blue;\n}\n.link.parented.source,\n.link.parented.target {\n  stroke: green;\n}\n", ""]);

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

module.exports = [{"name":"arryn.John Arryn","killed":[],"wed":["tully.Lyssa Tully"],"parented":["arryn.Robyn Arryn"],"resurrected":[]},{"name":"arryn.Robyn Arryn","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"arryn.Hugh","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"arryn.Vardis Egen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"astapor.Kraznys Mo Nakloz","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"astapor.Missandei","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"astapor.White Rat","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"astapor.Grey Worm","killed":["meereen.Belicho Paenymion","meereen.Razdal Mo Eraz"],"wed":[],"parented":[],"resurrected":[]},{"name":"baelish.Petyr Baelish","killed":["tully.Lyssa Tully"],"wed":["tully.Lyssa Tully"],"parented":[],"resurrected":[]},{"name":"baelish.(Soldiers)","killed":["baratheon.Dontos Hollard"],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Steffon Baratheon","killed":[],"wed":["estermont.Cassana Estermont"],"parented":["baratheon.Robert Baratheon","baratheon.Stannis Baratheon","baratheon.Renly Baratheon"],"resurrected":[]},{"name":"baratheon.Robert Baratheon","killed":["targaryen.Rhaegar Targaryen"],"wed":["lannister.Cersei Lannister"],"parented":["baratheon.Gendry","baratheon.Barra"],"resurrected":[]},{"name":"baratheon.Stannis Baratheon","killed":["baratheon.Shireen Baratheon"],"wed":["florent.Selyse Florent"],"parented":["baratheon.Shireen Baratheon","baratheon.Petyr Baratheon","baratheon.Tommard Baratheon","baratheon.Edric Baratheon"],"resurrected":[]},{"name":"baratheon.Renly Baratheon","killed":[],"wed":["tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"baratheon.Shireen Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Dontos Hollard","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Brienne of Tarth","killed":["baratheon.Stannis Baratheon"],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Gendry","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Petyr Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Tommard Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Edric Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Meryn Trant","killed":["braavos.Syrio Forel"],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Maester Cressen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Mandon Moore","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Barristan Selmy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Ormund Baratheon","killed":[],"wed":["targaryen.Rhaelle Targaryen"],"parented":["baratheon.Steffon Baratheon"],"resurrected":[]},{"name":"baratheon.Janos Slynt","killed":["baratheon.Barra"],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Barra","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Grand Maester Pycelle","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"baratheon.Podrick Payne","killed":["baratheon.Mandon Moore"],"wed":[],"parented":[],"resurrected":[]},{"name":"braavos.Jaqen H'ghar","killed":["clegane.The Tickler","lannister.Amory Lorch"],"wed":[],"parented":[],"resurrected":[]},{"name":"braavos.Ghita","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"braavos.Syrio Forel","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"braavos.The Waif","killed":["braavos.Lady Crane"],"wed":[],"parented":[],"resurrected":[]},{"name":"braavos.Lady Crane","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"brotherhoodwithoutbanners.Steve","killed":["smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"brotherhoodwithoutbanners.Gatins","killed":["smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"brotherhoodwithoutbanners.Lem Lemoncloak","killed":["smallfolk.Ray"],"wed":[],"parented":[],"resurrected":[]},{"name":"bolton.Ramsay Bolton","killed":["greyjoy.Dagmer","wildling.Osha","giants.Wun Weg Wun Dar Wun","stark.Rickon Stark","greyjoy.Adrack Humble","smallfolk.Tansy","bolton.Roose Bolton","frey.Walda Frey"],"wed":["stark.Sansa Stark"],"parented":[],"resurrected":[]},{"name":"bolton.Roose Bolton","killed":["stark.Robb Stark"],"wed":["frey.Walda Frey"],"parented":["bolton.Ramsay Bolton"],"resurrected":[]},{"name":"bolton.Locke","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"bolton.Myranda","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"childrenoftheforest.The Three-Eyed Raven","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"childrenoftheforest.Leaf","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"clegane.Gregor Clegane","killed":["brotherhoodwithoutbanners.Steve","brotherhoodwithoutbanners.Gatins","brotherhoodwithoutbanners.Lem Lemoncloak","arryn.Hugh","martell.Oberyn Martell","martell.Elia Martell","targaryen.Aegon Targaryen","targaryen.Rhaenys Targaryen"],"wed":[],"parented":[],"resurrected":[]},{"name":"clegane.Sandor Clegane","killed":["smallfolk.Mycah","light.Beric Dondarrion"],"wed":[],"parented":[],"resurrected":[]},{"name":"clegane.The Tickler","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"direwolves.Grey Wind","killed":["lannister.Rennick"],"wed":[],"parented":[],"resurrected":[]},{"name":"direwolves.Ghost","killed":["nightswatch.Rast"],"wed":[],"parented":[],"resurrected":[]},{"name":"direwolves.Summer","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"direwolves.Shaggydog","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Khal Drogo","killed":["dothraki.Mago","targaryen.Viserys Targaryen"],"wed":["targaryen.Danaerys Targaryen"],"parented":[],"resurrected":[]},{"name":"dothraki.Mago","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Qotho","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Rhaego","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Aggo","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Irri","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dothraki.Khal Moro","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"dragons.Drogon","killed":["thirteen.Pyat Pree","tarly.Dickon Tarly","tarly.Randyll Tarly","smallfolk.Zalla","astapor.Kraznys Mo Nakloz"],"wed":[],"parented":[],"resurrected":[]},{"name":"dragons.Rhaegal","killed":["thirteen.Pyat Pree"],"wed":[],"parented":[],"resurrected":[]},{"name":"dragons.Viserion","killed":["thirteen.Pyat Pree"],"wed":[],"parented":[],"resurrected":[]},{"name":"erenford.Joyeuse Erenford","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"estermont.Cassana Estermont","killed":[],"wed":[],"parented":["baratheon.Robert Baratheon","baratheon.Stannis Baratheon","baratheon.Renly Baratheon"],"resurrected":[]},{"name":"florent.Axell Florent","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"florent.Selyse Florent","killed":[],"wed":[],"parented":["baratheon.Shireen Baratheon","baratheon.Petyr Baratheon","baratheon.Tommard Baratheon","baratheon.Edric Baratheon"],"resurrected":[]},{"name":"florent.Melessa Florent","killed":[],"wed":[],"parented":["tarly.Samwell Tarly","tarly.Talla Tarly","tarly.Dickon Tarly"],"resurrected":[]},{"name":"frey.Walder Frey","killed":[],"wed":["erenford.Joyeuse Erenford"],"parented":["frey.Rosalin Frey"],"resurrected":[]},{"name":"frey.Rosalin Frey","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"frey.Walda Frey","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"frey.Lothar Frey","killed":["volantis.Talisa Maegyr"],"wed":[],"parented":[],"resurrected":[]},{"name":"frey.Walder Rivers","killed":["tully.Catelyn Tully"],"wed":[],"parented":[],"resurrected":[]},{"name":"frey.(Soldiers)","killed":["direwolves.Grey Wind"],"wed":[],"parented":[],"resurrected":[]},{"name":"giants.Mag Mar Run Doh Weg","killed":["nightswatch.Grenn"],"wed":[],"parented":[],"resurrected":[]},{"name":"giants.Wun Weg Wun Dar Wun","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"giants.Dongo","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Balon Greyjoy","killed":[],"wed":[],"parented":["greyjoy.Yara Greyjoy","greyjoy.Theon Greyjoy"],"resurrected":[]},{"name":"greyjoy.Yara Greyjoy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Theon Greyjoy","killed":["bolton.Myranda","smallfolk.Billy","smallfolk.Jack","wildling.Stiv","stark.Rodrik Cassel"],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Euron Greyjoy","killed":["sand.Nymeria Sand","sand.Obara Sand","greyjoy.Balon Greyjoy"],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Adrack Humble","killed":["greyjoy.Ralf Kenning"],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Ralf Kenning","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Dagmer","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"greyjoy.Drennan","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"hightower.Alerie Hightower","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"hightower.Gerold Hightower","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Joffrey Baratheon","killed":["stark.Ros"],"wed":["tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"lannister.Myrcella Baratheon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Tommen Baratheon","killed":[],"wed":["tyrell.Margaery Tyrell"],"parented":[],"resurrected":[]},{"name":"lannister.Alton Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Cersei Lannister","killed":["sand.Ellaria Sand","sand.Tyene Sand","lannister.Lancel Lannister","tyrell.Margaery Tyrell","tyrell.Loras Tyrell","tyrell.Mace Tyrell","sparrow.The High Sparrow","lannister.Kevan Lannister"],"wed":[],"parented":["lannister.Joffrey Baratheon","lannister.Tommen Baratheon","lannister.Myrcella Baratheon"],"resurrected":[]},{"name":"lannister.Jaime Lannister","killed":["redwyne.Olenna Redwyne","stark.Torrhen Karstark","lannister.Alton Lannister","targaryen.Aerys Targaryen II"],"wed":[],"parented":["lannister.Joffrey Baratheon","lannister.Tommen Baratheon","lannister.Myrcella Baratheon"],"resurrected":[]},{"name":"lannister.Joanna Lannister","killed":[],"wed":[],"parented":["lannister.Jaime Lannister","lannister.Cersei Lannister","lannister.Tyrion Lannister"],"resurrected":[]},{"name":"lannister.Kevan Lannister","killed":[],"wed":[],"parented":["lannister.Lancel Lannister"],"resurrected":[]},{"name":"lannister.Lancel Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Martyn Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Tyrion Lannister","killed":["lannister.Tywin Lannister","lannister.Shae"],"wed":["stark.Sansa Stark"],"parented":[],"resurrected":[]},{"name":"lannister.Tywin Lannister","killed":[],"wed":["lannister.Joanna Lannister"],"parented":["lannister.Jaime Lannister","lannister.Cersei Lannister","lannister.Tyrion Lannister"],"resurrected":[]},{"name":"lannister.Willem Lannister","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Amory Lorch","killed":["nightswatch.Yoren"],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Polliver","killed":["smallfolk.Lommy Greenhands"],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Qyburn","killed":["baratheon.Grand Maester Pycelle"],"wed":[],"parented":[],"resurrected":["clegane.Gregor Clegane"]},{"name":"lannister.Rennick","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Rorge","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.Shae","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"lannister.(Soldiers)","killed":["tully.Brynden Tully","stark.Septa Mordane","stark.Vayon Poole"],"wed":[],"parented":[],"resurrected":[]},{"name":"lhazar.Mirri Maz Duur","killed":["dothraki.Rhaego"],"wed":[],"parented":[],"resurrected":[]},{"name":"light.Melisandre","killed":["florent.Axell Florent","baratheon.Renly Baratheon","baratheon.Maester Cressen"],"wed":[],"parented":[],"resurrected":["stark.Jon Snow"]},{"name":"light.Beric Dondarrion","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"light.Thoros of Myr","killed":[],"wed":[],"parented":[],"resurrected":["light.Beric Dondarrion"]},{"name":"lys.Doreah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"martell.Areo Hotah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"martell.Maester Caleotte","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"martell.Elia Martell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"martell.Trystane Martell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"martell.Doran Martell","killed":[],"wed":["norvos.Mellario of Norvos"],"parented":["martell.Trystane Martell"],"resurrected":[]},{"name":"martell.Oberyn Martell","killed":["clegane.Gregor Clegane"],"wed":["sand.Ellaria Sand"],"parented":["sand.Obara Sand","sand.Nymeria Sand","sand.Tyene Sand"],"resurrected":[]},{"name":"meereen.Oznak zo Pahl","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"meereen.Razdal Mo Eraz","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"meereen.Hizdahr Zo Loraq","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"meereen.Mossador","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"meereen.Belicho Paenymion","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"meereen.Sons of the Harpy","killed":["astapor.White Rat","meereen.Hizdahr Zo Loraq","baratheon.Barristan Selmy"],"wed":[],"parented":[],"resurrected":[]},{"name":"mormont.Jeor Mormont","killed":[],"wed":[],"parented":["mormont.Jorah Mormont"],"resurrected":[]},{"name":"mormont.Jorah Mormont","killed":["dothraki.Qotho"],"wed":[],"parented":[],"resurrected":[]},{"name":"mormont.Maege Mormont","killed":[],"wed":[],"parented":["mormont.Lyanna Mormont"],"resurrected":[]},{"name":"mormont.Lyanna Mormont","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Grenn","killed":["giants.Mag Mar Run Doh Weg"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Alliser Thorne","killed":["stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Pypar","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Bowen Marsh","killed":["stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Othell Yarwyck","killed":["stark.Jon Snow"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Gared","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Yoren","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Karl Tanner","killed":["wildling.Craster"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Olly","killed":["stark.Jon Snow","wildling.Ygritte"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Qhorin Halfhand","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Rast","killed":["mormont.Jeor Mormont"],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Waymar Royce","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"nightswatch.Will","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"norvos.Mellario of Norvos","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"payne.Ilyn Payne","killed":["stark.Eddard Stark"],"wed":[],"parented":[],"resurrected":[]},{"name":"reed.Howland Reed","killed":[],"wed":[],"parented":["reed.Jojen Reed","reed.Meera Reed"],"resurrected":[]},{"name":"reed.Jojen Reed","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"reed.Meera Reed","killed":["reed.Jojen Reed"],"wed":[],"parented":[],"resurrected":[]},{"name":"redwyne.Olenna Redwyne","killed":["lannister.Joffrey Baratheon"],"wed":[],"parented":["tyrell.Mace Tyrell"],"resurrected":[]},{"name":"sand.Ellaria Sand","killed":["lannister.Myrcella Baratheon","martell.Doran Martell"],"wed":[],"parented":["sand.Obara Sand","sand.Nymeria Sand","sand.Tyene Sand"],"resurrected":[]},{"name":"sand.Obara Sand","killed":["martell.Trystane Martell"],"wed":[],"parented":[],"resurrected":[]},{"name":"sand.Nymeria Sand","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"sand.Tyene Sand","killed":["martell.Maester Caleotte","martell.Areo Hotah"],"wed":[],"parented":[],"resurrected":[]},{"name":"seaworth.Davos Seaworth","killed":[],"wed":[],"parented":["seaworth.Matthos Seaworth"],"resurrected":[]},{"name":"seaworth.Matthos Seaworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"secondsons.Mero","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"secondsons.Daario Naharis","killed":["dothraki.Aggo","meereen.Mossador","meereen.Oznak zo Pahl","secondsons.Mero","secondsons.Prendahl na Ghezn"],"wed":[],"parented":[],"resurrected":[]},{"name":"secondsons.Prendahl na Ghezn","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Lommy Greenhands","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Guymon","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Zalla","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Tansy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Billy","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Jack","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Ray","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"smallfolk.Mycah","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"sparrow.The High Sparrow","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Rickard Stark","killed":[],"wed":[],"parented":["stark.Benjen Stark","stark.Eddard Stark","stark.Brandon Stark","stark.Lyanna Stark"],"resurrected":[]},{"name":"stark.Lyanna Stark","killed":[],"wed":[],"parented":["stark.Jon Snow"],"resurrected":[]},{"name":"stark.Benjen Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Brandon Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Eddard Stark","killed":["targaryen.Arthur Dayne","hightower.Gerold Hightower"],"wed":["tully.Catelyn Tully"],"parented":["stark.Sansa Stark","stark.Arya Stark","stark.Brann Stark","stark.Rickon Stark","stark.Robb Stark"],"resurrected":[]},{"name":"stark.Robb Stark","killed":["wildling.Wallen","stark.Rickard Karstark"],"wed":["volantis.Talisa Maegyr"],"parented":[],"resurrected":[]},{"name":"stark.Arya Stark","killed":["frey.Walder Frey","frey.Walder Rivers","frey.Lothar Frey","braavos.The Waif","braavos.Ghita","lannister.Rorge","baratheon.Meryn Trant","lannister.Polliver"],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Jon Snow","killed":["nightswatch.Othell Yarwyck","nightswatch.Olly","nightswatch.Bowen Marsh","nightswatch.Alliser Thorne","undead.White Walkers","baratheon.Janos Slynt","wildling.Mance Rayder","wildling.Styr","nightswatch.Qhorin Halfhand","wildling.Orell","nightswatch.Karl Tanner"],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Sansa Stark","killed":["bolton.Ramsay Bolton"],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Rickon Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Brann Stark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Septa Mordane","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Vayon Poole","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Rodrik Cassel","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Maester Luwin","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Torrhen Karstark","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Rickard Karstark","killed":["lannister.Martyn Lannister","lannister.Willem Lannister"],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Ros","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stark.Hodor","killed":["bolton.Locke"],"wed":[],"parented":[],"resurrected":[]},{"name":"stokeworth.Lollys Stokeworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stokeworth.Falyse Stokeworth","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"stokeworth.Tanda Stokeworth","killed":[],"wed":[],"parented":["stokeworth.Lollys Stokeworth","stokeworth.Falyse Stokeworth"],"resurrected":[]},{"name":"targaryen.Duncan Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"targaryen.Aegon Targaryen V","killed":[],"wed":[],"parented":["targaryen.Rhaelle Targaryen","targaryen.Jaehaerys Targaryen","targaryen.Duncan Targaryen"],"resurrected":[]},{"name":"targaryen.Rhaelle Targaryen","killed":[],"wed":[],"parented":["baratheon.Steffon Baratheon"],"resurrected":[]},{"name":"targaryen.Jaehaerys Targaryen","killed":[],"wed":[],"parented":["targaryen.Aerys Targaryen II","targaryen.Rhaella Targaryen"],"resurrected":[]},{"name":"targaryen.Aerys Targaryen II","killed":["stark.Rickard Stark","stark.Brandon Stark"],"wed":[],"parented":["targaryen.Viserys Targaryen","targaryen.Danaerys Targaryen","targaryen.Rhaegar Targaryen"],"resurrected":[]},{"name":"targaryen.Rhaella Targaryen","killed":[],"wed":[],"parented":["targaryen.Viserys Targaryen","targaryen.Danaerys Targaryen","targaryen.Rhaegar Targaryen"],"resurrected":[]},{"name":"targaryen.Viserys Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"targaryen.Danaerys Targaryen","killed":["dothraki.Khal Moro","dothraki.Khal Drogo","lhazar.Mirri Maz Duur","lys.Doreah","thirteen.Xaro Xhoan Daxos"],"wed":[],"parented":[],"resurrected":[]},{"name":"targaryen.Rhaegar Targaryen","killed":[],"wed":["martell.Elia Martell","stark.Lyanna Stark"],"parented":["stark.Jon Snow","targaryen.Aegon Targaryen","targaryen.Rhaenys Targaryen"],"resurrected":[]},{"name":"targaryen.Aegon Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"targaryen.Rhaenys Targaryen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"targaryen.Arthur Dayne","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"tarly.Randyll Tarly","killed":[],"wed":["florent.Melessa Florent"],"parented":["tarly.Samwell Tarly","tarly.Talla Tarly","tarly.Dickon Tarly"],"resurrected":[]},{"name":"tarly.Samwell Tarly","killed":["undead.White Walkers"],"wed":[],"parented":[],"resurrected":[]},{"name":"tarly.Talla Tarly","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"tarly.Dickon Tarly","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"thirteen.Xaro Xhoan Daxos","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"thirteen.Pyat Pree","killed":["thirteen.The Spice King","thirteen.The Copper King","thirteen.The Silk King"],"wed":[],"parented":[],"resurrected":[]},{"name":"thirteen.The Spice King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"thirteen.The Copper King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"thirteen.The Silk King","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"tully.Hoster Tully","killed":[],"wed":["whent.Minisa Whent"],"parented":["tully.Catelyn Tully","tully.Lyssa Tully","tully.Edmure Tully"],"resurrected":[]},{"name":"tully.Catelyn Tully","killed":["erenford.Joyeuse Erenford"],"wed":[],"parented":["stark.Sansa Stark","stark.Arya Stark","stark.Brann Stark","stark.Rickon Stark","stark.Robb Stark"],"resurrected":[]},{"name":"tully.Lyssa Tully","killed":["arryn.John Arryn"],"wed":[],"parented":["arryn.Robyn Arryn"],"resurrected":[]},{"name":"tully.Brynden Tully","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"tully.Edmure Tully","killed":[],"wed":["frey.Rosalin Frey"],"parented":[],"resurrected":[]},{"name":"tyrell.Luthor Tyrell","killed":[],"wed":["redwyne.Olenna Redwyne"],"parented":["tyrell.Mace Tyrell"],"resurrected":[]},{"name":"tyrell.Mace Tyrell","killed":[],"wed":["hightower.Alerie Hightower"],"parented":["tyrell.Margaery Tyrell","tyrell.Loras Tyrell"],"resurrected":[]},{"name":"tyrell.Margaery Tyrell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"tyrell.Loras Tyrell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"umber.(Soldiers)","killed":["direwolves.Shaggydog"],"wed":[],"parented":[],"resurrected":[]},{"name":"umber.John Umber","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"unaffiliated.Bronn","killed":["arryn.Vardis Egen","seaworth.Matthos Seaworth"],"wed":[],"parented":[],"resurrected":[]},{"name":"undead.The Night King","killed":["dragons.Viserion","childrenoftheforest.The Three-Eyed Raven"],"wed":[],"parented":[],"resurrected":["dragons.Viserion"]},{"name":"undead.White Walkers","killed":["wildling.Magnar Loboda","nightswatch.Waymar Royce","nightswatch.Gared","nightswatch.Will"],"wed":[],"parented":[],"resurrected":[]},{"name":"undead.Wights","killed":["childrenoftheforest.Leaf","direwolves.Summer","stark.Hodor","wildling.Karsi","reed.Jojen Reed"],"wed":[],"parented":[],"resurrected":[]},{"name":"volantis.Talisa Maegyr","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"whent.Minisa Whent","killed":[],"wed":[],"parented":["tully.Catelyn Tully","tully.Lyssa Tully","tully.Edmure Tully"],"resurrected":[]},{"name":"wildling.Ygritte","killed":["smallfolk.Guymon","nightswatch.Pypar"],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Magnar Loboda","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Karsi","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Styr","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Orell","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Craster","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Mance Rayder","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Tormund Giantsbane","killed":["umber.John Umber","wildling.Lord of Bones"],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Lord of Bones","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Stiv","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Wallen","killed":[],"wed":[],"parented":[],"resurrected":[]},{"name":"wildling.Osha","killed":["stark.Maester Luwin","greyjoy.Drennan"],"wed":[],"parented":[],"resurrected":[]}]

/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
module.exports = __webpack_require__(125);


/***/ })

},[338]);