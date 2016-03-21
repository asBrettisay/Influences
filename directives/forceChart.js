angular.module('influences')
.directive('forceChart', function() {
  return {
    restrict: 'AE',
    template: "<svg height=500 width=960></svg>",
    scope: {
      genre: '=',
    },
    controller: function($scope, $window) {
      $scope.window = $window;
    },
    link: link
  }
});


function link(scope, elem, attrs) {
  var d3 = scope.window.d3, width = 960, height = 500;
  var svg = d3.select(elem.find("svg")[0]);

  var nodeData = [], edges = [];

  nodeData.push({
    name: scope.genre.name,
    x: width/2,
    y: height/2,
    fixed: true,
    genre: true
  })

  scope.genre.founders.forEach(function(person) {
    var o = {
      name: person.name,
      weight: 1,
      genre: true,
    };

    nodeData.push(o)

    edges.push({
      source: o,
      target: nodeData[0]
    })
  });

  var force = d3.layout.force()
                .size([width, height])
                .nodes(nodeData)
                .links(edges)
                .linkDistance(function(link) {
                  return height/nodeData.length;
                })
                .linkStrength(0.1)
                .gravity(0)
                .friction(0.5)
                .charge(function(node) {
                  if (node.genre) { return -30 };
                  return -3000;
                })
                .start();


  var links = svg.selectAll('lines')
                .data(edges)
                .enter().append('line')
                .attr('class', 'link')
                .attr('x1', function(d) { return d.source.x })
                .attr('y1', function(d) { return d.source.y })
                .attr('x2', function(d) { return d.target.x })
                .attr('y2', function(d) { return d.target.y })

  var nodes = svg.selectAll('nodes')
                 .data(nodeData)
                 .enter().append('circle')
                 .attr('class', 'node')
                 .attr('r', width/75)
                 .attr('cx', function(d) { return d.x })
                 .attr('cy', function(d) { return d.y })

  var text = svg.selectAll('text')
              .data(nodeData)
              .enter().append('text')
              .attr('class', 'artist')
              .attr('x', function(d) { return d.x })
              .attr('y', function(d) { return d.y })
              .text(function(d) { return d.name })

  force.on('tick', function() {
    nodes
      // .transition().ease("linear").duration(800)
      .attr('cx', function(d) { return d.x })
      .attr('cy', function(d) { return d.y })

    links
      // .transition().ease("linear").duration(800)
      .attr('x1', function(d) { return d.source.x })
      .attr('x2', function(d) { return d.target.x })
      .attr('y1', function(d) { return d.source.y })
      .attr('y2', function(d) { return d.target.y })

    text
      .attr('x', function(d) { return d.x })
      .attr('y', function(d) { return d.y })
  })

  function addArtist() {

  }





}
