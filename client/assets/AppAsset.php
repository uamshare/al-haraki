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
        'plugins/angular-component/angular-ui-grid/ui-grid.min.css',
        'plugins/angular-toastr/angular-toastr.min.css',
        'plugins/angular-loading-bar-master/loading-bar.min.css',
        'plugins/ng-dialog/css/ngDialog.min.css',
        'plugins/ng-dialog/css/ngDialog-theme-default.min.css',
        'plugins/ng-dialog/css/ngDialog-theme-flat.css',
        'plugins/jQuery-File-Upload-9.12.5/jquery.fileupload.css',
        'plugins/ngWYSIWYG-master/editor.min.css',
        'css/print-style-2.css',
        'css/site.css'
    ];

    public $js = [
        'plugins/angular/angular.min.js',
        'plugins/angular/angular-touch.min.js',
        'plugins/angular-route/angular-route.min.js',
        'plugins/angular-animate/angular-animate.min.js',
        'plugins/angular-cookies/angular-cookies.min.js',
        'plugins/angular-toastr/angular-toastr.tpls.min.js',
        'plugins/angular-sanitize/angular-sanitize.min.js',
        'plugins/angular-strap/dist/angular-strap.min.js',
        'plugins/angular-strap/dist/angular-strap.tpl.min.js',
        'plugins/angular-loading-bar-master/loading-bar.min.js',

        // 'plugins/chartjs/Chart.min.js',
        // 'plugins/angular-chart/Chart.min.js',
        // 'plugins/angular-chart/angular-chart.js',
        'plugins/pdfmake/pdfmake.min.js',
        'plugins/pdfmake/vfs_fonts.js',
        'plugins/angular-component/angular-ui-grid/ui-grid.min.js',
        'plugins/ng-dialog/js/ngDialog.min.js',

        'plugins/ExcelPlus-master-2.4.1/sheetjs.all.min.js',
        'plugins/ExcelPlus-master-2.4.1/excelplus-2.4.1.min.js',

        'plugins/jQuery-File-Upload-9.12.5/jquery.ui.widget.js',
        'plugins/jQuery-File-Upload-9.12.5/jquery.fileupload.js',
        'plugins/jQuery-File-Upload-9.12.5/jquery.fileupload-process.js',
        'plugins/jQuery-File-Upload-9.12.5/jquery.fileupload-angular.js',

        'plugins/ngWYSIWYG-master/wysiwyg.min.js'
        
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];

    public function init(){
        $this->js = array_merge($this->js, [
            [
                'js/require.js', 
                'data-main' => '/al-haraki/client/web/js/main.js?v=' . date('Ymdhis')
            ],
            
        ]);

        parent::init();
    }
}
