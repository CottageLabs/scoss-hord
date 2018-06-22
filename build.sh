#!/usr/bin/env bash

# paths to utilities required by this script
NODEJS="nodejs"
R="vendor/edges/build/r.js"


# variables to use for this run
OUT="release/"
EDGES="vendor/edges/"
MIN_JS="hord.min.js"
BUILD_NOTE="build.txt"
DEP_JS="hord.dep.js"
MIN_CSS="hord.min.css"
DEP_CSS="hord.dep.css"
DEP_NOJQ_JS="hord.dep.nojq.js"

# variables derived from the base configuration for this run
SRC=$OUT/js_src
BSRC=$OUT/js_build
MSRC=$OUT/$MIN_JS

DEP=$OUT/dep
MDEP=$OUT/$DEP_JS
NOJQDEP=$OUT/$DEP_NOJQ_JS
CDEP=$OUT/$DEP_CSS

CSS=$OUT/css_src
BCSS=$OUT/css_build
MCSS=$OUT/$MIN_CSS

BUILD=$OUT/$BUILD_NOTE

# start by flattening out the output structure and rebuilding it
rm -r $OUT
mkdir $OUT
mkdir $SRC
mkdir $BSRC
mkdir $DEP
mkdir $CSS
mkdir $BCSS

# TODO - set the correct files to be included
# OR - consider moving to asset management
######

####################################################
## JavaScript source handling

# now copy at the js into the SRC directory
cp src/js/jqbinding.js $SRC
cp $EDGES/src/edges.jquery.js $SRC
cp $EDGES/src/edges.js $SRC
cp $EDGES/src/components/charts.js $SRC
cp $EDGES/src/renderers/chartjs.Radar.js $SRC
cp src/js/hord.edges.js $SRC

# compile all the javascript down to minified versions
$NODEJS $R -o appDir=$SRC baseDir=. dir=$BSRC

# combine all the js into a single file in the right order
cat $BSRC/jqbinding.js <(echo) \
    $BSRC/edges.jquery.js <(echo) \
    $BSRC/edges.js <(echo) \
    $BSRC/charts.js <(echo) \
    $BSRC/chartjs.Radar.js <(echo) \
    $BSRC/hord.edges.js <(echo) \
    > $MSRC


#######################################################
## JS Dependencies handling

# pull in all the dependencies
cp src/js/jqbinding.js $DEP
cp vendor/jquery-1.12.4/jquery-1.12.4.min.js $DEP
cp vendor/edges/vendor/chartjs-2.7.2/Chart.min.js $DEP

# combine all the dependencies into a single file in the right order (with jquery)
cat $DEP/jquery-1.12.4.min.js <(echo) \
    $DEP/jqbinding.js <(echo) \
    $DEP/Chart.min.js <(echo) \
    > $MDEP

# combine all the dependencies into a single file in the right order (without jquery)
cat $DEP/jqbinding.js <(echo) \
    $DEP/Chart.min.js <(echo) \
    > $NOJQDEP

######################################################
## CSS source handling

# copy the css into the build directory
cp src/css/hord.edges.css $CSS

# minify each css file individually
$NODEJS $R -o cssIn=$CSS/hord.edges.css out=$BCSS/hord.edges.css baseUrl=.

# cat all the CSS into a single minified file
cat $BCSS/hord.edges.css <(echo) \
    > $MCSS

########################################################
## CSS Dependencies handling

# copy all the css into the build directory
cp $EDGES/vendor/bootstrap-3.3.1/css/bootstrap.min.css $CSS

# cat all the dependency CSS into a single file
cat $CSS/bootstrap.min.css <(echo) \
    > $CDEP

#######################################################
## Record the Build time and cleanup

echo "Build $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > $BUILD

rm -r $BSRC
rm -r $SRC
rm -r $DEP
rm -r $CSS
rm -r $BCSS