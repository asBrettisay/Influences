
angular.module('influences')
.directive('forceMain', function(chartService, $state) {
  return {
    restrict: 'E',
    template: "<svg height="+ height + " width=" + width +"></svg>",
    scope: {
      root: '=',
    },
    controller: function($scope, $window) {
      $scope.window = $window;
    },
    link: link
  };


  function link(scope, elem, attrs) {
    var d3 = scope.window.d3;
    var svg = d3.select(elem.find("svg")[0]);




    var data = [], edges = [];
    scope.root.forEach(function(genre) {
      var result = chartService.format(genre, 'subgenres');

      result.nodes.forEach(function(o) {
        data.push(o);
      })

      result.links.forEach(function(o) {
        edges.push(o);
      })
    })


    var force = d3.layout.force()
                .size([width, height])
                .nodes(data)
                .links(edges)
                .linkDistance(width/20)
                .linkStrength(1)
                .gravity(0.2)
                .friction(0.7)
                .charge(-3000)

    force.start();

    var links = svg.selectAll('lines')
                  .data(edges)
                  .enter().append('line')
                  .attr('class', 'link')
                  .attr('x1', function(d) { return d.source.x })
                  .attr('y1', function(d) { return d.source.y })
                  .attr('x2', function(d) { return d.target.x })
                  .attr('y2', function(d) { return d.target.y })

    var nodes = svg.selectAll('nodes')
                   .data(data)
                   .enter().append('circle')
                   .attr('class', 'node')
                   .style('fill', function(d) {
                     return d.color;
                   })
                   .attr('r', function(d) {
                     return d.r || width/80
                   })
                   .attr('cx', function(d) { return d.x })
                   .attr('cy', function(d) { return d.y })
                   .on('click', function(d) {
                     $state.go(d.type + '.show', {id: d.id})
                   })



    var text = svg.selectAll('text')
                .data(data)
                .enter().append('foreignObject')
                .attr('class', 'artist')
                .attr('x', function(d) { return d.x })
                .attr('y', function(d) { return d.y })
                .on('click', function(d) {
                  $state.go(d.type + '.show', {id: d.id })
                })
                .html(function(d) {
                  return '<span class="artist first">' + d.text[0] + '</span> ' + d.text.slice(1);
                });


    force.on('tick', function() {
      nodes
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })

      links
        .attr('x1', function(d) { return d.source.x })
        .attr('x2', function(d) { return d.target.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('y2', function(d) { return d.target.y })

      text
        .attr('x', function(d) { return d.x })
        .attr('y', function(d) { return d.y })
    })

  }
})
