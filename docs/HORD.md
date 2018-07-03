# HORD Questionnaire Radar Charts

This codebase includes a generic library for handling conversion of an
HTML form into an interactive form which can generate Radar diagrams
showing the user's answers, and allows the user to download images
of those Radar diagrams.

This document describes how to configure the code to work over any 
form, using the HORD questionnaire as an example.

## Defining your questionnaire

Your initial questionnaire should be created in a hidden `div` as pure
HTML, thus:

```html
<div id="hord-form" style="display:none">
    <form>
        <input>
        <input>
        ...
    </form>
</div>
```

You should then create an empty `div` where the interactive form will
be rendered for the user.  For example:

```html
<div class="container">
    <div class="content">
        <div id="hord"></div>
    </div>
</div>
```

## Initialising over a form

### Dependencies

You will require the following CSS:

```html
<link rel="stylesheet" href="/vendor/edges/vendor/bootstrap-3.3.1/css/bootstrap.min.css">
<link rel="stylesheet" href="/src/css/hord.edges.css">
```

And the following JavaScript:

```html
<script type="text/javascript" src="/vendor/jquery-1.12.4/jquery-1.12.4.min.js"></script>
<script type="text/javascript" src="/vendor/edges/vendor/chartjs-2.7.2/Chart.min.js"></script>
<script type="text/javascript" src="/vendor/edges/src/edges.jquery.js"></script>
<script type="text/javascript" src="/vendor/edges/src/edges.js"></script>
<script type="text/javascript" src="/vendor/edges/src/components/charts.js"></script>
<script type="text/javascript" src="/vendor/edges/src/renderers/chartjs.Radar.js"></script>
<script type="text/javascript" src="/src/js/hord.edges.js"></script>
```

### Initialisation

Then you can initialise the code over your form as follows:

```html
<script type="application/javascript">
    jQuery(document).ready(function($) {
        hord.init({
            source_selector: "#hord-form",
            working_selector: "#hord",
            editUrlTemplate: "/hord.html?mode=edit&d={summary}",
            editUrlRegex: new RegExp(".+&d=(.+)"),
            viewUrlTemplate: "/hord.html?mode=view&d={summary}",
            viewUrlRegex: new RegExp(".+&d=(.+)")
        })
    });
</script>
```

The arguments passed in are defined as follows:

* source_selector - where the HTML form is located.  This should be in the
hidden `div` described in the previous section.

* working_selector - the empty `div` where the application can produce the
working copy of the interactive form

* editUrlTemplate - the URL for the page where you'd like the editable form
to be located.  This must contain the followign query arguments:
    * mode=edit
    * d={summary}

* viewUrlTemplate - the URL for the page where you'd like the view-only page
to be located.  This must contain the followign query arguments:
    * mode=edit
    * d={summary}


## Configuring the Charts
 
On order to determine what charts will be generated, and how they will
be set up, we must provide some configuration.  This is done by attaching
the options as `data` attributes on the `form`.

First, identify the element containing the configuraiton with:

```
data-hord="config"
```

Then specify the chart ids of any charts that will be generated, as a
comma separated list:

```
data-hord-charts="main,tailored,leading"
```

This specifies that the data from the form will be piped to three charts
with the ids `main`, `tailored` and `leading`.

You can now specify three attributes about a chart:

* The name of the chart, which will be displayed at the top

```
data-hord-charts-[chart_id]-name="Chart Name"
```

* The size of the chart, which is the number of "ticks" from the center
to the edge.  The size should reflect the maximum possible score from
the form (see later sections for more details)

```
data-hord-charts-[chart_id]-size="9"
```

* The visibility of the chart, which controls whether it is visible on
the edit page and/or on the view page.  Allowed values are "edit" and "view",
and you may supply one or both, comma separated.

```
data-hord-charts-[chart_id]-visibility="edit"
```

The following snippet defines three charts, provides each with a name,
making one chart which is on the edit page of size 9, and two other
charts which appear on the view page with size 3:

```
<form data-hord="config" data-hord-charts="main,tailored,leading"

          data-hord-charts-main-name="RDM Service Provision"
          data-hord-charts-main-size="9"
          data-hord-charts-main-visibility="edit,view"
          
          data-hord-charts-tailored-name="RDM Tailored Services"
          data-hord-charts-tailored-size="3"
          data-hord-charts-tailored-visibility="view"
          
          data-hord-charts-leading-name="Sector-leading Activity"
          data-hord-charts-leading-size="3"
          data-hord-charts-leading-visibility="view">
```


## Custom Title

You may wish to add a user-supplied enhancement to the title of a chart.

To do this you can use the attribute:

