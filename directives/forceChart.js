var width = 1200, height = 800;

angular.module('influences')
.directive('forceChart', function($compile, $state) {
  return {
    restrict: 'AE',
    template: "<svg height="+ height + " width=" + width +"></svg>",
    scope: {
      root: '=',
    },
    controller: function($scope, $window) {
      $scope.window = $window;
    },

    link: function (scope, elem, attrs) {
      var d3 = scope.window.d3;
      var svg = d3.select(elem.find("svg")[0]);
      var center = {
        x: width/2,
        y: height/3
      }

      var nodeData = [], edges = [];


      scope.$watch('root', function() {
        initRoot();
      });

      function selectNode(d) {
        console.log(d);
        console.log(nodeData);
        nodeData.forEach(function(node) {
          if (node.name === d.name) {
            scope.root = node;
            console.log('New root is', scope.root);
          }
        })
        scope.$digest();
      }

      function initRoot() {
        nodeData.push({
          name: scope.root.name,
          x: center.x,
          y: center.y,
          fixed: true,
          root: true
        })

        scope.root.proteges.forEach(function(person) {
          if (!person.type) {
            console.log(person.type);
          }
          var o = {
            name: person.name,
            x: center.x,
            y: center.y,
            type: person.type,
            id: person.id
          };

          nodeData.push(o)
          edges.push({
            source: o,
            target: nodeData[0]
          })

          if (person.proteges) {
            sortProteges(person, o)
          }
        });
        initForce();
      }



      function sortProteges(mentor, target) {
        // Add proteges to the nodes array.
        var o;

        mentor.proteges.forEach(function(person) {
          o = {
            name: person.name,
            x: center.x,
            y: center.y,
            proteges: person.proteges,
            type: person.type,
            id: person.id
          };

          if (person.proteges) { sortProteges(person, o) }


          nodeData.push(o);
          edges.push({
            source: o,
            target: target,
            d: width/20,
            proteges: person.proteges
          })
        })
      }

      function initForce() {
      //Init the force graph.
      var force = d3.layout.force()
                      .size([width, height])
                      .nodes(nodeData)
                      .links(edges)
                      .linkDistance(function(link) {
                        return link.d ? link.d : width/10;
                      })
                      .linkStrength(1)
                      .gravity(0)
                      .friction(0.9)
                      .charge(-1000)
                      .start();

        // Initialize links, nodes, and texts.
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
                       .attr('r', width/100)
                       .attr('cx', function(d) { return center.x })
                       .attr('cy', function(d) { return center.y })
                       .on('click', function(d) {
                         $state.go('artist', {id: d.id})
                       })


        var text = svg.selectAll('text')
                    .data(nodeData)
                    .enter().append('text')
                    .attr('class', 'artist')
                    .attr('x', function(d) { return center.x })
                    .attr('y', function(d) { return center.y })
                    .text(function(d) { return d.name })


        // Update nodes, links, texts
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

      }
    }
  }
});
