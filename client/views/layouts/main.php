<?php
use yii\helpers\Html;

dmstr\web\AdminLteAsset::register($this);
    
    if (class_exists('client\assets\AppAsset')) {
        client\assets\AppAsset::register($this);
    } else {
        app\assets\AppAsset::register($this);
    }

    $directoryAsset = Yii::$app->assetManager->getPublishedUrl('@vendor/almasaeed2010/adminlte/dist');
    ?>
    <?php $this->beginPage() ?>
    <!DOCTYPE html>
    <html lang="<?= Yii::$app->language ?>" >
    <head>
        <meta charset="<?= Yii::$app->charset ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" href="<?php echo \Yii\helpers\BaseUrl::base();?>/img/logo-16.png">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>

        <script type="text/javascript">
            var BASEURL = '<?php echo \Yii\helpers\BaseUrl::base();?>/';//'http://local.project/al-haraki/client/web/';
            var BASEAPIURL = 'http://local.project/al-haraki/rest/web/api/';
        </script>
        <?php $this->head() ?>
    </head>
    <body class="ng-cloak hold-transition sidebar-mini <?= \dmstr\helpers\AdminLteHelper::skinClass() ?>"> 
    <!-- <body class=""> -->
    
    <?php $this->beginBody() ?>
    <div class="wrapper">

        <?= $this->render(
            'header.php',
            ['directoryAsset' => $directoryAsset]
        ) ?>

        <?= $this->render(
            'left.php',
            ['directoryAsset' => $directoryAsset]
        )
        ?>

        <?= $this->render(
            'content.php',
            ['content' => $content, 'directoryAsset' => $directoryAsset]
        ) ?>

    </div>

    <?php $this->endBody() ?>
    </body>
    </html>
    <?php $this->endPage() ?>
