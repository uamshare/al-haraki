<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class TagihaninfoinputController extends \yii\rest\ActiveController // \rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\TagihanInfoInput';

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

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['view']);
        unset($actions['index']);

        return $actions;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionCreate(){
        $this->response = Yii::$app->getResponse();
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            $date = date('Y-m-d H:i:s');
            $model = new $this->modelClass;
            $wherids = [];
            $rows = $post['rows'];
            $rowsTagihan = [];

            foreach($rows as $key => $row){
                if(is_array($row)){
                    $wherids[$key] = $row['id'];
                    $attrlog[$key] = [              
                        'idrombel'              => $row['idrombel'],  
                        'spp'                   => $row['spp'],                
                        'komite_sekolah'        => $row['komite_sekolah'],
                        'catering'              => $row['catering'], 
                        'keb_siswa'             => $row['keb_siswa'],
                        'ekskul'                => $row['ekskul'],
                        'tahun_ajaran_id'       => isset($row['tahun_ajaran_id']) ? $row['tahun_ajaran_id'] : '201617',
                        'keterangan'            => $row['keterangan'],
                        'created_at'            => $date,   
                        'updated_at'            => $date,
                    ];
                    $rowsTagihan = array_merge($rowsTagihan, $this->setRowsTagihan($post, $row, $date));
                }
            }

            // var_dump($rowsTagihan);exit();
            $result = $model->insertBatch($rowsTagihan, $attrlog, $wherids);
            if($result !== true){
                $this->response->setStatusCode(422, 'Data Validation Failed.');
            }else{
                $this->response->setStatusCode(201, 'Created.');
            }
            return $result;
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    private function setRowsTagihan($post, $row, $date){
        $attrvalue = [];
        extract($post);
        $i = (int)$month_start + ((int)$year_start * 12);
        $count = (int)$month_end + ((int)$year_end * 12);
        $month = (int)$month_start;
        $year = (int)$year_start;

        for($i; $i <= $count; $i++){
            $attrvalue[] = [              
                'idrombel'              => $row['idrombel'],  
                'spp_debet'             => 0,                 
                'spp_kredit'            => $row['spp'],
                'komite_sekolah_debet'  => 0, 
                'komite_sekolah_kredit' => $row['komite_sekolah'],
                'catering_debet'        => 0, 
                'catering_kredit'       => $row['catering'],
                'keb_siswa_debet'       => 0, 
                'keb_siswa_kredit'      => $row['keb_siswa'],
                'ekskul_debet'          => 0, 
                'ekskul_kredit'         => $row['ekskul'],  
                'bulan'                 => $month, 
                'tahun'                 => $year,
                'tahun_ajaran'          => '201617',    
                'no_ref'                => 'tagihan_info_' . isset($row['tahun_ajaran_id']) ? $row['tahun_ajaran_id'] 
                                                : '201617',  
                'ket_ref'               => 'Tagihan Info idrombel = ' . $row['idrombel'],
                'keterangan'            => '',   
                'created_at'            => $date,   
                'updated_at'            => $date,
            ];
            if($month == 12){
                $month = 1;
                $year = (int)$year_end;
            }else{
                $month++;
            }
        }
        return $attrvalue;
    }
    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $model->getListOutstanding([
            'kelasid' => $request->getQueryParam('kelasid', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'idrombel' => $request->getQueryParam('idrombel', false),
            'query' => $request->getQueryParam('query', false),
            'month' => $request->getQueryParam('month', -1),
            'year' => $request->getQueryParam('year', -1)
        ]);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListinfo(){
        $model = new \rest\models\TagihanInfoInputLog;
        $request = Yii::$app->getRequest();
        return $model->getListActive([
            'kelasid' => $request->getQueryParam('kelasid', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', '201617'),
            'idrombel' => $request->getQueryParam('idrombel', false),
            'query' => $request->getQueryParam('query', false)
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