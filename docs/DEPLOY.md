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
    
    <div class="container-fluid"><div class="content">
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
            window.$||(window.$=jQuery);
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
    
    <div class="container-fluid"><div class="content">
        <div id="hord"></div>
        <div>
            <br><br>
            <p>For more information, see <a href="http://www.dcc.ac.uk/resources/how-guides/RISE">http://www.dcc.ac.uk/resources/how-guides/RISE</a></p>
    
            <p>To feed back on how this is or is not working for you, please mail us <a href="mailto:info@sparceurope.org">info@sparceurope.org</a></p>
        </div>
    </div></div>
    
    <script type="application/javascript">
        jQuery(document).ready(function($) {
            window.$||(window.$=jQuery);
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


    <link rel="stylesheet" href="http://sparceurope.org/test2017/wp-content/uploads/2018/06/hord.dep_.css">
    <link rel="stylesheet" href="http://sparceurope.org/test2017/wp-content/uploads/2018/06/hord.min_.css">
    
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
        
            <section>
                <h1>Your Organisation</h1>
                <input type="text" data-hord="title" name="organisation" placeholder="enter your organisation name" style="width: 100%">
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="rdm-policy" data-hord-charts="main,tailored,leading">RDM policy and strategy</h1>
        
                <h2>Policy development</h2>
        
                <div class="answer">
                    <input name="a" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main">Institutional policy articulates roles &amp; responsibilities for researchers, other staff and students to comply with legal &amp; regulatory obligations and external funders' RDM policy expectations
                </div>
        
                <div class="answer">
                    <input name="b" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,tailored">Institutional policy articulates the value of good RDM practice to the institution and its rationale for retaining data of long-term value. Policy is subject to a regular, scheduled review process.
                </div>
        
                <div class="answer">
                    <input name="c" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,leading">Institutional policies with a bearing on RDM (e.g. FOI, ethics, research conduct, etc.) are joined up and complementary. Policies are externally promoted, aiming to push the sector forward.
                </div>
        
                <h2>Awareness raising and stakeholder engagement</h2>
        
                <div class="answer">
                    <input name="d" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main">Research data policies are promoted to all relevant staff, students and researchers
                </div>
        
                <div class="answer">
                    <input name="e" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,tailored">Guidance on how to apply all relevant policies to the institutional context is provided and promoted to all relevant staff, students and researchers.
                </div>
        
                <div class="answer">
                    <input name="f" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,leading">Policies are promoted by the institution through channels designed to engage with staff, student and researcher groups’ specific interests.
                </div>
        
                <h2>RDM implementation roadmap</h2>
        
                <div class="answer">
                    <input name="g" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main">RDM roadmap is compliance focussed and defined by funder requirements
                </div>
        
                <div class="answer">
                    <input name="h" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,tailored">Roadmap is informed by the institution’s strategies and its researchers' priorities.
                </div>
        
                <div class="answer">
                    <input name="i" type="checkbox" data-hord="value" data-hord-axisid="rdm-policy" data-hord-weight="1" data-hord-charts="main,leading">Roadmap/strategy seeks to derive competitive advantage from RDM support. It aims to be sector-leading and innovative
                </div>
        
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="business-sustainability" data-hord-charts="main,tailored,leading">Business plans and sustainability</h1>
        
                <h2>Staff Investment</h2>
        
                <div class="answer">
                    <input name="j" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main">RDM service is delivered by dividing responsibilities among existing staff.
                </div>
        
                <div class="answer">
                    <input name="k" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,tailored">RDM service is delivered through significant redesign of staff roles including investment in staff development.
                </div>
        
                <div class="answer">
                    <input name="l" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,leading">The RDM service is delivered by major redesign of staff roles, consistent with the establishment of an RDM service.
                </div>
        
                <h2>Technology Investment</h2>
        
                <div class="answer">
                    <input name="m" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main">A base level of investment in technical infrastructure, with commitment to supporting recurring costs, ensures that researchers can make their data findable and accessible in the long-term.
                </div>
        
                <div class="answer">
                    <input name="n" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,tailored">The institution coordinates investment in the central technical services it deems a strategic priority for research data life-cycle support.
                </div>
        
                <div class="answer">
                    <input name="o" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,leading">The institution invests in technical infrastructure for all aspects of the research data life cycle, interoperating with tools and workflows at research group level.
                </div>
        
                <h2>Cost modelling</h2>
        
                <div class="answer">
                    <input name="p" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main">All RDM service costs are covered by overheads on grants.
                </div>
        
                <div class="answer">
                    <input name="q" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,tailored">Standard RDM services are funded through grant overheads. Where support exceeds the norm mechanisms allow for direct charging of grants.
                </div>
        
                <div class="answer">
                    <input name="r" type="checkbox" data-hord="value" data-hord-axisid="business-sustainability" data-hord-weight="1" data-hord-charts="main,leading">Cost modelling enables specialist, stand-alone RDM services to be offered alongside standard support provision. (e.g. statistical modelling service or data visualisation service).
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="advisory" data-hord-charts="main,tailored,leading">Advisory services</h1>
        
                <div class="answer">
                    <input name="s" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main">Generic, online guidance is offered that addresses key areas of RDM. Content may be externally sourced, with little relating to the specific institutional context. Pages include a helpdesk email address.
                </div>
        
                <div class="answer">
                    <input name="t" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main,tailored">Guidance offers relevant advice on how to use services that comply with institutional policies, and the benefits to researchers of doing so
                </div>
        
                <div class="answer">
                    <input name="u" type="checkbox" data-hord="value" data-hord-axisid="advisory" data-hord-weight="3" data-hord-charts="main,leading">Guidance is significantly tailored to support the specific needs of the institution’s researchers and support staff. Guidance content is externally referenced as sector best practice
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="training" data-hord-charts="main,tailored,leading">Training</h1>
        
                <h2>Online training</h2>
        
                <div class="answer">
                    <input name="v" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main">Externally sourced online courses are linked to from RDM pages.
                </div>
        
                <div class="answer">
                    <input name="w" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main,tailored">Externally sourced online courses are supplemented with some materials which support local needs and services.
                </div>
        
                <div class="answer">
                    <input name="x" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main,leading">The institution produces a significant amount of online training material which meets the needs of its researchers and staff. Materials are reused by others in the sector.
                </div>
        
                <h2>Face to face training</h2>
        
                <div class="answer">
                    <input name="y" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main">Face to face training in basic RDM principles is available on request. Course content is regularly updated and responsive to feedback.
                </div>
        
                <div class="answer">
                    <input name="z" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main,tailored">Regular, structured face to face RDM courses are available to all. Training objectives are aligned with the objectives of the institution’s RDM strategy.
                </div>
        
                <div class="answer">
                    <input name="aa" type="checkbox" data-hord="value" data-hord-axisid="training" data-hord-weight="1.5" data-hord-charts="main,leading">Competencies for relevant researchers and professional support staff are defined in standard role descriptions. Training is provided which facilitates this development.
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="dmp" data-hord-charts="main,tailored,leading">Data management planning</h1>
        
                <div class="answer">
                    <input name="ab" type="checkbox" data-hord="value" data-hord-axisid="dmp" data-hord-weight="3" data-hord-charts="main">Institution provides guidance to researchers on completing funder-mandated DMPs as part of grant bids.
                </div>
        
                <div class="answer">
                    <input name="ac" type="checkbox" data-hord="value" data-hord-axisid="dmp" data-hord-weight="3" data-hord-charts="main,tailored">Institution mandates DMP production at bid stage for all researchers. Guidance and templates are provided. Research Office connects to relevant stakeholders to appraise DMP content and notify them of relevant resource implications.
                </div>
        
                <div class="answer">
                    <input name="ad" type="checkbox" data-hord="value" data-hord-axisid="dmp" data-hord-weight="3" data-hord-charts="main,leading">Institution promotes best practice in data management planning and facilitates good research design in relation to data generation and preservation. Automated systems flag researcher requirements to the relevant institutional support services (e.g. exceptionally large projected data volumes)
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="activedm" data-hord-charts="main,tailored,leading">Active data management</h1>
        
                <h2>Scalability and synchronisation</h2>
        
                <div class="answer">
                    <input name="ae" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main">The service provides researchers with managed access to networked storage, from multiple devices, of sufficient capacity and performance to satisfy most of the organisation’s projects.
                </div>
        
                <div class="answer">
                    <input name="af" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,tailored">The service can provide additional storage on request to satisfy exceptional storage capacity, device networking, or performance demands.
                </div>
        
                <div class="answer">
                    <input name="ag" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,leading">The service provides automated access to additional storage to satisfy exceptional capacity or performance demands.
                </div>
        
                <h2>Collaboration support</h2>
        
                <div class="answer">
                    <input name="ah" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main">The service enables access to data for external collaborators by providing them with local access rights to institutional storage systems.
                </div>
        
                <div class="answer">
                    <input name="ai" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,tailored">The service provides managed access to tools that enable researchers to share data with external collaborators.
                </div>
        
                <div class="answer">
                    <input name="aj" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,leading">The service provides managed access to virtual research environments that enable researchers to work on data with external collaborators
                </div>
        
                <h2>Security management</h2>
        
                <div class="answer">
                    <input name="ak" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main">The service provides authenticated access to storage that is protected from unauthorised data access, and researchers are made aware of procedures for data protection and de-identification.
                </div>
        
                <div class="answer">
                    <input name="al" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,tailored">The service provides tools/environments that enable researchers to deidentify, encrypt or control access to data as required.
                </div>
        
                <div class="answer">
                    <input name="am" type="checkbox" data-hord="value" data-hord-axisid="activedm" data-hord-weight="1" data-hord-charts="main,leading">The service provides researchers from across the institution with access to ISO 27001/2 or equivalently accredited facilities for analysis of shared sensitive data
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="appraisal" data-hord-charts="main,tailored,leading">Appraisal and risk assessment</h1>
        
                <h2>Data collection policy</h2>
        
                <div class="answer">
                    <input name="an" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main">Service primarily supports data deposit to third-party repositories, and holds datasets in-house when legal/ regulatory compliance requires
                </div>
        
                <div class="answer">
                    <input name="ao" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,tailored">Service defines criteria for retention of datasets of longterm value to the institution
                </div>
        
                <div class="answer">
                    <input name="ap" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,leading">Service defines criteria for developing datasets as special collections and ensures these meet specialist depositor and user needs
                </div>
        
                <h2>Security, legal and ethical risk assessment</h2>
        
                <div class="answer">
                    <input name="aq" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main">Service seeks confirmation that data was collected or created in accordance with legal and ethical criteria prevailing in the data producer's geographical location or discipline
                </div>
        
                <div class="answer">
                    <input name="ar" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,tailored">Service commits to proactively manage legal and ethical risks relevant to its depositors and users, and to relevant professional and technical development for researchers and support staff
                </div>
        
                <div class="answer">
                    <input name="as" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,leading">Service offers data producers tailored guidance on risk assessment, and on solutions that offer an appropriate level of risk control for the data they manage
                </div>
        
                <h2>Metadata collection to inform decision-making</h2>
        
                <div class="answer">
                    <input name="at" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main">Information is gathered from research projects to enable the identification of research data that must be kept for compliance purposes
                </div>
        
                <div class="answer">
                    <input name="au" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,tailored">Metadata is routinely recorded to relate research activity to data and other outputs, and enable better informed decisions on the preservation costs, risks and value to the institution
                </div>
        
                <div class="answer">
                    <input name="av" type="checkbox" data-hord="value" data-hord-axisid="appraisal" data-hord-weight="1" data-hord-charts="main,leading">Metadata on data and related research outputs is sufficiently well-structured and interoperable to enable added value to be extracted for service users’ needs
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="preservation" data-hord-charts="main,tailored,leading">Preservation</h1>
        
                <h2>Preservation planning and action</h2>
        
                <div class="answer">
                    <input name="aw" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main">Service demonstrates it can ensure continued bit-level integrity of the data collections it holds, its metadata, and its links to any related information submitted with it
                </div>
        
                <div class="answer">
                    <input name="ax" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main,tailored">Service enables preservation plans e.g. file migration or normalisation to be enacted at time of ingest or dissemination, and records all actions, migrations and administrative processes it performs
                </div>
        
                <div class="answer">
                    <input name="ay" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main,leading">Service commits to deploy tools and expertise to maintain the significant properties of data, metadata and related information for required retention periods and identified user groups (full preservation)
                </div>
        
                <h2>Continuity Support</h2>
        
                <div class="answer">
                    <input name="az" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main">Service enables retained data to be stored with a copy automatically held in another location
                </div>
        
                <div class="answer">
                    <input name="ba" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main,tailored">Service enables retained data to be stored with copies automatically held in two separate locations, at least one off-site
                </div>
        
                <div class="answer">
                    <input name="bb" type="checkbox" data-hord="value" data-hord-axisid="preservation" data-hord-weight="1.5" data-hord-charts="main,leading">Service enables data &amp; metadata to be automatically distributed across multiple locations according to specific policy criteria
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="access" data-hord-charts="main,tailored,leading">Access and publishing</h1>
        
                <h2>Monitoring locally produced datasets</h2>
        
                <div class="answer">
                    <input name="bc" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main">Information is gathered from research projects to enable compliance with funders’ requirements for research data discoverability.
                </div>
        
                <div class="answer">
                    <input name="bd" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,tailored">Metadata is routinely recorded on locally produced data, and its links to research activity or related outputs, enhancing the quality of the institution's research information.
                </div>
        
                <div class="answer">
                    <input name="be" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,leading">Metadata on locally produced research data, and its links to other activities or outputs, is sufficiently structured and organised to inform institutional strategy.
                </div>
        
                <h2>Data publishing mandate</h2>
        
                <div class="answer">
                    <input name="bf" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main">Service supports minimum external requirements for metadata and publicly accessible data.
                </div>
        
                <div class="answer">
                    <input name="bg" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,tailored">Service supports community best practice standards for data access, citation and metadata exchange.
                </div>
        
                <div class="answer">
                    <input name="bh" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,leading">Service supports bespoke content discoverability, access and quality review needs for user groups or organisations.
                </div>
        
                <h2>Level of data curation</h2>
        
                <div class="answer">
                    <input name="bi" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main">Service commits to brief oversight of submitted data and metadata e.g. for compliance purposes.
                </div>
        
                <div class="answer">
                    <input name="bj" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,tailored">Service commits to maintain or enhance value through routine action across data collections.
                </div>
        
                <div class="answer">
                    <input name="bk" type="checkbox" data-hord="value" data-hord-axisid="access" data-hord-weight="1" data-hord-charts="main,leading">Service commits to maintain or enhance value through bespoke action on individual collections.
                </div>
            </section>
        
            <section>
                <h1 data-hord="axis" data-hord-axisid="discovery" data-hord-charts="main,tailored,leading">Discovery</h1>
        
                <h2>Metadata cataloguing scope</h2>
        
                <div class="answer">
                    <input name="bl" type="checkbox" data-hord="value" data-hord-axisid="discovery" data-hord-weight="3" data-hord-charts="main">Service catalogues metadata for the organisation’s publicly funded datasets according to funder expectations that they are discoverable, citable, and linked to related content
                </div>
        
                <div class="answer">
                    <input name="bm" type="checkbox" data-hord="value" data-hord-axisid="discovery" data-hord-weight="3" data-hord-charts="main,tailored">Service catalogues metadata to enhance value of the institutions data assets in accordance with recognised best practice standards
                </div>
        
                <div class="answer">
                    <input name="bn" type="checkbox" data-hord="value" data-hord-axisid="discovery" data-hord-weight="3" data-hord-charts="main,leading">Service catalogues metadata to enhance potential dataset reuse according to sector leading standards, or fulfil domain-specific purposes
                </div>
            </section>
        
        </form>    
    </div>
    
    <div class="container-fluid"><div class="content">
        <div id="hord"></div>
        <div>
            <br><br>
            <p>For more information, see <a href="http://www.dcc.ac.uk/resources/how-guides/RISE">http://www.dcc.ac.uk/resources/how-guides/RISE</a></p>
    
            <p>To feed back on how this is or is not working for you, please mail us <a href="mailto:info@sparceurope.org">info@sparceurope.org</a></p>
        </div>
    </div></div>
    
    <script type="text/javascript" src="http://sparceurope.org/test2017/wp-content/uploads/2018/06/hord.dep_.nojq_.js"></script>
    <script type="text/javascript" src="http://sparceurope.org/test2017/wp-content/uploads/2018/06/hord.min_.js"></script>
    
    <script type="application/javascript">
        jQuery(document).ready(function($) {
            window.$||(window.$=jQuery);
            hord.init({
                source_selector: "#hord-form",
                working_selector: "#hord",
                editUrlTemplate: "/hord?mode=edit&d={summary}",
                editUrlRegex: new RegExp(".+&d=(.+)"),
                viewUrlTemplate: "/hord?mode=view&d={summary}",
                viewUrlRegex: new RegExp(".+&d=(.+)")
            })
        });
    </script>
    
    