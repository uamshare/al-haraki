<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class McoadController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\Mcoad';

    public function actions()
    {
        $actions = parent::actions();
        // unset($actions['create']);
        // unset($actions['update']);
        // unset($actions['delete']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $this->prepareDataProvider($model->getList([
            'id' => $request->getQueryParam('id', false),
            'mcoadnno' => $request->getQueryParam('mcoadnno', false),
            'mcoadname' => $request->getQueryParam('mcoadname', false),
            'query' => $request->getQueryParam('query', false)
        ]));
    }

    public function actionView($id){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();

        return $this->prepareDataProvider($model->getList($id));
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $model->getList([
            'query' => $request->getQueryParam('query', false),
            'mcoadno' => $request->getQueryParam('mcoadno', false),
            'mcoahno' => $request->getQueryParam('mcoahno', false),
            'mcoadname' => $request->getQueryParam('mcoadname', false)
        ])->All();
    }
}