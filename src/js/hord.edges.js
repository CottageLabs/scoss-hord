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
            <div class="col-sm-12 col-md-6 col-md-offset-3">\
                <div id="radar-diagrams"></div>\
            </div>\
        </div>';
        $(working_selector).html(template);

        // is there any data for us to pull out of the url bar?
        hord.prePopulateFromURL({selector: form_selector, urlRegex: viewUrlRegex});

        var urlParams = edges.getUrlParams();
        var selectedChart = edges.getParam(urlParams.chart, "main");

        var config = hord.readConfig({form_selector: form_selector});
        hord.DATA.config = config;

        var components = [];
        for (var i = 0; i < config.charts.length; i++) {
            var chart_id = config.charts[i];
            if (chart_id !== selectedChart) {
                continue;
            }
            if ($.inArray("view", config.chart_info[chart_id].visibility) > -1) {
                components.push(hord._makeChartComponent({
                    form_selector: form_selector,
                    chart_id: chart_id,
                    title: config.chart_info[chart_id].name,
                    description: config.chart_info[chart_id].description,
                    figureLabel: "Developed by SPARC Europe in collaboration with DCC",
                    anchor: chart_id,
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

        var scrollOffset = edges.getParam(params.scrollOffset, 0);

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
            scrollSelector: working_selector,
            scrollOffset: scrollOffset
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
            viewUrlTemplate: viewUrlTemplate,
            listBookmarks: true,
            manageUrl: true
        }));
        
        // make the Edge that will handle the viz
        var e = edges.newEdge({
            selector : "#radar-diagrams",
            template: hord.newRadarDiagramsTemplate(),
            components: components
        });
        hord.DATA.edge = e;

        var element = $("[data-hord=urls]");
        var urlsId = element.attr("id");
        element.html('<div id="persistent-link-in-form"></div>');

        var finalComponents = [
            hord.newPersistentLink({
                id: "persistent-link-in-form",
                sourceChart: "main",
                resource: form_selector,
                editUrlTemplate: editUrlTemplate,
                viewUrlTemplate: viewUrlTemplate,
                listCharts: true,
                listBookmarks: false,
                manageUrl: false
            })
        ];
        /*
        for (var i = 0; i < config.charts.length; i++) {
            var chart_id = config.charts[i];
            if ($.inArray("finish", config.chart_info[chart_id].visibility) > -1) {
                finalComponents.push(hord._makeChartComponent({
                    namespace: "finish_page_",
                    form_selector: form_selector,
                    chart_id: chart_id,
                    config: config,
                    titleCallback: function() {
                        return config.chart_info[chart_id].name
                    },
                    description: config.chart_info[chart_id].description,
                    pointLabels: false
                }));
            }
        }*/
        var e2 = edges.newEdge({
            selector: "#" + urlsId,
            // template: hord.newFinishPageTemplate(),
            components: finalComponents
        });
        hord.DATA.urls_edge = e2;

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
            var chart_description = element.attr("data-hord-charts-" + chart + "-description");
            if (chart_description) {
                config.chart_info[chart].description = chart_description;
            }
        }

        return config;
    },

    _makeChartComponent : function(params) {
        var namespace = edges.getParam(params.namespace, "");
        var chart_id = params.chart_id;
        var form_selector = params.form_selector;
        var config = params.config;
        var download = edges.getParam(params.download, false);
        var title = edges.getParam(params.title, false);
        var desc = edges.getParam(params.description, false);
        var anchor = edges.getParam(params.anchor, false);
        var figureLabel = edges.getParam(params.figureLabel, false);
        var pointLabels = edges.getParam(params.pointLabels, true);

        var chart_name = edges.getParam(config.chart_info[chart_id].name, chart_id);
        var chart_size = edges.getParam(config.chart_info[chart_id].size, 10);

        return edges.newChart({
            id: namespace + chart_id,
            category: "radar",
            dataFunction: hord.dataFunction({chart: chart_id, resource: form_selector}),
            dataSeriesNameMapFunction: hord.dataSeriesNameMap({resource: form_selector, subtitle: chart_name}),
            renderer : edges.chartjs.newRadar({
                title: title,
                description: desc,
                anchor: anchor,
                figureLabel: figureLabel,
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
                            callback: function() {return ""},
                            backdropColor: "rgba(0, 0, 0, 0)"
                        },
                        pointLabels : {
                            display: pointLabels
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
                        borderWidth: 4,
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
                var ident_parts = ident.split("#");
                var selector = 'input[name=' + ident_parts[0] + ']';
                if (ident_parts.length == 2) {
                    selector += "[value=" + ident_parts[1] + "]";
                }
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
        if (hord.DATA.hasOwnProperty("urls_edge")) {
            hord.DATA.urls_edge.cycle();
        }
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

    /*
    newFinishPageTemplate : function(params) {
        return edges.instantiate(hord.FinishPageTemplate, params, edges.newTemplate);
    },
    FinishPageTemplate : function(params) {
        this.namespace = "hord-finish-page";

        this.draw = function(edge) {
            this.edge = edge;

            var containerClass = edges.css_classes(this.namespace, "container");
            var sectionClass = edges.css_classes(this.namespace, "section");

            var frag = '<div class="' + containerClass + '">';
            frag += '<p>The following charts are available for you:</p>';
            var radars = edge.category("radar");
            for (var i = 0; i < radars.length; i++) {
                frag += '<div class="' + sectionClass + '">\
                    <div class="row"><div class="col-md-8"><div id="' + radars[i].id + '"></div></div></div>\
                </div>'
            }

            edge.context.html(frag);
        }
    },*/

    newPersistentLink : function(params) {
        return edges.instantiate(hord.PersistentLink, params, edges.newComponent);
    },
    PersistentLink: function(params) {
        this.sourceChart = params.sourceChart;
        this.resource = params.resource;
        this.editUrlTemplate = params.editUrlTemplate;
        this.viewUrlTemplate = params.viewUrlTemplate;
        this.manageUrl = params.manageUrl;
        this.listCharts = edges.getParam(params.listCharts, false);
        this.listBookmarks = edges.getParam(params.listBookmarks, false);

        this.renderer = hord.newPersistentLinkRenderer({
            manageUrl: this.manageUrl
        });

        this.summary = "";

        this.chartInfo = [];

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

            this.chartInfo = [];
            if (this.listCharts) {
                for (var i = 0; i < hord.DATA.config.charts.length; i++) {
                    var chart_id = hord.DATA.config.charts[i];
                    var info = hord.DATA.config.chart_info[chart_id];
                    this.chartInfo.push({id: chart_id, title: info.name, description: info.description});
                }
            }
        };
    },

    newPersistentLinkRenderer : function(params) {
        return edges.instantiate(hord.PersistentLinkRenderer, params, edges.newRenderer);
    },
    PersistentLinkRenderer : function(params) {
        this.manageUrl = params.manageUrl;
        this.namespace = "hord-persistent-link";
        this.draw = function() {
            var s = btoa(this.component.summary);
            var editUrl = this.component.editUrlTemplate.replace("{summary}", s);
            var viewUrl = this.component.viewUrlTemplate.replace("{summary}", s);

            var frag = "";
            if (this.component.listBookmarks) {
                frag = '<p>To return to this form and make changes you can <a href="' + editUrl + '">bookmark this page</a>';
                // frag += '<p>To view or share the diagrams, <a href="' + viewUrl + '">click here</a> and bookmark the page';
            }

            if (this.component.listCharts) {
                frag += '<p>The following charts are available for you:</p>';
                for (var i = 0; i < this.component.chartInfo.length; i++) {
                    var info = this.component.chartInfo[i];
                    var chartUrl = viewUrl.replace("{chart}", info.id);
                    // viewUrl + "#" + edges.safeId(info.id);
                    frag += '<p><strong><a href="' + chartUrl + '">' + info.title + '</a></strong> - ' + info.description + '<br></p>';
                }
            }

            this.component.context.html(frag);

            if (this.manageUrl && window.history.replaceState) {
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

        hord.DATA.axes = axes;
        hord.DATA.values = values;
        hord.DATA.charts = charts;
        hord.DATA.data = data;

        hord.DATA.edge.resources[selector] = hord.DATA.data;
        if (hord.DATA.hasOwnProperty("urls_edge")) {
            hord.DATA.urls_edge.resources[selector] = hord.DATA.data;
        }
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
                    var handle = value.name;
                    if (value.value) {
                        handle += "#" + value.value;
                    }
                    selected.push(handle);
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
        var value = el.attr("value");
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

        return {axisid : axisid, name : name, value: value, checked: checked, weights: weights};
    },

    newSectionManager : function(params) {
        return edges.instantiate(hord.SectionManager, params);
    },
    SectionManager : function(params) {
        this.form_selector = params.form_selector;
        this.scrollSelector = params.scrollSelector;
        this.scrollOffset = edges.getParam(params.scrollOffset, 0);
        this.lastButtonIsFinish = edges.getParam(params.lastButtonIsFinish, true);

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
                //var disabledClasses = edges.css_classes(this.namespace, "disabled");
                //var frag = '<span class="' + disabledClasses + ' btn btn-default" disabled>start</span>';
                $(prevSelector).html("");
            } else {
                var prevLink = edges.css_classes(this.namespace, "prev-link");
                var frag = '<a href="#" class="' + prevLink + ' btn btn-info" data-target="' + String(prev) + '">&laquo; previous section</a>';
                $(prevSelector).html(frag);

                var prevLinkSelector = edges.css_class_selector(this.namespace, "prev-link");
                edges.on(prevLinkSelector, "click", this, "linkClicked");
            }

            if (next === false) {
                //var disabledClasses = edges.css_classes(this.namespace, "disabled");
                //var frag = '<span class="' + disabledClasses + ' btn btn-default" disabled>next section &raquo;</span>';
                $(nextSelector).html("");
            } else {
                var nextLink = edges.css_classes(this.namespace, "next-link");
                var text = "next section &raquo;";
                if (this.lastButtonIsFinish && next === this.maxSection - 1) {
                    text = "finish &raquo;";
                }
                var frag = '<a href="#" class="' + nextLink + ' btn btn-info" data-target="' + String(next) + '">' + text + '</a>';
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
            var offset = $(this.scrollSelector).offset().top - this.scrollOffset;
            var currentScroll = $("html,body").scrollTop();
            if (currentScroll > offset) {
                $("html,body").animate({
                    scrollTop: offset
                }, 500);
            }
        };

        // finally, init the section manager
        this.init();
    }
};