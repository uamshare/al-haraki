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
            $rows = $post['rows'];
            
            if($post['jenis_tagihan'] == '1'){
                $result = $this->createMonthlyData($post, $rows);
            }else if($post['jenis_tagihan'] == '2'){
                $result = $this->createYearlyData($post, $rows);
            }

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

    private function createMonthlyData($post, $rows){
        $date = date('Y-m-d H:i:s');
        $model = new $this->modelClass;
        $rowsTagihan = [];
        $wherids = [];
        $attrlog = [];
        
        foreach($rows as $key => $row){
            if(is_array($row)){
                $wherids[$key] = $row['id'];
                $attrlog[$key] = $attrlog[$key] = $this->setRowaLogInfo($post, $row, $date);
                $rowsTagihan = array_merge($rowsTagihan, $this->setRowsTagihan($post, $row, $date));
            }
        }

        // var_dump($rowsTagihan);exit();
        return $model->insertBatch($post['jenis_tagihan'], $rowsTagihan, $attrlog, $wherids);
    }

    private function createYearlyData($post, $rows){
        $date = date('Y-m-d H:i:s');
        $model = new $this->modelClass;
        $rowsTagihan = [];
        $wherids = [];
        $attrlog = [];
        
        foreach($rows as $key => $row){
            if(is_array($row)){
                $wherids[$key] = $row['id'];
                $attrlog[$key] = $this->setRowaLogInfo($post, $row, $date);
                $rowsTagihan[] = [
                    'idrombel'              => $row['idrombel'],  
                    'keb_siswa_kredit'      => $row['keb_siswa'],
                    'ekskul_kredit'         => $row['ekskul'],  
                    'bulan'                 => 7, 
                    'tahun'                 => $post['year_start'],
                    'tahun_ajaran'          => $post['tahun_ajaran_id'],    
                    'no_ref'                => 'tagihan_info_2_' . $post['tahun_ajaran_id'],  
                    'ket_ref'               => 'Tagihan Info Tahunan idrombel = ' . $row['idrombel'],
                    'keterangan'            => '',   
                    'created_at'            => isset($row['created_at']) ? $row['created_at'] : $date,
                    'updated_at'            => $date,
                ];
            }
        }

        return $model->insertBatch($post['jenis_tagihan'], $rowsTagihan, $attrlog, $wherids);
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
                'spp_kredit'            => $row['spp'],
                'komite_sekolah_kredit' => $row['komite_sekolah'],
                'catering_kredit'       => $row['catering'],
                'bulan'                 => $month, 
                'tahun'                 => $year,
                'tahun_ajaran'          => $tahun_ajaran_id,    
                'no_ref'                => 'tagihan_info_1_' . $tahun_ajaran_id,  
                'ket_ref'               => 'Tagihan Info bulan ' . $month . ' idrombel = ' . $row['idrombel'],
                'keterangan'            => '',   
                'created_at'            => isset($row['created_at']) ? $row['created_at'] : $date,
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

    private function setRowaLogInfo($post, $row , $date){
        return [              
            'idrombel'              => $row['idrombel'],  
            'spp'                   => ($post['jenis_tagihan'] == '1') ? $row['spp'] : 0,              
            'komite_sekolah'        => ($post['jenis_tagihan'] == '1') ? $row['komite_sekolah'] : 0,
            'catering'              => ($post['jenis_tagihan'] == '1') ? $row['catering'] : 0,
            'keb_siswa'             => ($post['jenis_tagihan'] == '2') ? $row['keb_siswa'] : 0,
            'ekskul'                => ($post['jenis_tagihan'] == '2') ? $row['ekskul'] : 0,
            'tahun_ajaran_id'       => isset($row['tahun_ajaran_id']) ? $row['tahun_ajaran_id'] : '201617',
            'keterangan'            => $row['keterangan'],
            'jenis_tagihan'         => $post['jenis_tagihan'],
            'created_at'            => isset($row['created_at']) ? $row['created_at'] : $date,   
            'updated_at'            => $date,
            'created_by'            => isset($row['created_by']) ? $row['created_by'] : \Yii::$app->user->getId(),   
            'updated_by'            => \Yii::$app->user->getId(),
        ];
    }
    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        
        // $kls = $request->getQueryParam('kelasid', false);
        return $model->getListOutstanding([
            'kelasid' => $request->getQueryParam('kelasid', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'idrombel' => $request->getQueryParam('idrombel', false),
            'query' => $request->getQueryParam('query', false),
            'month' => $request->getQueryParam('month', -1),
            'year' => $request->getQueryParam('year', -1),
            'status' => $request->getQueryParam('status', 'all')
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
            'jenis_tagihan' => $request->getQueryParam('jenis_tagihan', '1'),
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