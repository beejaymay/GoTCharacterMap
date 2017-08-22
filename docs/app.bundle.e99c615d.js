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
var node = svg.append("g").selectAll(".node");

var root = family(__WEBPACK_IMPORTED_MODULE_1__characters_json__);
var map = {};
root.leaves().forEach(function (d) {
  map[d.data.name] = d;
});

cluster(root);

function line(linknum, d) {
  var beta = 0.95 - linknum * 0.15;
  return __WEBPACK_IMPORTED_MODULE_0_d3__["radialLine"]().curve(__WEBPACK_IMPORTED_MODULE_0_d3__["curveBundle"].beta(beta)).radius(function (d) {
    return d.y;
  }).angle(function (d) {
    return d.x / 180 * Math.PI;
  });
}

var allPaths = [];
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

function setClasses(link, d) {
  link.classed("target", function (l) {
    if (l.target === d) return l.source.source = true;
  }).classed("source", function (l) {
    if (l.source === d) return l.target.target = true;
  }).filter(function (l) {
    return l.target === d || l.source === d;
  }).raise();
}

function purgeClasses(link) {
  link.classed("target", false).classed("source", false);
}

function mouseovered(d) {
  node.each(function (n) {
    n.target = n.source = false;
  });

  setClasses(links.wed, d);
  setClasses(links.parented, d);
  setClasses(links.killed, d);

  node.classed("target", function (n) {
    return n.target;
  }).classed("source", function (n) {
    return n.source;
  });
}

