<?php
namespace rest\modules\api\controllers;

use Yii;
use yii\data\ActiveDataProvider;

class PegawaiController extends \yii\rest\ActiveController //\rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\Pegawai';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'list'  => ['get'],
                    ],
                ],
            ]
        );
    }

    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $this->prepareDataProvider($model->getList([
            'id' => $request->getQueryParam('id', false),
            'nik' => $request->getQueryParam('nik', false),
            'nuptk' => $request->getQueryParam('nuptk', false),
            'nama_pegawai' => $request->getQueryParam('nama_pegawai', false),
            'nama_panggilan' => $request->getQueryParam('nama_panggilan', false),
            'sekolahid' => $request->getQueryParam('sekolahid', ''),
            'query' => $request->getQueryParam('query', false)
        ]));
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