```
data-hord="title"
```

This will then be appended to the title for the chart, along with the
date that the chart was last updated.

For example, if a chart has the configured title:

```
RDM Service Provision
```

And you provide an `input` box as follows:

<input type="text" data-hord="title" name="organisation" placeholder="enter your organisation name">

Then when the user provides input to that text box (e.g. "My Organisation"), 
the title will become:

```
RDM Service Provision - My Organisation, 22 Jun 2018
```


## Defining Axes

A Radar chart requires three or more axes to be defined.  We can define
an axis on any HTML element, and by convention we use the headers for 
each section of the form, where a section corresponds to a single axis.

To specify that an element defines an axis, use the attribute

```
data-hord="axis"
```

You may then provide additional attributes:

* Specify an ID for the axis

```
data-hord-axisid="axis_id"
```

* Specify which charts the axis appears on.  An axis may appear on one
or more charts, specified by id and separated by comma

```
data-hord-charts="chart_id_1,chart_id_2"
```

Not all axes in your form need to appear on the same charts.  Axes can
appear on any chart that is defined in the configuration in any combination.

* Specify the name of the axis.  You may specify the following attribute

```
data-hord-name="My Axis Name"
```

If you omit this attribute, the system will take the body text of the
tag on which the axis is defined.  For example

```
<h1 data-hort="axis">My Axis Name</h1>
```


For example, this is the definition of an axis which appears on three charts:

```
<h1 data-hord="axis" data-hord-axisid="rdm-policy" data-hord-charts="main,tailored,leading">RDM policy and strategy</h1>
```


## Defining Values

Each axis on the Radar chart will have a value, which defines how far
out from the center the area plot will be anchored along that axis.

The axes get their value from the sum of all the checkboxes in the form
which are checked which are appropriate for that axis.

If 3 checkboxes are selected for a given axis, that axis will have a value
of 3 (unless the weights of the checkboxes are changed, see below)

For each `input` which is a checkbox which can contribute to the value
of an axis, we use the attribute

```
data-hord="value"
```

We can then supply the following additional attributes:

* Specify the axis that the value counts towards

```
data-hord-axisid="axis_id"
```

* Specify the charts that the value will count towards.  This means
that the value will be counted against the axis on a *per-chart* basis,
so a value may be counted against an axis on one chart, but not on another.

```
data-hord-charts="chart_id_1,chart_id_2"
```

* Specify the weight of the value, in general, and per specific chart.

To set a weight that is used by all charts

```
data-hord-weight="1"
```

To set a weight that is used by a specific chart

```
data-hord-weight-[chart_id]="2"
```

Note that weight defaults to "1".


For example, the following defines a checkbox which contributes value
to the "rdm-policy" axis on only the "main" and "tailored" charts, with
a weight of 1 by default, and a weight of 2 on the "tailored" chart.

```
<input name="b" type="checkbox" 
        data-hord="value" 
        data-hord-axisid="rdm-policy" 
        data-hord-weight="1" 
        data-hord-weight-tailored="2"
        data-hord-charts="main,tailored">
```


## Optimising URLs

The application uses the URL to maintain page state - there is no back-end
storage for the forms.  

It does this by taking the list of `input` checkbox names and creating a comma
separated list of those that have been selected, and then passing it through
base64 encoding.

As a result, the longer your `input` names, the longer the URLs.

If possible, it is best to keep the names of your `input` boxes as short
as possible, in order to constrain the overall length of the URL.  For 
example, contracting them to single or two character strings:

```
<input name="a" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main">
<input name="b" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,tailored">
<input name="c" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,leading">
```


## Paged Forms

In order to aid the readability and usability of long forms, the application
will page forms by HTML `section`. 

To define a page, simply wrap the group of questions in `<section>` and 
`</section>` tags.

The following example would result in a two page form.

```
<section>
    <h1>Your Organisation</h1>
    <input type="text" data-hord="title" name="organisation" placeholder="enter your organisation name" style="width: 100%">
</section>

<section>
    <h1 data-hord="axis" data-hord-axisid="advisory" data-hord-charts="main,tailored,leading">Advisory services</h1>
    <input name="s" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main"> q1
    <input name="t" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main,tailored"> q2
    <input name="u" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main,leading"> q3
</section>

```

Note that the paging is done in JavaScript, there are not multiple HTML
pages involved.


## Displaying URLs in the form paging

If you want the URLs to the edit and view pages to appear in the paged
form (for example, at the end), then include the following section
in your form HTML definition:

```html
<section>
    <h1>You're done!</h1>
    <div data-hord="urls" id="hord-urls"></div>
</section>
```

