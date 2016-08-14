<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class KwitansipembayarandController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\KwitansiPembayaranD';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbs' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'index'  => ['get'],
                        'newnokwitansi'   => ['get'],
                        'create' => ['put', 'post'],
                        // 'update' => ['get', 'put', 'post'],
                        // 'delete' => ['delete'],
                    ],
                ],
            ]
        );
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionFindbyno(){
    	$model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $model->findByNo([
            'no_kwitansi' => $request->getQueryParam('no_kwitansi', false)
        ]);
    }

    /**
     * Prepares the data provider that should return the requested collection of the models.
     * @return ActiveDataProvider
     */
    protected function prepareDataProvider($query)
    {
        $request = Yii::$app->getRequest();
        $perpage = $request->getQueryParam('per-page', 20);
        $pagination = [
            'pageSize' => $perpage
        ];

        return new ActiveDataProvider([
            'query' => $query,
            'pagination' => ($perpage > 0) ? $pagination : false
        ]);
    }
}