function init() {
	var w = 600;
	var h = 300;
	var dataset;
	var padding = 60;

	d3.csv("../Source/unemployement.csv", function (d) {
		return {
			date: new Date(+d.year, +d.month - 1),
			number: +d.number,
		};
	}).then(function (data) {
		dataset = data;

		console.table(dataset, ["date", "number"]);

		xScale = d3
			.scaleTime()
			.domain([
				d3.min(dataset, function (d) {
					return d.date;
				}),
				d3.max(dataset, function (d) {
					return d.date;
				}),
			])
			.range([60, w]);

		yScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(dataset, function (d) {
					return d.number;
				}),
			])
			.range([h - 60, 0]);

		area = d3
			.area()
			.x(function (d) {
				return xScale(d.date);
			})
			.y0(function () {
				return yScale.range()[0];
			})
			.y1(function (d) {
				return yScale(d.number);
			});

		var svg = d3
			.select("#charts")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		svg.append("path")
			.datum(dataset)
			.attr("class", "area")
			.attr("d", area)
			.style("stroke", "black")
			.style("stroke-width", "0.5")
			.style("fill", "grey");

		svg.append("line")
			.attr("class", "line halfMilLabel")
			.attr("x1", padding)
			.attr("y1", yScale(500000))
			.attr("x2", w)
			.attr("y2", yScale(500000))
			.style("stroke", "red")
			.style("stroke-dasharray", "5,5");

		svg.append("text")
			.attr("class", "halfMilLabel")
			.attr("x", padding + 10)
			.attr("y", yScale(500000) - 7)
			.text("Half a million unemployed")
			.style("fill", "red");

		var xAxis = d3.axisBottom().ticks(8).scale(xScale);

		var yAxis = d3.axisLeft().ticks(10).scale(yScale);

		svg.append("g")
			.attr("transform", "translate(0, " + (h - padding) + ")")
			.call(xAxis);

		svg.append("g")
			.attr("transform", "translate(" + padding + ")")
			.attr("transform", "translate(" + padding + ")")
			.call(yAxis);
	});
}

window.onload = init;
