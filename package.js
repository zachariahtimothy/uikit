/* jshint strict:false */
/* global Package:true */

Package.describe({
  name: 'zcurtis:uikit',
  version: '2.20.3',
  // Brief, one-line summary of the package.
  summary: 'UIKit repackaged for Meteor (from fork)',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:MeteorPackaging/uikit.git',
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
    'dist/js/uikit.js'
  ], 'client');
});

Package.onTest(function(api) {
  //api.use('tinytest');
  api.use('zcurtis:uikit');
  //api.addFiles('uikit-tests.js');
});
