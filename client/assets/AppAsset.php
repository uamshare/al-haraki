<?php

namespace client\assets;

use yii\web\AssetBundle;

/**
 * Main client application asset bundle.
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'plugins/angular/angular-csp.css',
        'plugins/angular-motion/dist/angular-motion.min.css',
        'plugins/AngularJS-Toaster/toaster.css',
        'plugins/angular-component/angular-ui-grid/ui-grid.min.css',
        'css/site.css'
    ];

    public $js = [
        'plugins/angular/angular.js',
        'plugins/angular/angular-touch.min.js',
        'plugins/angular-route/angular-route.min.js',
        'plugins/angular-sanitize/angular-sanitize.js',
        'plugins/angular-animate/angular-animate.min.js',
        'plugins/AngularJS-Toaster/toaster.js',
        'plugins/angular-strap/dist/angular-strap.js',
        'plugins/angular-strap/dist/angular-strap.tpl.min.js',
        'plugins/angular-component/angular-ui-bootstrap/angular-ui-bootstrap.js',
        'plugins/angular-component/angular-ui-grid/ui-grid.min.js',
        ['js/require.js', 'data-main' => '/al-haraki/client/web/js/main.js']
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
