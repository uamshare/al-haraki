<?php
namespace rest\modules\api\controllers;
use Yii;

class CashflowController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\Cashflow';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['index']);
        unset($actions['view']);
        unset($actions['delete']);
        return $actions;
    }

    /**
     *
     */
    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();

        return $model->getCashflow([
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'sekolahid' => $request->getQueryParam('sekolahid', false),
            'month' => $request->getQueryParam('month', date('m')),
            'year' => $request->getQueryParam('year', date('Y')),
            'mcoahno' => $request->getQueryParam('mcoahno', false)
        ]);
    }
}