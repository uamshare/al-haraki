<?php
use yii\helpers\Html;

/* @var $this \yii\web\View */
/* @var $content string */
?>

<header class="main-header" ng-controller="NavbarController">
    <?= Html::a('<span class="logo-mini">APP</span><span class="logo-lg">' . Yii::$app->name . 
        '</span>', Yii::$app->homeUrl . '#/', ['class' => 'logo']) ?>

    <nav class="navbar navbar-static-top" role="navigation">

        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
        </a>
        <div class="navbar-brand">
            <span ng-hide="profile.sekolahid == 0">{{sekolahProfile.nama_sekolah}}</span>
            <select ng-hide="profile.sekolahid != 0" name="sekolahid" class="form-control" 
                ng-model="sekolahid_selected" 
                ng-change="onSekolahidChange(sekolahid_selected)"
                ng-options="i.id as (i.id + ' - ' + i.nama) for i in sekolahList">
                <option></option>
            </select>
        </div>
        <div class="navbar-brand">
            <select class="form-control" 
                ng-model="tahunid_selected" 
                ng-change="onTahunidChange(tahunid_selected)"
                ng-options="i.id as (i.tahun_ajaran) for i in tahunList">
                <option></option>
            </select>
        </div>
        
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <!-- User Account: style can be found in dropdown.less -->
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img ng-src="{{profile.avatar}}" class="user-image" alt="User Image"/>
                        <span class="hidden-xs">{{profile.fullname}}</span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img ng-src="{{profile.avatar}}" class="img-circle"  alt="User Image"/>
                            <p>
                                {{profile.fullname}}
                                <small>{{profile.jabatan}}</small>
                            </p>
                        </li>
                        <!-- Menu Footer-->
                        <li class="user-footer">
                            <div class="pull-left">
                                <a href="#/profile" class="btn btn-default btn-flat"><i class="fa fa-user"></i> Profile</a>
                            </div>
                            <div class="pull-right">
                                <button class="btn btn-danger btn-flat" ng-click="loginOrOut()">
                                    <i class="fa fa-lock"></i> Logout
                                </button>
                            </div>
                        </li>
                    </ul>
                </li>
                <!-- User Account: style can be found in dropdown.less -->
            </ul>
        </div>
    </nav>
</header>
