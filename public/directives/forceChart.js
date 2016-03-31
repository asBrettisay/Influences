
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
        x: width/3,
        y: height/3
      }

      var nodeData = [], edges = [];


      scope.$watch('root', function() {
        initRoot();
      });

      function initRoot() {

        if (scope.root.founders) {
          scope.root.proteges = scope.root.founders;
        }

        nodeData.push({
          name: (scope.root.fullName || scope.root.name),
          x: center.x,
          y: center.y,
          fixed: true,
          root: true,
          type: scope.root.type,
          id: scope.root.id
        })

        if (scope.root.proteges) {

          scope.root.proteges.forEach(function(person) {
            var o = {
              name: person.fullName,
              x: center.x,
              y: center.y,
              id: person.id,
              type: person.type
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
        }

        initForce();
      }



      function sortProteges(mentor, target) {
        // Add proteges to the nodes array.
        var o;

        mentor.proteges.forEach(function(person) {
          o = {
            name: person.fullName,
            x: center.x,
            y: center.y,
            proteges: person.proteges,
            id: person.id,
            type: person.type
          };

          if (person.proteges) { sortProteges(person, o) }


          nodeData.push(o);
          edges.push({
            source: o,
            target: target,
            d: width/50,
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
                        return link.d ? link.d : width/20;
                      })
                      .linkStrength(1)
                      .gravity(0.2)
                      .friction(0.7)
                      // .call(force.drag)
                      .charge(-3000)


      force.start();

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
                      //  .call(force.drag)
                       .enter().append('circle')
                       .attr('class', 'node')
                       .attr('r', width/80)
                       .attr('cx', function(d) { return center.x })
                       .attr('cy', function(d) { return center.y })
                       .on('click', function(d) {
                         console.log('Clicked', d);
                         $state.go(d.type + '.show', {id: d.id})
                       })


        var text = svg.selectAll('text')
                    .data(nodeData)
                    .enter().append('text')
                    .attr('class', 'artist')
                    .attr('x', function(d) { return center.x })
                    .attr('y', function(d) { return center.y })
                    .on('click', function(d) {
                      $state.go(d.type + '.show', {id: d.id})
                    })
                    .text(function(d) {
                      return d.name[0] + ' ' + d.name.slice(1) ;
                    })

        var animationStep = 800;
        // Update nodes, links, texts
        force.on('tick', function() {

          nodes
            // .transition().ease("linear").duration(animationStep)
            .attr('cx', function(d) { return d.x })
            .attr('cy', function(d) { return d.y })

          links
            // .transition().ease("linear").duration(animationStep)
            .attr('x1', function(d) { return d.source.x })
            .attr('x2', function(d) { return d.target.x })
            .attr('y1', function(d) { return d.source.y })
            .attr('y2', function(d) { return d.target.y })

          text
            // .transition().ease("linear").duration(animationStep)
            .attr('x', function(d) { return d.x })
            .attr('y', function(d) { return d.y })
        })

      }
    }
  }
});
