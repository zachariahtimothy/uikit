/* jshint strict:false */
/* global Package:true */

Package.describe({
  name: 'zcurtis:uikit',
  version: '2.24.3_2',
  // Brief, one-line summary of the package.
  summary: 'UIKit repackaged for Meteor (from fork)',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/zachariahtimothy/uikit',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('jquery', 'client');

  api.addAssets([
    'dist/fonts/fontawesome-webfont.ttf',
    'dist/fonts/fontawesome-webfont.woff',
    'dist/fonts/fontawesome-webfont.woff2',
    'dist/fonts/FontAwesome.otf',
  ], 'client');

  api.addFiles([
    
    'dist/css/uikit.almost-flat.css',
    'dist/css/components/accordion.almost-flat.css',
    'dist/css/components/autocomplete.almost-flat.css',
    'dist/css/components/datepicker.almost-flat.css',
    'dist/css/components/dotnav.almost-flat.css',
    'dist/css/components/form-advanced.almost-flat.css',
    'dist/css/components/form-file.almost-flat.css',
    'dist/css/components/form-password.almost-flat.css',
    'dist/css/components/form-select.almost-flat.css',
    'dist/css/components/htmleditor.almost-flat.css',
    'dist/css/components/nestable.almost-flat.css',
    'dist/css/components/notify.almost-flat.css',
    'dist/css/components/placeholder.almost-flat.css',
    'dist/css/components/progress.almost-flat.css',
    'dist/css/components/search.almost-flat.css',
    'dist/css/components/slidenav.almost-flat.css',
    'dist/css/components/slider.almost-flat.css',
    'dist/css/components/slideshow.almost-flat.css',
    'dist/css/components/sortable.almost-flat.css',
    'dist/css/components/sticky.almost-flat.css',
    'dist/css/components/tooltip.almost-flat.css',
    'dist/css/components/upload.almost-flat.css',

    'dist/js/uikit.min.js',
    'dist/js/components/accordion.js',
    'dist/js/components/autocomplete.js',
    'dist/js/components/datepicker.js',
    'dist/js/components/form-password.js',
    'dist/js/components/form-select.js',
    'dist/js/components/grid.js',
    'dist/js/components/htmleditor.js',
    'dist/js/components/lightbox.js',
    'dist/js/components/nestable.js',
    'dist/js/components/notify.js',
    'dist/js/components/pagination.js',
    'dist/js/components/parallax.js',
    'dist/js/components/search.js',
    'dist/js/components/slider.js',
    'dist/js/components/slideset.js',
    'dist/js/components/slideshow.js',
    'dist/js/components/slideshow-fx.js',
    'dist/js/components/sortable.js',
    'dist/js/components/sticky.js',
    'dist/js/components/timepicker.js',
    'dist/js/components/tooltip.js',
    'dist/js/components/upload.js',
  ], 'client');

  api.export('UIkit', 'client');
});

Package.onTest(function(api) {
  //api.use('tinytest');
  api.use('zcurtis:uikit');
  //api.addFiles('uikit-tests.js');
});
