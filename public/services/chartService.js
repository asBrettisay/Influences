var width = 1200, height = 800;

angular.module('influences')
.service('chartService', function($http, $state) {

  this.format = function(root, mode) {
    var data = [], edges = [];

    data.push({
      text: root.name || root.fullName,
      root: true,
      type: root.type,
      id: root.id
    })



    var next = mode ? root[mode] : root.founders;

    if (next) {
      next.forEach(function(node) {
        var o = {
          text: node.name || node.fullName,
          id: node.id,
          type: node.type
        }
        data.push(o)

        edges.push({
          source: o,
          target: nodes[0]
        })

        var next = node.proteges || node.subgenres;
        if (next) sortNext(next, o);
      });


    }

    return {
      nodes: data,
      links: edges
    }
  }

  function sortNext(nodes, target) {
    var o;

    nodes.forEach(function(node) {
      o = {
        name: node.fullName || node.name,
        next: node.subgenres || node.proteges,
        id: node.id,
        type: node.type
      };

      if (node.next) sortNext(node, o)

      data.push(o);

      edges.push({
        source: o,
        target: target
      })
    })
  }

  this.initForce = function(data, edges) {
    data = data || [];
    edges = edges || [];
    var force = d3.layout.force()
                .size([width, height])
                .nodes(data)
                .links(edges)
                .linkDistance(width/20)
                .linkStrength(1)
                .gravity(0.2)
                .friction(0.7)
                .charge(-3000)

    var links = this.selectAll('lines')
                .data(edges)
                .enter().append('line')
                .attr('class', 'link')
                .attr('x1', function(d) { return d.source.x })
                .attr('y1', function(d) { return d.source.y })
                .attr('x2', function(d) { return d.target.x })
                .attr('y2', function(d) { return d.target.y })

    var nodes = this.selectAll('nodes')
                .data(data)
                .enter().append('circle')
                .attr('class', 'node')
                .attr('r', width/100)
                .attr('cx', function(d) { return d.x })
                .attr('cy', function(d) { return d.y })
                .on('click', function(d) {
                  $state.go(d.type + '.show', {id: d.id})
                })


    return {
      force: force,
      links: links,
      nodes: nodes
    }
  };

  this.updateTick = function(nodes, links) {

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

    // text
    //   // .transition().ease("linear").duration(animationStep)
    //   .attr('x', function(d) { return d.x })
    //   .attr('y', function(d) { return d.y })
  }


})
