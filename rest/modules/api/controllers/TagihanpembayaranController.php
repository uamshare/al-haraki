<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class TagihanpembayaranController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController // 
{
    public $modelClass = 'rest\models\TagihanPembayaran';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'listbayar'  => ['get']
                    ],
                ],
            ]
        );
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListbayar(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        
        // $kls = $request->getQueryParam('kelasid', false);
        return $model->getListPembayaran([
            'kelasid' => $request->getQueryParam('kelasid', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'idrombel' => $request->getQueryParam('idrombel', false),
            'query' => $request->getQueryParam('query', false),
            'month' => $request->getQueryParam('month', false),
            'year' => $request->getQueryParam('year', false),
            'date_start' => $request->getQueryParam('date_start', false),
            'date_end' => $request->getQueryParam('date_end', false),
            'status' => $request->getQueryParam('status', 'all')
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