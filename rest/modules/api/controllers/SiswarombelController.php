<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class SiswarombelController extends \yii\rest\ActiveController // \rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\SiswaRombel';

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
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $tahun_ajaran_id = '201617';
        $sekolahid = 2;
        return $model->getList([
            'query' => $request->getQueryParam('query', false),
            'nis' => $request->getQueryParam('nis', false),
            'nisn' => $request->getQueryParam('nisn', false),
            'nama_siswa' => $request->getQueryParam('nama_siswa', false),
            'kelas' => $request->getQueryParam('kelas', false),
            'nama_kelas' => $request->getQueryParam('nama_kelas', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', $tahun_ajaran_id),
            'sekolahid' => $request->getQueryParam('sekolahid', $sekolahid)
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