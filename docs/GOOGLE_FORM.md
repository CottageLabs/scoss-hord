# Google Form Deployment (under WordPress)

To deploy the user details form which will capture data to the Google
Sheet, you can embed the Google Form with an `iframe` on any WordPress
page by including the following HTML:

```html
<script type="application/javascript">
    var loadCounter = 0;
    var loaded = function() {
        loadCounter += 1;
        if (loadCounter === 2) {
            jQuery("iframe").attr("height", "500px");
            jQuery(window).scrollTo(315,0)
        }
    }
</script>

<p>Once you have filled in the form, or if you have filled it in before, then go straight to the questionnaire <a href="/hord">here</a></p>

<iframe 
    src="https://docs.google.com/forms/d/e/1FAIpQLSePLAoZXmCMh99poJwiMxEj7On6lhsdHknSMASSNzub9r4Lug/viewform?embedded=true" 
    width="100%" 
    height="3000px" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0"
    onload="loaded()">
        Loading...
</iframe>

<p>Once you have filled in the form, or if you have filled it in before, then go straight to the questionnaire <a href="/hord">here</a></p>
```

Note that the height of `3000px` is intended to ensure that the entire
form is displayed without scroll bars inside the `iframe`.  You can adjust
these dimensions as desired for your page layout.

The other dimensions that you can set are as follows:

* The dimension of the post-submit page, currently set to `500px`
* The scroll offset for the post-submit page, currently set to `315`

You should also make sure that the link to the main HORD page is set correctly
in the final link.

# Google Form Responses

The responses to the Google Form are stored in a Google Sheet, here:

https://docs.google.com/spreadsheets/d/13wyX--GpOqbiR9eGrUlqGTFPbxgnEjRRgOTCdDl0FeY/edit

