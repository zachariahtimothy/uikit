/* jshint strict:false */
/* global Package:true */

Package.describe({
  name: 'zcurtis:uikit',
  version: '2.21.0',
  // Brief, one-line summary of the package.
  summary: 'UIKit repackaged for Meteor (from fork)',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/MeteorPackaging/uikit',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.1');
  api.use('jquery', 'client');
  api.addFiles([
    'dist/fonts/fontawesome-webfont.eot',
    'dist/fonts/fontawesome-webfont.ttf',
    'dist/fonts/fontawesome-webfont.woff',
    'dist/fonts/fontawesome-webfont.woff2',
    'dist/css/uikit.almost-flat.css',
    'dist/css/accordion.almost-flat.css',
    'dist/css/autocomplete.almost-flat.css',
    'dist/css/datepicker.almost-flat.css',
    'dist/css/form-password.almost-flat.css',
    'dist/css/form-select.almost-flat.css',
    'dist/css/htmleditor.almost-flat.css',
    'dist/css/nestable.almost-flat.css',
    'dist/css/notify.almost-flat.css',
    'dist/css/search.almost-flat.css',
    'dist/css/slider.almost-flat.css',
    'dist/css/sticky.almost-flat.css',
    'dist/css/tooltip.almost-flat.css',
    'dist/js/uikit.js',
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
    'dist/js/components/sticky.js',
    'dist/js/components/timepicker.js',
    'dist/js/components/tooltip.js',
  ], 'client');
});

Package.onTest(function(api) {
  //api.use('tinytest');
  api.use('zcurtis:uikit');
  //api.addFiles('uikit-tests.js');
});
