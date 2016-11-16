var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var extReplace = require("gulp-ext-replace");

var postcss = require("gulp-postcss");
var postcssSimpleVars = require("postcss-simple-vars");
var postcssImport = require("postcss-import");
var postcssCustomMedia = require("postcss-custom-media");
var postcssCalc = require("postcss-calc");
var postcssZindex = require("postcss-zindex");
var postcssResponsiveImages = require("postcss-responsive-images");
var postcssMixins = require("postcss-mixins");
var postcssPropertyLookup = require("postcss-property-lookup");
var postcssNesting = require("postcss-nesting");
var postcssCenter = require("postcss-center");
var postcssBrandColors = require("postcss-brand-colors");


gulp.task("postcss", function() {
  //Post css modules
  var modules = [
    postcssImport(),
    postcssMixins(),
    postcssResponsiveImages(),
    postcssCustomMedia(),
    postcssSimpleVars(),
    postcssPropertyLookup(),
    postcssCalc(),
    postcssZindex(),
    postcssNesting(),
    postcssCenter(),
    postcssBrandColors()
  ];

  return gulp.src("app/css/index.css")
    .pipe(postcss(modules))
    .pipe(extReplace(".css"))
    .pipe(gulp.dest("public/css"))
});

gulp.task("start", function () {
  nodemon({
    script: "index.js",
    ext: "pcss js html",
    env: { "NODE_ENV": "development" },
    tasks: ["postcss"]
  });
});