function mouseouted(d) {
  purgeClasses(links.killed);
  purgeClasses(links.wed);
  purgeClasses(links.parented);

  node.classed("target", false).classed("source", false);
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

/*function characterLinked(linkType) {

  var paths = [];
  root.leaves().forEach(function(d) {
    d.data[linkType].forEach(function(i) {
      paths.push(map[d.data.name].path(map[i]))
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

  return paths
}*/

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(333)();
// imports


// module
exports.push([module.i, ".node {\n  font: 300 10px \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  fill: #bbb;\n}\n.node:hover {\n  fill: #000;\n  font-weight: 600;\n}\n.link {\n  stroke: lightblue;\n  stroke-opacity: 0.4;\n  fill: none;\n  pointer-events: none;\n}\n.node--source {\n  fill: #2ca02c;\n}\n.link.source,\n.link.target {\n  stroke-opacity: 1;\n  stroke-width: 2px;\n}\n.link.killed.target,\n.link.parented.target {\n  stroke-dasharray: 2px 2px;\n}\n.link.killed.source {\n  stroke: red;\n  stroke-dashoffset: 5px;\n}\n.link.killed.target {\n  stroke: red;\n}\n.link.wed.source,\n.link.wed.target {\n  stroke: blue;\n}\n.link.parented.source,\n.link.parented.target {\n  stroke: green;\n}\n", ""]);

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

module.exports = [{"name":"arryn.John Arryn","killed":[],"wed":["tully.Lyssa Tully"],"parented":["arryn.Robyn Arryn"]},{"name":"arryn.Robyn Arryn","killed":[],"wed":[],"parented":[]},{"name":"arryn.Hugh","killed":[],"wed":[],"parented":[]},{"name":"arryn.Vardis Egen","killed":[],"wed":[],"parented":[]},{"name":"astapor.Kraznys Mo Nakloz","killed":[],"wed":[],"parented":[]},{"name":"astapor.Missandei","killed":[],"wed":[],"parented":[]},{"name":"astapor.White Rat","killed":[],"wed":[],"parented":[]},{"name":"astapor.Grey Worm","killed":["meereen.Belicho Paenymion","meereen.Razdal Mo Eraz"],"wed":[],"parented":[]},{"name":"baelish.Petyr Baelish","killed":["tully.Lyssa Tully"],"wed":["tully.Lyssa Tully"],"parented":[]},{"name":"baelish.(Soldiers)","killed":["baratheon.Dontos Hollard"],"wed":[],"parented":[]},{"name":"baratheon.Steffon Baratheon","killed":[],"wed":["estermont.Cassana Estermont"],"parented":["baratheon.Robert Baratheon","baratheon.Stannis Baratheon","baratheon.Renly Baratheon"]},{"name":"baratheon.Robert Baratheon","killed":["targaryen.Rhaegar Targaryen"],"wed":["lannister.Cersei Lannister"],"parented":["baratheon.Gendry","baratheon.Barra"]},{"name":"baratheon.Stannis Baratheon","killed":["baratheon.Shireen Baratheon"],"wed":["florent.Selyse Florent"],"parented":["baratheon.Shireen Baratheon","baratheon.Petyr Baratheon","baratheon.Tommard Baratheon","baratheon.Edric Baratheon"]},{"name":"baratheon.Renly Baratheon","killed":[],"wed":["tyrell.Margaery Tyrell"],"parented":[]},{"name":"baratheon.Shireen Baratheon","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Dontos Hollard","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Brienne of Tarth","killed":["baratheon.Stannis Baratheon"],"wed":[],"parented":[]},{"name":"baratheon.Gendry","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Petyr Baratheon","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Tommard Baratheon","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Edric Baratheon","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Meryn Trant","killed":["braavos.Syrio Forel"],"wed":[],"parented":[]},{"name":"baratheon.Maester Cressen","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Mandon Moore","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Barristan Selmy","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Ormund Baratheon","killed":[],"wed":["targaryen.Rhaelle Targaryen"],"parented":["baratheon.Steffon Baratheon"]},{"name":"baratheon.Janos Slynt","killed":["baratheon.Barra"],"wed":[],"parented":[]},{"name":"baratheon.Barra","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Grand Maester Pycelle","killed":[],"wed":[],"parented":[]},{"name":"baratheon.Podrick Payne","killed":["baratheon.Mandon Moore"],"wed":[],"parented":[]},{"name":"braavos.Jaqen H'ghar","killed":["clegane.The Tickler","lannister.Amory Lorch"],"wed":[],"parented":[]},{"name":"braavos.Ghita","killed":[],"wed":[],"parented":[]},{"name":"braavos.Syrio Forel","killed":[],"wed":[],"parented":[]},{"name":"braavos.The Waif","killed":["braavos.Lady Crane"],"wed":[],"parented":[]},{"name":"braavos.Lady Crane","killed":[],"wed":[],"parented":[]},{"name":"brotherhoodwithoutbanners.Steve","killed":["smallfolk.Ray"],"wed":[],"parented":[]},{"name":"brotherhoodwithoutbanners.Gatins","killed":["smallfolk.Ray"],"wed":[],"parented":[]},{"name":"brotherhoodwithoutbanners.Lem Lemoncloak","killed":["smallfolk.Ray"],"wed":[],"parented":[]},{"name":"bolton.Ramsay Bolton","killed":["greyjoy.Dagmer","wildling.Osha","giants.Wun Weg Wun Dar Wun","stark.Rickon Stark","greyjoy.Adrack Humble","smallfolk.Tansy","bolton.Roose Bolton","frey.Walda Frey"],"wed":["stark.Sansa Stark"],"parented":[]},{"name":"bolton.Roose Bolton","killed":["stark.Robb Stark"],"wed":["frey.Walda Frey"],"parented":["bolton.Ramsay Bolton"]},{"name":"bolton.Locke","killed":[],"wed":[],"parented":[]},{"name":"bolton.Myranda","killed":[],"wed":[],"parented":[]},{"name":"childrenoftheforest.The Three-Eyed Raven","killed":[],"wed":[],"parented":[]},{"name":"childrenoftheforest.Leaf","killed":[],"wed":[],"parented":[]},{"name":"clegane.Gregor Clegane","killed":["brotherhoodwithoutbanners.Steve","brotherhoodwithoutbanners.Gatins","brotherhoodwithoutbanners.Lem Lemoncloak","arryn.Hugh","martell.Oberyn Martell","martell.Elia Martell","targaryen.Aegon Targaryen","targaryen.Rhaenys Targaryen"],"wed":[],"parented":[]},{"name":"clegane.Sandor Clegane","killed":["smallfolk.Mycah","light.Beric Dondarrion"],"wed":[],"parented":[]},{"name":"clegane.The Tickler","killed":[],"wed":[],"parented":[]},{"name":"direwolves.Grey Wind","killed":["lannister.Rennick"],"wed":[],"parented":[]},{"name":"direwolves.Ghost","killed":["nightswatch.Rast"],"wed":[],"parented":[]},{"name":"direwolves.Summer","killed":[],"wed":[],"parented":[]},{"name":"direwolves.Shaggydog","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Khal Drogo","killed":["dothraki.Mago","targaryen.Viserys Targaryen"],"wed":["targaryen.Danaerys Targaryen"],"parented":[]},{"name":"dothraki.Mago","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Qotho","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Rhaego","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Aggo","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Irri","killed":[],"wed":[],"parented":[]},{"name":"dothraki.Khal Moro","killed":[],"wed":[],"parented":[]},{"name":"dragons.Drogon","killed":["thirteen.Pyat Pree","tarly.Dickon Tarly","tarly.Randyll Tarly","smallfolk.Zalla","astapor.Kraznys Mo Nakloz"],"wed":[],"parented":[]},{"name":"dragons.Rhaegal","killed":["thirteen.Pyat Pree"],"wed":[],"parented":[]},{"name":"dragons.Viserion","killed":["thirteen.Pyat Pree"],"wed":[],"parented":[]},{"name":"erenford.Joyeuse Erenford","killed":[],"wed":[],"parented":[]},{"name":"estermont.Cassana Estermont","killed":[],"wed":[],"parented":["baratheon.Robert Baratheon","baratheon.Stannis Baratheon","baratheon.Renly Baratheon"]},{"name":"florent.Axell Florent","killed":[],"wed":[],"parented":[]},{"name":"florent.Selyse Florent","killed":[],"wed":[],"parented":["baratheon.Shireen Baratheon","baratheon.Petyr Baratheon","baratheon.Tommard Baratheon","baratheon.Edric Baratheon"]},{"name":"florent.Melessa Florent","killed":[],"wed":[],"parented":["tarly.Samwell Tarly","tarly.Talla Tarly","tarly.Dickon Tarly"]},{"name":"frey.Walder Frey","killed":[],"wed":["erenford.Joyeuse Erenford"],"parented":["frey.Rosalin Frey"]},{"name":"frey.Rosalin Frey","killed":[],"wed":[],"parented":[]},{"name":"frey.Walda Frey","killed":[],"wed":[],"parented":[]},{"name":"frey.Lothar Frey","killed":["volantis.Talisa Maegyr"],"wed":[],"parented":[]},{"name":"frey.Walder Rivers","killed":["tully.Catelyn Tully"],"wed":[],"parented":[]},{"name":"frey.(Soldiers)","killed":["direwolves.Grey Wind"],"wed":[],"parented":[]},{"name":"giants.Mag Mar Run Doh Weg","killed":["nightswatch.Grenn"],"wed":[],"parented":[]},{"name":"giants.Wun Weg Wun Dar Wun","killed":[],"wed":[],"parented":[]},{"name":"giants.Dongo","killed":[],"wed":[],"parented":[]},{"name":"greyjoy.Balon Greyjoy","killed":[],"wed":[],"parented":["greyjoy.Yara Greyjoy","greyjoy.Theon Greyjoy"]},{"name":"greyjoy.Yara Greyjoy","killed":[],"wed":[],"parented":[]},{"name":"greyjoy.Theon Greyjoy","killed":["bolton.Myranda","smallfolk.Billy","smallfolk.Jack","wildling.Stiv","stark.Rodrik Cassel"],"wed":[],"parented":[]},{"name":"greyjoy.Euron Greyjoy","killed":["sand.Nymeria Sand","sand.Obara Sand","greyjoy.Balon Greyjoy"],"wed":[],"parented":[]},{"name":"greyjoy.Adrack Humble","killed":["greyjoy.Ralf Kenning"],"wed":[],"parented":[]},{"name":"greyjoy.Ralf Kenning","killed":[],"wed":[],"parented":[]},{"name":"greyjoy.Dagmer","killed":[],"wed":[],"parented":[]},{"name":"greyjoy.Drennan","killed":[],"wed":[],"parented":[]},{"name":"hightower.Alerie Hightower","killed":[],"wed":[],"parented":[]},{"name":"hightower.Gerold Hightower","killed":[],"wed":[],"parented":[]},{"name":"lannister.Joffrey Baratheon","killed":["stark.Ros"],"wed":["tyrell.Margaery Tyrell"],"parented":[]},{"name":"lannister.Myrcella Baratheon","killed":[],"wed":[],"parented":[]},{"name":"lannister.Tommen Baratheon","killed":[],"wed":["tyrell.Margaery Tyrell"],"parented":[]},{"name":"lannister.Alton Lannister","killed":[],"wed":[],"parented":[]},{"name":"lannister.Cersei Lannister","killed":["sand.Ellaria Sand","sand.Tyene Sand","lannister.Lancel Lannister","tyrell.Margaery Tyrell","tyrell.Loras Tyrell","tyrell.Mace Tyrell","sparrow.The High Sparrow","lannister.Kevan Lannister"],"wed":[],"parented":["lannister.Joffrey Baratheon","lannister.Tommen Baratheon","lannister.Myrcella Baratheon"]},{"name":"lannister.Jaime Lannister","killed":["redwyne.Olenna Redwyne","stark.Torrhen Karstark","lannister.Alton Lannister","targaryen.Aerys Targaryen II"],"wed":[],"parented":["lannister.Joffrey Baratheon","lannister.Tommen Baratheon","lannister.Myrcella Baratheon"]},{"name":"lannister.Joanna Lannister","killed":[],"wed":[],"parented":["lannister.Jaime Lannister","lannister.Cersei Lannister","lannister.Tyrion Lannister"]},{"name":"lannister.Kevan Lannister","killed":[],"wed":[],"parented":["lannister.Lancel Lannister"]},{"name":"lannister.Lancel Lannister","killed":[],"wed":[],"parented":[]},{"name":"lannister.Martyn Lannister","killed":[],"wed":[],"parented":[]},{"name":"lannister.Tyrion Lannister","killed":["lannister.Tywin Lannister","lannister.Shae"],"wed":["stark.Sansa Stark"],"parented":[]},{"name":"lannister.Tywin Lannister","killed":[],"wed":["lannister.Joanna Lannister"],"parented":["lannister.Jaime Lannister","lannister.Cersei Lannister","lannister.Tyrion Lannister"]},{"name":"lannister.Willem Lannister","killed":[],"wed":[],"parented":[]},{"name":"lannister.Amory Lorch","killed":["nightswatch.Yoren"],"wed":[],"parented":[]},{"name":"lannister.Polliver","killed":["smallfolk.Lommy Greenhands"],"wed":[],"parented":[]},{"name":"lannister.Qyburn","killed":["baratheon.Grand Maester Pycelle"],"wed":[],"parented":[]},{"name":"lannister.Rennick","killed":[],"wed":[],"parented":[]},{"name":"lannister.Rorge","killed":[],"wed":[],"parented":[]},{"name":"lannister.Shae","killed":[],"wed":[],"parented":[]},{"name":"lannister.(Soldiers)","killed":["tully.Brynden Tully","stark.Septa Mordane","stark.Vayon Poole"],"wed":[],"parented":[]},{"name":"lhazar.Mirri Maz Duur","killed":["dothraki.Rhaego"],"wed":[],"parented":[]},{"name":"light.Melisandre","killed":["florent.Axell Florent","baratheon.Renly Baratheon","baratheon.Maester Cressen"],"wed":[],"parented":[]},{"name":"light.Beric Dondarrion","killed":[],"wed":[],"parented":[]},{"name":"lys.Doreah","killed":[],"wed":[],"parented":[]},{"name":"martell.Areo Hotah","killed":[],"wed":[],"parented":[]},{"name":"martell.Maester Caleotte","killed":[],"wed":[],"parented":[]},{"name":"martell.Elia Martell","killed":[],"wed":[],"parented":[]},{"name":"martell.Trystane Martell","killed":[],"wed":[],"parented":[]},{"name":"martell.Doran Martell","killed":[],"wed":["norvos.Mellario of Norvos"],"parented":["martell.Trystane Martell"]},{"name":"martell.Oberyn Martell","killed":["clegane.Gregor Clegane"],"wed":["sand.Ellaria Sand"],"parented":["sand.Obara Sand","sand.Nymeria Sand","sand.Tyene Sand"]},{"name":"meereen.Oznak zo Pahl","killed":[],"wed":[],"parented":[]},{"name":"meereen.Razdal Mo Eraz","killed":[],"wed":[],"parented":[]},{"name":"meereen.Hizdahr Zo Loraq","killed":[],"wed":[],"parented":[]},{"name":"meereen.Mossador","killed":[],"wed":[],"parented":[]},{"name":"meereen.Belicho Paenymion","killed":[],"wed":[],"parented":[]},{"name":"meereen.Sons of the Harpy","killed":["astapor.White Rat","meereen.Hizdahr Zo Loraq","baratheon.Barristan Selmy"],"wed":[],"parented":[]},{"name":"mormont.Jeor Mormont","killed":[],"wed":[],"parented":["mormont.Jorah Mormont"]},{"name":"mormont.Jorah Mormont","killed":["dothraki.Qotho"],"wed":[],"parented":[]},{"name":"mormont.Maege Mormont","killed":[],"wed":[],"parented":["mormont.Lyanna Mormont"]},{"name":"mormont.Lyanna Mormont","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Grenn","killed":["giants.Mag Mar Run Doh Weg"],"wed":[],"parented":[]},{"name":"nightswatch.Alliser Thorne","killed":["stark.Jon Snow"],"wed":[],"parented":[]},{"name":"nightswatch.Pypar","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Bowen Marsh","killed":["stark.Jon Snow"],"wed":[],"parented":[]},{"name":"nightswatch.Othell Yarwyck","killed":["stark.Jon Snow"],"wed":[],"parented":[]},{"name":"nightswatch.Gared","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Yoren","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Karl Tanner","killed":["wildling.Craster"],"wed":[],"parented":[]},{"name":"nightswatch.Olly","killed":["stark.Jon Snow","wildling.Ygritte"],"wed":[],"parented":[]},{"name":"nightswatch.Qhorin Halfhand","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Rast","killed":["mormont.Jeor Mormont"],"wed":[],"parented":[]},{"name":"nightswatch.Waymar Royce","killed":[],"wed":[],"parented":[]},{"name":"nightswatch.Will","killed":[],"wed":[],"parented":[]},{"name":"norvos.Mellario of Norvos","killed":[],"wed":[],"parented":[]},{"name":"payne.Ilyn Payne","killed":["stark.Eddard Stark"],"wed":[],"parented":[]},{"name":"reed.Howland Reed","killed":[],"wed":[],"parented":["reed.Jojen Reed","reed.Meera Reed"]},{"name":"reed.Jojen Reed","killed":[],"wed":[],"parented":[]},{"name":"reed.Meera Reed","killed":["reed.Jojen Reed"],"wed":[],"parented":[]},{"name":"redwyne.Olenna Redwyne","killed":["lannister.Joffrey Baratheon"],"wed":[],"parented":["tyrell.Mace Tyrell"]},{"name":"sand.Ellaria Sand","killed":["lannister.Myrcella Baratheon","martell.Doran Martell"],"wed":[],"parented":["sand.Obara Sand","sand.Nymeria Sand","sand.Tyene Sand"]},{"name":"sand.Obara Sand","killed":["martell.Trystane Martell"],"wed":[],"parented":[]},{"name":"sand.Nymeria Sand","killed":[],"wed":[],"parented":[]},{"name":"sand.Tyene Sand","killed":["martell.Maester Caleotte","martell.Areo Hotah"],"wed":[],"parented":[]},{"name":"seaworth.Davos Seaworth","killed":[],"wed":[],"parented":["seaworth.Matthos Seaworth"]},{"name":"seaworth.Matthos Seaworth","killed":[],"wed":[],"parented":[]},{"name":"secondsons.Mero","killed":[],"wed":[],"parented":[]},{"name":"secondsons.Daario Naharis","killed":["dothraki.Aggo","meereen.Mossador","meereen.Oznak zo Pahl","secondsons.Mero","secondsons.Prendahl na Ghezn"],"wed":[],"parented":[]},{"name":"secondsons.Prendahl na Ghezn","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Lommy Greenhands","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Guymon","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Zalla","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Tansy","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Billy","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Jack","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Ray","killed":[],"wed":[],"parented":[]},{"name":"smallfolk.Mycah","killed":[],"wed":[],"parented":[]},{"name":"sparrow.The High Sparrow","killed":[],"wed":[],"parented":[]},{"name":"stark.Rickard Stark","killed":[],"wed":[],"parented":["stark.Benjen Stark","stark.Eddard Stark","stark.Brandon Stark","stark.Lyanna Stark"]},{"name":"stark.Lyanna Stark","killed":[],"wed":["targaryen.Rhaegar Targaryen"],"parented":["stark.Jon Snow"]},{"name":"stark.Benjen Stark","killed":[],"wed":[],"parented":[]},{"name":"stark.Brandon Stark","killed":[],"wed":[],"parented":[]},{"name":"stark.Eddard Stark","killed":["targaryen.Arthur Dayne","hightower.Gerold Hightower"],"wed":["tully.Catelyn Tully"],"parented":["stark.Sansa Stark","stark.Arya Stark","stark.Brann Stark","stark.Rickon Stark","stark.Robb Stark"]},{"name":"stark.Robb Stark","killed":["wildling.Wallen","stark.Rickard Karstark"],"wed":["volantis.Talisa Maegyr"],"parented":[]},{"name":"stark.Arya Stark","killed":["frey.Walder Frey","frey.Walder Rivers","frey.Lothar Frey","braavos.The Waif","braavos.Ghita","lannister.Rorge","baratheon.Meryn Trant","lannister.Polliver"],"wed":[],"parented":[]},{"name":"stark.Jon Snow","killed":["nightswatch.Othell Yarwyck","nightswatch.Olly","nightswatch.Bowen Marsh","nightswatch.Alliser Thorne","undead.White Walkers","baratheon.Janos Slynt","wildling.Mance Rayder","wildling.Styr","nightswatch.Qhorin Halfhand","wildling.Orell","nightswatch.Karl Tanner"],"wed":[],"parented":[]},{"name":"stark.Sansa Stark","killed":["bolton.Ramsay Bolton"],"wed":[],"parented":[]},{"name":"stark.Rickon Stark","killed":[],"wed":[],"parented":[]},{"name":"stark.Brann Stark","killed":[],"wed":[],"parented":[]},{"name":"stark.Septa Mordane","killed":[],"wed":[],"parented":[]},{"name":"stark.Vayon Poole","killed":[],"wed":[],"parented":[]},{"name":"stark.Rodrik Cassel","killed":[],"wed":[],"parented":[]},{"name":"stark.Maester Luwin","killed":[],"wed":[],"parented":[]},{"name":"stark.Torrhen Karstark","killed":[],"wed":[],"parented":[]},{"name":"stark.Rickard Karstark","killed":["lannister.Martyn Lannister","lannister.Willem Lannister"],"wed":[],"parented":[]},{"name":"stark.Ros","killed":[],"wed":[],"parented":[]},{"name":"stark.Hodor","killed":["bolton.Locke"],"wed":[],"parented":[]},{"name":"stokeworth.Lollys Stokeworth","killed":[],"wed":[],"parented":[]},{"name":"stokeworth.Falyse Stokeworth","killed":[],"wed":[],"parented":[]},{"name":"stokeworth.Tanda Stokeworth","killed":[],"wed":[],"parented":["stokeworth.Lollys Stokeworth","stokeworth.Falyse Stokeworth"]},{"name":"targaryen.Duncan Targaryen","killed":[],"wed":[],"parented":[]},{"name":"targaryen.Aegon Targaryen V","killed":[],"wed":[],"parented":["targaryen.Rhaelle Targaryen","targaryen.Jaehaerys Targaryen","targaryen.Duncan Targaryen"]},{"name":"targaryen.Rhaelle Targaryen","killed":[],"wed":[],"parented":["baratheon.Steffon Baratheon"]},{"name":"targaryen.Jaehaerys Targaryen","killed":[],"wed":[],"parented":["targaryen.Aerys Targaryen II","targaryen.Rhaella Targaryen"]},{"name":"targaryen.Aerys Targaryen II","killed":["stark.Rickard Stark","stark.Brandon Stark"],"wed":[],"parented":["targaryen.Viserys Targaryen","targaryen.Danaerys Targaryen","targaryen.Rhaegar Targaryen"]},{"name":"targaryen.Rhaella Targaryen","killed":[],"wed":[],"parented":["targaryen.Viserys Targaryen","targaryen.Danaerys Targaryen","targaryen.Rhaegar Targaryen"]},{"name":"targaryen.Viserys Targaryen","killed":[],"wed":[],"parented":[]},{"name":"targaryen.Danaerys Targaryen","killed":["dothraki.Khal Moro","dothraki.Khal Drogo","lhazar.Mirri Maz Duur","lys.Doreah","thirteen.Xaro Xhoan Daxos"],"wed":[],"parented":[]},{"name":"targaryen.Rhaegar Targaryen","killed":[],"wed":["martell.Elia Martell","stark.Lyanna Stark"],"parented":["stark.Jon Snow","targaryen.Aegon Targaryen","targaryen.Rhaenys Targaryen"]},{"name":"targaryen.Aegon Targaryen","killed":[],"wed":[],"parented":[]},{"name":"targaryen.Rhaenys Targaryen","killed":[],"wed":[],"parented":[]},{"name":"targaryen.Arthur Dayne","killed":[],"wed":[],"parented":[]},{"name":"tarly.Randyll Tarly","killed":[],"wed":["florent.Melessa Florent"],"parented":["tarly.Samwell Tarly","tarly.Talla Tarly","tarly.Dickon Tarly"]},{"name":"tarly.Samwell Tarly","killed":["undead.White Walkers"],"wed":[],"parented":[]},{"name":"tarly.Talla Tarly","killed":[],"wed":[],"parented":[]},{"name":"tarly.Dickon Tarly","killed":[],"wed":[],"parented":[]},{"name":"thirteen.Xaro Xhoan Daxos","killed":[],"wed":[],"parented":[]},{"name":"thirteen.Pyat Pree","killed":["thirteen.The Spice King","thirteen.The Copper King","thirteen.The Silk King"],"wed":[],"parented":[]},{"name":"thirteen.The Spice King","killed":[],"wed":[],"parented":[]},{"name":"thirteen.The Copper King","killed":[],"wed":[],"parented":[]},{"name":"thirteen.The Silk King","killed":[],"wed":[],"parented":[]},{"name":"tully.Hoster Tully","killed":[],"wed":["whent.Minisa Whent"],"parented":["tully.Catelyn Tully","tully.Lyssa Tully","tully.Edmure Tully"]},{"name":"tully.Catelyn Tully","killed":["erenford.Joyeuse Erenford"],"wed":[],"parented":["stark.Sansa Stark","stark.Arya Stark","stark.Brann Stark","stark.Rickon Stark","stark.Robb Stark"]},{"name":"tully.Lyssa Tully","killed":[],"wed":[],"parented":["arryn.Robyn Arryn"]},{"name":"tully.Brynden Tully","killed":[],"wed":[],"parented":[]},{"name":"tully.Edmure Tully","killed":[],"wed":["frey.Rosalin Frey"],"parented":[]},{"name":"tyrell.Luthor Tyrell","killed":[],"wed":["redwyne.Olenna Redwyne"],"parented":["tyrell.Mace Tyrell"]},{"name":"tyrell.Mace Tyrell","killed":[],"wed":["hightower.Alerie Hightower"],"parented":["tyrell.Margaery Tyrell","tyrell.Loras Tyrell"]},{"name":"tyrell.Margaery Tyrell","killed":[],"wed":[],"parented":[]},{"name":"tyrell.Loras Tyrell","killed":[],"wed":[],"parented":[]},{"name":"umber.(Soldiers)","killed":["direwolves.Shaggydog"],"wed":[],"parented":[]},{"name":"umber.John Umber","killed":[],"wed":[],"parented":[]},{"name":"unaffiliated.Bronn","killed":["arryn.Vardis Egen","seaworth.Matthos Seaworth"],"wed":[],"parented":[]},{"name":"undead.The Night King","killed":["dragons.Viserion","childrenoftheforest.The Three-Eyed Raven"],"wed":[],"parented":[]},{"name":"undead.White Walkers","killed":["wildling.Magnar Loboda","nightswatch.Waymar Royce","nightswatch.Gared","nightswatch.Will"],"wed":[],"parented":[]},{"name":"undead.Wights","killed":["childrenoftheforest.Leaf","direwolves.Summer","stark.Hodor","wildling.Karsi","reed.Jojen Reed"],"wed":[],"parented":[]},{"name":"volantis.Talisa Maegyr","killed":[],"wed":[],"parented":[]},{"name":"whent.Minisa Whent","killed":[],"wed":[],"parented":["tully.Catelyn Tully","tully.Lyssa Tully","tully.Edmure Tully"]},{"name":"wildling.Ygritte","killed":["smallfolk.Guymon","nightswatch.Pypar"],"wed":[],"parented":[]},{"name":"wildling.Magnar Loboda","killed":[],"wed":[],"parented":[]},{"name":"wildling.Karsi","killed":[],"wed":[],"parented":[]},{"name":"wildling.Styr","killed":[],"wed":[],"parented":[]},{"name":"wildling.Orell","killed":[],"wed":[],"parented":[]},{"name":"wildling.Craster","killed":[],"wed":[],"parented":[]},{"name":"wildling.Mance Rayder","killed":[],"wed":[],"parented":[]},{"name":"wildling.Tormund Giantsbane","killed":["umber.John Umber","wildling.Lord of Bones"],"wed":[],"parented":[]},{"name":"wildling.Lord of Bones","killed":[],"wed":[],"parented":[]},{"name":"wildling.Stiv","killed":[],"wed":[],"parented":[]},{"name":"wildling.Wallen","killed":[],"wed":[],"parented":[]},{"name":"wildling.Osha","killed":["stark.Maester Luwin","greyjoy.Drennan"],"wed":[],"parented":[]}]

/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(126);
module.exports = __webpack_require__(125);


/***/ })

},[338]);