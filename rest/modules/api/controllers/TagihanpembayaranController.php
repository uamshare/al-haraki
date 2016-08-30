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
                        'listbayar'  => ['get'],
                        'summary'  => ['get']
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
     * Get List input Info Tagihan
     *
     */
    public function actionSummaryouts(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        
        // $kls = $request->getQueryParam('kelasid', false);
        return $model->getSummaryOutsByTagihan([
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'date' => $request->getQueryParam('date', false)
        ])->One();
    }
}