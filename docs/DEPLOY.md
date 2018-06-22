# Deployment (under WordPress)

Before proceeding, ensure you have access to the latest version of the production build assets.  These are in the code
repository under /release.  If you do not have them, or want to update them, please see BUILD.md for information.

## JavaScript/CSS Dependencies

The HORD questionnaire depends on the following common shared JavaScript and CSS libraries:

* JQuery 1.12.4
* ChartJS 2.7.2
* Twitter Bootstrap 3.3.1

Before you deploy the software, you should be sure that these dependencies will not interfere with
your existing site dependencies, or that you already have equivalent or compatible versions on your site.


## Page Template

A full page which implements the questionnaire looks as follows:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>HORD Testing Site - Questionnaire</title>
    
        <link rel="stylesheet" href="/release/hord.dep.css">
        <link rel="stylesheet" href="/release/hord.min.css">
    
    </head>
    <body>
    
    <div id="hord-form" style="display:none">
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
         
            ...
         
         </form>
     </div>
    
    <div class="container"><div class="content">
        <div id="hord"></div>
        <div>
            <br><br>
            <p>For more information, see <a href="http://www.dcc.ac.uk/resources/how-guides/RISE">http://www.dcc.ac.uk/resources/how-guides/RISE</a></p>
    
            <p>To feed back on how this is or is not working for you, please mail us <a href="mailto:info@sparceurope.org">info@sparceurope.org</a></p>
        </div>
    </div></div>

    <script type="text/javascript" src="/release/hord.dep.js"></script>
    <script type="text/javascript" src="/release/hord.min.js"></script>
    
    <!-- this is the javascript which triggers the application on the page -->
    <script type="application/javascript">
        jQuery(document).ready(function($) {
            hord.init({
                source_selector: "#hord-form",
                working_selector: "#hord",
                editUrlTemplate: "/hord_build.html?mode=edit&d={summary}",
                editUrlRegex: new RegExp(".+&d=(.+)"),
                viewUrlTemplate: "/hord_build.html?mode=view&d={summary}",
                viewUrlRegex: new RegExp(".+&d=(.+)")
            })
        });
    </script>
    
    </body>
    </html>

The full questionnaire for inclusion in the section `<div id="hord-form" style="display:none">` can be found in src/fragments/hord.form.html.


We need to set up a WordPress page so that it is equivalent to this.

If you wish to load the css and javascript assets from your site template, then you need to include the following in the
site template:

    <link rel="stylesheet" href="/path/to/hord.dep.css">
    <link rel="stylesheet" href="/path/to/hord.min.css">
    
    <script type="text/javascript" src="/path/to/hord.dep.js"></script>
    <script type="text/javascript" src="/path/to/hord.min.js"></script>

If you have jQuery already as part of your page template, you do not want to load it again, so you can use:

    <link rel="stylesheet" href="/path/to/hord.dep.css">
        <link rel="stylesheet" href="/path/to/hord.min.css">
        
        <script type="text/javascript" src="/path/to/hord.dep.nojq.js"></script>
        <script type="text/javascript" src="/path/to/hord.min.js"></script>

This will load all the dependencies *except* jQuery.  You must be sure that jQuery is being loaded before the above imports are called.


You will need to include the css and js files in the /release directory of this code library into a common location
in your WordPress instance, and then update the href/src attributes above to point to them.

You should then create an individual page for the questionnaire, and on that page place the
following HTML fragment:


    <div id="hord-form" style="display:none">
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
         
            ...
         
         </form>
     </div>
    
    <div class="container"><div class="content">
        <div id="hord"></div>
        <div>
            <br><br>
            <p>For more information, see <a href="http://www.dcc.ac.uk/resources/how-guides/RISE">http://www.dcc.ac.uk/resources/how-guides/RISE</a></p>
    
            <p>To feed back on how this is or is not working for you, please mail us <a href="mailto:info@sparceurope.org">info@sparceurope.org</a></p>
        </div>
    </div></div>
    
    <script type="application/javascript">
        jQuery(document).ready(function($) {
            hord.init({
                source_selector: "#hord-form",
                working_selector: "#hord",
                editUrlTemplate: "/hord_build.html?mode=edit&d={summary}",
                editUrlRegex: new RegExp(".+&d=(.+)"),
                viewUrlTemplate: "/hord_build.html?mode=view&d={summary}",
                viewUrlRegex: new RegExp(".+&d=(.+)")
            })
        });
    </script>
    

### Example full page from WordPress Test site

Below is the full HTML content of a page on the SPARC WordPress site which implements the HORD questionnaire

    TODO
    
    
