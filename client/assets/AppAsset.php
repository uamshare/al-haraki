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
        'css/site.css',
        'plugins/angular/angular-csp.css',
        'plugins/angular-motion/dist/angular-motion.min.css',
        'plugins/AngularJS-Toaster/toaster.css'
    ];
    public $js = [
        'plugins/angular/angular.js',
        'plugins/angular-route/angular-route.min.js',
        'plugins/angular-sanitize/angular-sanitize.js',
        'plugins/angular-animate/angular-animate.min.js',
        'plugins/AngularJS-Toaster/toaster.js',
        'plugins/angular-strap/dist/angular-strap.js',
        'plugins/angular-strap/dist/angular-strap.tpl.min.js',
        'js/app.js'
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
