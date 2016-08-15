<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class SiswaController extends \yii\rest\ActiveController //\rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\Siswa';
}