// **** Your JavaScript code goes here ****
d3.csv('./data/coffee_data.csv', function(error, dataset) {
  //settign margins and width
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 760 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // aggrating the data set for region and coffee sales
  var dataRegion = d3.nest()
    .key(function(d) {
      return d.region;
    })
    .rollup(function(d) {
      return d3.sum(d, function(g) {
        return g.sales;
      });
    }).entries(dataset);

  // aggrating the data set for category and coffee sales
  var dataCoffee = d3.nest()
    .key(function(d) {
      return d.category;
    })
    .rollup(function(d) {
      return d3.sum(d, function(g) {
        return g.sales;
      });
    }).entries(dataset);
  var concatArrays = dataCoffee.concat(dataRegion);
  concatArrays.forEach(function(d) {
    d.value = parseInt(d.value);
  });
  var max = d3.max(concatArrays, function(d) {
    return d.value
  });


  // set the ranges
  var xRegion = d3.scaleBand()
    .domain(['Central', 'East', 'South', 'West'])
    .rangeRound([00, width / 2])
    .padding(0.4);

  var yRegion = d3.scaleLinear()
    .rangeRound([0, height]);

  yRegion.domain([max, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").select("div").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "xScale")
    .call(d3.axisBottom(xRegion));

  // add the y Axis
  svg.append("g")
    .attr("transform", "translate(" + margin.right + ",0)")
    .call(d3.axisLeft(yRegion).ticks(6).tickFormat(d3.formatPrefix(".0", 5000)))

  svg.selectAll(".bar")
    .data(dataRegion)
    .enter().append("rect")
    .attr("class", function(d) {
      return "bar" + (d.key).replace(/\s/g, '')
    })
    .attr("x", function(d) {
      return xRegion(d.key);
    })
    .attr("width", xRegion.bandwidth())
    .attr("y", function(d) {
      return yRegion(d.value);
    })
    .attr("height", function(d) {
      return height - yRegion(d.value)
    });

  //coffee vs sales histogram

  var xCoffee = d3.scaleBand()
    .domain(['Coffee', 'Tea', 'Espresso', 'Herbal Tea'])
    .rangeRound([00, width / 2])
    .padding(0.4);

  var yCoffee = d3.scaleLinear()
    .rangeRound([0, height]);

  yCoffee.domain([max, 0]);


  var svg2 = d3.select("body").select("div").select("svg")
    .attr("width", width + margin.left + margin.right + margin.top + margin.bottom)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + (width / 2 + margin.left + margin.right) + "," + margin.top + ")");

  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "xScale")
    .call(d3.axisBottom(xCoffee));

  // add the y Axis
  svg2.append("g")
    .attr("transform", "translate(" + margin.right + ",0)")
    .call(d3.axisLeft(yCoffee).ticks(7).tickFormat(d3.formatPrefix(".0", 5000)))

  svg2.selectAll(".bar")
    .data(dataCoffee)
    .enter().append("rect")
    .attr("class", function(d) {
      return "bar" + (d.key).replace(/\s/g, '');
    })
    .attr("x", function(d) {
      return xCoffee(d.key);
    })
    .attr("width", xCoffee.bandwidth())
    .attr("y", function(d) {
      return yCoffee(d.value);
    })
    .attr("height", function(d) {
      return height - yCoffee(d.value)
    });

  //title for region vs sales
  svg.append("text")
    .attr("x", (width / 4))
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Coffee Sales By Region(USD)");

  //title for category vs sales
  svg2.append("text")
    .attr("x", (width / 5 + margin.left))
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Coffee Sales By Product(USD)");

  //x and y axis for region vs sales

  svg.append("text") // text label for the x axis
    .attr("x", width / 4)
    .attr("y", height + 25)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Region");


  svg.append("text") // text label for the y axis
    .attr("x", margin.left)
    .attr("y",width/4 + margin.left + margin.right)
    .attr("transform", "rotate(-90 " + margin.left / 2 + " " + height / 2 + ")")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Coffee Sales (USD)");


  //x and y axis for category vs sales
  svg2.append("text") // text label for the x axis
    .attr("x", width / 4)
    .attr("y", height + 25)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Product");

  




});
