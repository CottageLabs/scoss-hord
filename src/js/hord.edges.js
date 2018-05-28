var hord = {

    DATA : {},

    init : function(params) {
        var form_selector = params.form_selector;
        var diagrams_selector = params.diagrams_selector;

        // make the Edge that will handle the viz
        var e = edges.newEdge({
            selector : diagrams_selector
        });
        hord.DATA.edge = e;

        // bind a readForm to change, and then read the form initially too
        $('[data-hord]', form_selector).on('change', function(event) {
            hord.readForm({selector: form_selector})
        });
        hord.readForm({selector: form_selector});
    },

    readForm : function(params) {
        var selector = params.selector;
        var elements = $('[data-hord]', selector);

        // First, read all of the data out of the form
        var axes = [];
        var values = [];
        for (var i = 0; i < elements.length; i++) {
            var el = $(elements[i]);
            var type = el.attr("data-hord");

            if (type === "axis") {
                var axis = hord._readAxisConfig(el);
                axes.push(axis);
            } else if (type === "value") {
                var value = hord._readValueConfig(el);
                values.push(value);
            }
        }

        var charts = hord._listCharts({axes: axes});

        var data = {};
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            data[chart] = {};
            var chartAxes = hord._listChartAxes({chart: chart, axes: axes});
            for (var j = 0; j < chartAxes.length; j++) {
                var chartAxis = chartAxes[j];
                var lengthData = hord._getLength({chart: chart, axisid: chartAxis.id, values: values})
                data[chart][chartAxis.id] = {
                    name: chartAxis.name,
                    length: lengthData.length,
                    selected_values: lengthData.selected
                };
            }
        }

        hord.DATA.edge.resources[selector] = data;

        hord.DATA.axes = axes;
        hord.DATA.values = values;
        hord.DATA.charts = charts;
        hord.DATA.data = data;
    },

    _getLength : function(params) {
        var chart = params.chart;
        var axisid = params.axisid;
        var values = params.values;

        var length = 0;
        var selected = [];

        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            if (value.axisid === axisid && value.checked === true) {
                if (chart in value.weights) {
                    length += value.weights[chart];
                    selected.push(value.name);
                }
            }
        }

        return {length: length, selected: selected};
    },

    _listChartAxes : function(params) {
        var chart = params.chart;
        var axes = params.axes;

        var chartAxes = [];
        for (var i = 0; i < axes.length; i++) {
            var axis = axes[i];
            if ($.inArray(chart, axis.charts) > -1) {
                chartAxes.push(axis);
            }
        }

        return chartAxes;
    },

    _listCharts : function(params) {
        var axes = params.axes;

        var charts = new Set();
        for (var i = 0; i < axes.length; i++) {
            var axis = axes[i];
            for (var j = 0; j < axis.charts.length; j++) {
                var chart = axis.charts[j];
                charts.add(chart);
            }
        }

        return Array.from(charts);
    },

    _readAxisConfig : function(el) {
        var axisid = el.attr("data-hord-axisid");
        var charts = el.attr("data-hord-charts");
        var name = el.attr("data-hord-name");

        if (charts) {
            charts = charts.split(",").map(function(x) { return x.trim() })
        } else {
            charts = [];
        }

        if (!name) {
            name = el.text();
        }

        return {id: axisid, charts: charts, name: name}
    },

    _readValueConfig : function(el) {
        var axisid = el.attr("data-hord-axisid");
        var weight = el.attr("data-hord-weight");
        var charts = el.attr("data-hord-charts");
        var name = el.attr("name");
        var checked = el.is(":checked");

        if (!weight) {
            weight = 1;
        } else {
            weight = parseInt(weight);
        }

        if (charts) {
            charts = charts.split(",").map(function(x) { return x.trim() })
        } else {
            charts = [];
        }

        var weights = {};
        for (var i = 0; i < charts.length; i++) {
            var chart_weight = el.attr("data-hord-weight-" + charts[i]);
            if (!chart_weight) {
                chart_weight = weight;
            } else {
                chart_weight = parseInt(chart_weight);
            }
            weights[charts[i]] = chart_weight;
        }

        return {axisid : axisid, name : name, checked: checked, weights: weights};
    }
};