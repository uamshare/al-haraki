<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class UserController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController
{
    public $modelClass = 'rest\models\User';

    /**
     * Sample custome Action 
     *
     */
    public function actionCustome(){
        return [
            'success' => true,
            'message' => 'custome action'
        ];
    }
}