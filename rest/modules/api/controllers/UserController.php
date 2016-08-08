<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class UserController extends \yii\rest\ActiveController //\yii\redis\ActiveRecord // \rest\modules\api\ActiveController //
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