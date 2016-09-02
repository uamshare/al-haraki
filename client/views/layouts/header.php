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
            <span ng-hide="profil.sekolahid == 0">{{sekolahProfile.nama_sekolah}}</span>
            <select ng-hide="profil.sekolahid != 0" name="sekolahid" class="form-control" 
                ng-model="sekolahid_selected" 
                ng-change="onSekolahidChange(sekolahid_selected)" >
                <option value="1">1 - SDIT AL Haraki</option>
                <option value="2">2 - SMPIT AL Haraki</option>
            </select>
        </div>
        
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <!-- User Account: style can be found in dropdown.less -->
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img src="<?= Yii::$app->homeUrl ?>/img/profil/user-default.png" class="user-image" alt="User Image"/>
                        <span class="hidden-xs">{{profil.fullname}}</span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img src="<?= Yii::$app->homeUrl ?>/img/profil/user-default.png" class="img-circle"
                                 alt="User Image"/>

                            <p>
                                {{profil.fullname}}
                                <small>{{profil.jabatan}}</small>
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
