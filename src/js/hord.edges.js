var hord = {

    DATA : {},

    init : function(params) {
        // detect the mode
        var mode = hord.detectMode();
        if (mode === "view") {
            hord.view(params);
        } else if (mode === "edit") {
            hord.edit(params);
        }
    },

    view : function(params) {
        var form_selector = params.source_selector;
        var working_selector = params.working_selector;

        var editUrlTemplate = params.editUrlTemplate;
        var editUrlRegex = params.editUrlRegex;
        var viewUrlTemplate = params.viewUrlTemplate;
        var viewUrlRegex = params.viewUrlRegex;

        var template = '<div class="row">\
            <div class="col-sm-12 col-md-8 col-md-offset-2">\
                <div id="radar-diagrams"></div>\
            </div>\
        </div>';
        $(working_selector).html(template);

        // is there any data for us to pull out of the url bar?
        hord.prePopulateFromURL({selector: form_selector, urlRegex: viewUrlRegex});

        var config = hord.readConfig({form_selector: form_selector});
        hord.DATA.config = config;

        var components = [];
        for (var i = 0; i < config.charts.length; i++) {
            var chart_id = config.charts[i];
            if ($.inArray("view", config.chart_info[chart_id].visibility) > -1) {
                components.push(hord._makeChartComponent({
                    form_selector: form_selector,
                    chart_id: chart_id,
                    config: config,
                    download: true
                }));
            }
        }

        // make the Edge that will handle the viz
        var e = edges.newEdge({
            selector : "#radar-diagrams",
            template: hord.newRadarDiagramsTemplate(),
            components: components
        });
        hord.DATA.edge = e;

        hord.cycle({form_selector: form_selector});
    },

    edit : function(params) {
        var source_selector = params.source_selector;
        var working_selector = params.working_selector;
        
        var editUrlTemplate = params.editUrlTemplate;
        var editUrlRegex = params.editUrlRegex;
        var viewUrlTemplate = params.viewUrlTemplate;
        var viewUrlRegex = params.viewUrlRegex;

        // since we're editing the form, show it
        var form = $(source_selector).html();
        $(source_selector).html("");

        var template = '<div class="row">\
            <div class="col-md-6">\
                <div class="section-navigation"></div>\
                <div id="hord"></div>\
                <div class="section-navigation"></div>\
            </div>\
            <div class="col-md-6">\
                <div id="radar-diagrams"></div>\
            </div>\
        </div>';
        $(working_selector).html(template);

        var form_selector = "#hord";
        $(form_selector, working_selector).html(form);

        hord.newSectionManager({
            form_selector: form_selector,
            scrollSelector: working_selector
        });

        // is there any data for us to pull out of the url bar?
        hord.prePopulateFromURL({selector: form_selector, urlRegex: editUrlRegex});

        var config = hord.readConfig({form_selector: form_selector});
        hord.DATA.config = config;

        var components = [];
        for (var i = 0; i < config.charts.length; i++) {
            var chart_id = config.charts[i];
            if ($.inArray("edit", config.chart_info[chart_id].visibility) > -1) {
                components.push(hord._makeChartComponent({
                    form_selector: form_selector,
                    chart_id: chart_id,
                    config: config
                }));
            }
        }
        components.push(hord.newPersistentLink({
            id: "persistent-link",
            category: "radar",
            sourceChart: "main",
            resource: form_selector,
            editUrlTemplate: editUrlTemplate,
            viewUrlTemplate: viewUrlTemplate
        }));
        
        // make the Edge that will handle the viz
        var e = edges.newEdge({
            selector : "#radar-diagrams",
            template: hord.newRadarDiagramsTemplate(),
            components: components
        });
        hord.DATA.edge = e;

        // bind a readForm to change, and then read the form initially too
        $('[data-hord]', form_selector).on('change', function(event) {
            hord.cycle({form_selector: form_selector, update_date: true});
        });
        hord.cycle({form_selector: form_selector});
    },

    readConfig : function(params) {
        var form_selector = params.form_selector;

        var config = {};
        var element = $("[data-hord=config]", form_selector);
        config.charts = element.attr("data-hord-charts").split(",").map(function(x) { return x.trim() });

        config.chart_info = {};
        for (var i = 0; i < config.charts.length; i++) {
            var chart = config.charts[i];
            config.chart_info[chart] = {};
            var chart_name = element.attr("data-hord-charts-" + chart + "-name");
            if (chart_name) {
                config.chart_info[chart].name = chart_name;
            }
            var chart_size = element.attr("data-hord-charts-" + chart + "-size");
            if (chart_size) {
                config.chart_info[chart].size = parseInt(chart_size);
            }
            var chart_visibility = element.attr("data-hord-charts-" + chart + "-visibility");
            if (chart_visibility) {
                config.chart_info[chart].visibility = chart_visibility.split(",").map(function(x) { return x.trim() });
            }
        }

        return config;
    },

    _makeChartComponent : function(params) {
        var chart_id = params.chart_id;
        var form_selector = params.form_selector;
        var config = params.config;
        var download = edges.getParam(params.download, false);

        var chart_name = edges.getParam(config.chart_info[chart_id].name, chart_id);
        var chart_size = edges.getParam(config.chart_info[chart_id].size, 10);

        return edges.newChart({
            id: chart_id,
            category: "radar",
            dataFunction: hord.dataFunction({chart: chart_id, resource: form_selector}),
            dataSeriesNameMapFunction: hord.dataSeriesNameMap({resource: form_selector, subtitle: chart_name}),
            renderer : edges.chartjs.newRadar({
                download: download,
                downloadName: edges.safeId(chart_name),
                options: {
                    scale: {
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: chart_size,
                            stepSize: 1,
                            suggestedMin: 0,
                            suggestedMax: chart_size,
                            callback: function() {return ""}
                        }
                    },
                    legend: {
                        labels: {
                            fontStyle: 'bold'
                        },
                        onClick : function() {}
                    }
                },
                dataSeriesProperties : {
                    results : {
                        fill:true,
                        backgroundColor:"rgba(87, 153, 199, 0.3)",
                        borderColor:"#5799C7",
                        pointBackgroundColor:"#5799C7",
                        pointBorderColor:"#fff",
                        pointHoverBackgroundColor:"#fff",
                        pointHoverBorderColor:"rgba(220,220,220,1)"
                    }
                }
            })
        })
    },

    detectMode : function() {
        var urlParams = edges.getUrlParams();
        return edges.getParam(urlParams.mode, "edit");
    },

    dataSeriesNameMap : function(params) {
        var resource = params.resource;
        var subtitle = params.subtitle;

        return function(component) {
            if (!component.edge.resources.hasOwnProperty(resource)) {
                return {}
            }

            var title = subtitle;
            var name = component.edge.resources[resource]["title"];
            if (name != "") {
                title += " - " + name;

                if (hord.DATA.date) {
                    var fd = hord.formatDate(hord.DATA.date);
                    title += ", " + fd;
                }
            }

            return {"results" : title};
        }
    },

    formatDate : function(date) {
        var day = date.getUTCDate();
        var month = date.getUTCMonth();
        var year = date.getUTCFullYear();

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return day + " " + months[month] + " " + year;
    },

    prePopulateFromURL : function(params) {
        var form_selector = params.selector;
        var urlRegex = params.urlRegex;

        var rxres = urlRegex.exec(window.location.href);
        if (rxres === null) {
            return;
        }

        var parts = atob(rxres[1]).split("|");
        if (parts.length !== 2) {
            return;
        }
        var metadata = parts[0].split(",");
        if (metadata.length !== 2) {
            return;
        }
        $('input[data-hord=title]').val(metadata[0]);
        hord.DATA.date = new Date(parseInt(metadata[1]));

        if (parts[1] !== "") {
            var idents = parts[1].split(",");
            for (var i = 0; i < idents.length; i++) {
                var ident = idents[i];
                var selector = 'input[name=' + ident + ']';
                $(selector, form_selector).prop("checked", true);
            }
        }
    },

    cycle: function(params) {
        var update_date = edges.getParam(params.update_date, false);

        hord.readForm({selector: params.form_selector});
        if (!hord.DATA.date || update_date === true) {
            hord.DATA.date = new Date();
        }

        hord.DATA.edge.cycle();
    },

    newRadarDiagramsTemplate : function(params) {
        return edges.instantiate(hord.RadarDiagramsTemplate, params, edges.newTemplate);
    },
    RadarDiagramsTemplate : function(params) {
        this.namespace = "hord-radar-diagrams";
        
        this.draw = function(edge) {
            this.edge = edge;

            var containerClass = edges.css_classes(this.namespace, "container");
            var sectionClass = edges.css_classes(this.namespace, "section");

            var frag = '<div class="' + containerClass + '">';
            var radars = edge.category("radar");
            for (var i = 0; i < radars.length; i++) {
                frag += '<div class="' + sectionClass + '">\
                    <div class="row"><div class="col-md-12"><div id="' + radars[i].id + '"></div></div></div>\
                </div>'
            }

            edge.context.html(frag);
        }
    },

    newPersistentLink : function(params) {
        return edges.instantiate(hord.PersistentLink, params, edges.newComponent);
    },
    PersistentLink: function(params) {
        this.sourceChart = params.sourceChart;
        this.resource = params.resource;
        this.editUrlTemplate = params.editUrlTemplate;
        this.viewUrlTemplate = params.viewUrlTemplate;
        this.renderer = hord.newPersistentLinkRenderer();

        this.summary = "";

        this.synchronise = function() {
            this.summary = "";
            if (!this.edge.resources.hasOwnProperty(this.resource)) {
                return;
            }

            var name = this.edge.resources[this.resource]["title"];
            var date = "";
            if (name) {
                date = hord.DATA.date.getTime();
            }
            this.summary += name + "," + date + "|";

            var answers = "";
            var data = this.edge.resources[this.resource]["charts"][this.sourceChart];
            for (var axis in data) {
                if (data[axis].selected_values.length > 0) {
                    if (answers.length != 0) {
                        answers += ","
                    }
                    answers += data[axis].selected_values.join(",");
                }
            }
            this.summary += answers;
        };
    },

    newPersistentLinkRenderer : function(params) {
        return edges.instantiate(hord.PersistentLinkRenderer, params, edges.newRenderer);
    },
    PersistentLinkRenderer : function(params) {
        this.namespace = "hord-persistent-link";
        this.draw = function() {
            var s = btoa(this.component.summary);
            var editUrl = this.component.editUrlTemplate.replace("{summary}", s);
            var viewUrl = this.component.viewUrlTemplate.replace("{summary}", s);

            var frag = "<p>To return to this form and make changes, bookmark the following URL: ";
            frag += '<span style="word-wrap: break-word"><a href="' + editUrl + '">' + editUrl + "</a></span></p>";
            frag += "<br><br>";
            frag += '<p>To view or share the diagrams, bookmark the following URL: ';
            frag += '<span style="word-wrap: break-word"><a href="' + viewUrl + '">' + viewUrl + "</a></span></p>";
            this.component.context.html(frag);

            if (window.history.replaceState) {
                window.history.replaceState({}, null, editUrl);
            }
        }
    },

    dataFunction : function(params) {
        var resource = params.resource;
        var chart = params.chart;

        return function(component) {
            if (!component.edge.resources.hasOwnProperty(resource)) {
                return [];
            }
            var data = component.edge.resources[resource]["charts"][chart];
            var values = [];

            // to be sure that the axes are always consistently ordered, take them from the list of axes
            for (var i = 0; i < hord.DATA.axes.length; i++) {
                var axis = hord.DATA.axes[i].id;
                if (data.hasOwnProperty(axis)) {
                    var name = data[axis]["name"];
                    var val = data[axis]["length"];
                    values.push({label: name, value: val});
                }
            }
            return [{key: "results", values: values}];
        }
    },

    readForm : function(params) {
        var selector = params.selector;
        var elements = $('[data-hord]', selector);

        // First, read all of the data out of the form
        var axes = [];
        var values = [];
        var title = "";
        for (var i = 0; i < elements.length; i++) {
            var el = $(elements[i]);
            var type = el.attr("data-hord");

            if (type === "axis") {
                var axis = hord._readAxisConfig(el);
                axes.push(axis);
            } else if (type === "value") {
                var value = hord._readValueConfig(el);
                values.push(value);
            } else if (type === "title") {
                title = el.val();
            }
        }

        var charts = hord._listCharts({axes: axes});

        var data = {};
        data["title"] = title;
        data["charts"] = {};
        for (var i = 0; i < charts.length; i++) {
            var chart = charts[i];
            data["charts"][chart] = {};
            var chartAxes = hord._listChartAxes({chart: chart, axes: axes});
            for (var j = 0; j < chartAxes.length; j++) {
                var chartAxis = chartAxes[j];
                var lengthData = hord._getLength({chart: chart, axisid: chartAxis.id, values: values});
                data["charts"][chart][chartAxis.id] = {
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
            weight = 1.0;
        } else {
            weight = parseFloat(weight);
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
                chart_weight = parseFloat(chart_weight);
            }
            weights[charts[i]] = chart_weight;
        }

        return {axisid : axisid, name : name, checked: checked, weights: weights};
    },

    newSectionManager : function(params) {
        return edges.instantiate(hord.SectionManager, params);
    },
    SectionManager : function(params) {
        this.form_selector = params.form_selector;
        this.scrollSelector = params.scrollSelector;

        this.context = false;
        this.currentSection = 0;
        this.maxSection = 0;
        this.sections = false;

        this.namespace = "section-manager";

        this.init = function() {
            this.context = $(this.form_selector);
            this._drawNavigation();
            this.sections = this.context.find("section");
            this.maxSection = this.sections.length;
            this._activateSection({section: 0});
        };

        this._activateSection = function(params) {
            var active = params.section;

            for (var i = 0; i < this.sections.length; i++) {
                var section = $(this.sections[i]);
                section.attr("data-section", String(i));
                section.hide();
                if (i === active) {
                    section.show();
                }
            }

            this.currentSection = active;

            this._setPrevNext();
        };

        this._drawNavigation = function() {
            var prevClasses = edges.css_classes(this.namespace, "prev");
            var nextClasses = edges.css_classes(this.namespace, "next");

            var frag = '<span class="' + prevClasses + '"></span>';
            frag += '<span class="' + nextClasses + '"></span>';

            var nav = $(".section-navigation").html(frag);
        };

        this._setPrevNext = function() {
            var prev = this.currentSection - 1;
            var next = this.currentSection + 1;

            if (prev < 0) {
                prev = false;
            }
            if (next >= this.maxSection) {
                next = false;
            }

            var prevSelector = edges.css_class_selector(this.namespace, "prev");
            var nextSelector = edges.css_class_selector(this.namespace, "next");

            if (prev === false) {
                var disabledClasses = edges.css_classes(this.namespace, "disabled");
                var frag = '<span class="' + disabledClasses + ' btn btn-default" disabled>&laquo; previous section</span>';
                $(prevSelector).html(frag);
            } else {
                var prevLink = edges.css_classes(this.namespace, "prev-link");
                var frag = '<a href="#" class="' + prevLink + ' btn btn-info" data-target="' + String(prev) + '">&laquo; previous section</a>';
                $(prevSelector).html(frag);

                var prevLinkSelector = edges.css_class_selector(this.namespace, "prev-link");
                edges.on(prevLinkSelector, "click", this, "linkClicked");
            }

            if (next === false) {
                var disabledClasses = edges.css_classes(this.namespace, "disabled");
                var frag = '<span class="' + disabledClasses + ' btn btn-default" disabled>next section &raquo;</span>';
                $(nextSelector).html(frag);
            } else {
                var nextLink = edges.css_classes(this.namespace, "next-link");
                var frag = '<a href="#" class="' + nextLink + ' btn btn-info" data-target="' + String(next) + '">next section &raquo;</a>';
                $(nextSelector).html(frag);

                var nextLinkSelector = edges.css_class_selector(this.namespace, "next-link");
                edges.on(nextLinkSelector, "click", this, "linkClicked");
            }
        };

        this.linkClicked = function(element) {
            var target = $(element).attr("data-target");
            this._activateSection({section: parseInt(target)});
            this.doScroll();
        };

        this.doScroll = function () {
            var offset = $(this.scrollSelector).offset().top;
            var currentScroll = $("html,body").scrollTop();
            if (currentScroll > offset) {
                $("html,body").animate({
                    scrollTop: $(this.scrollSelector).offset().top
                }, 500);
            }
        };

        // finally, init the section manager
        this.init();
    }
};