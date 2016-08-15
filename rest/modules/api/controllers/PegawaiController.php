<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class PegawaiController extends \yii\rest\ActiveController //\rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\Pegawai';
}