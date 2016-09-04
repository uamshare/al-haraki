<?php
namespace rest\modules\api\controllers;

use Yii;

class KwitansipembayaranController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\KwitansiPembayaranH';
    public $checkAccess = true;

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);
        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors = array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'index'         => ['get'],
                        'newnokwitansi' => ['get'],
                        'findbyno'      => ['get'],
                        'create'        => ['post'],
                        'update'        => ['put'],
                        'delete'        => ['delete'],
                    ],
                ],
            ]
        );
        // var_dump($behaviors);exit();
        return $behaviors;
    }
    
    

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $date_start = $request->getQueryParam('date_start', false);
        $date_end = $request->getQueryParam('date_end', false);

        $query = $model->find()
                       ->orderBy(['tahun_ajaran_id' => SORT_DESC,'no_kwitansi' => SORT_DESC])
                       ->asArray();

        if($date_start && $date_end){
            $query->where(['between','tgl_kwitansi', $date_start, $date_end]);
        }
        return $this->prepareDataProvider($query);
    }


    /**
     * Get List input Info Tagihan
     *
     */
    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            return $this->saveAndPosting($post);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
        
    }

    public function actionUpdate($id){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            return $this->saveAndPosting($post);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    private function saveAndPosting($post){
        $this->response = Yii::$app->getResponse();
        $attrvalue = [];
        $flagdelete = [];
        $total = 0;
        extract($post);
        $date = date('Y-m-d H:i:s');
        $TahunAjaran = \rest\models\TahunAjaran::findOne(['aktif' => '1']);

        if($form['sumber_kwitansi'] == 1){
            $pembayaran = [
                'idrombel' => $form['idrombel'],
                'spp_debet' => 0,
                'komite_sekolah_debet' => 0,
                'catering_debet' => 0,
                'keb_siswa_debet' => 0,
                'ekskul_debet' => 0,
                'bulan' => $form['month'],
                'tahun' => $form['year'],
                'tahun_ajaran' => isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id,
                'no_ref' => $form['no_kwitansi'],
                'ket_ref' => $form['keterangan'],
                'created_at' => isset($form['created_at']) ? $form['created_at'] : $date,   
                'updated_at' => $date
            ];
        }else{
            $pembayaran = false;
        }

        foreach($grid as $k => $rows){
            $model = new $this->modelClass;
            if($rows['flag'] == '1'){
                $attrvalue[] = [
                    'id'                    => isset($rows['id']) ? $rows['id'] : '', 
                    'no_kwitansi'           => isset($form['no_kwitansi']) ? $form['no_kwitansi'] : null,
                    'kode'                  => isset($rows['kode']) ? $rows['kode'] : null,        
                    'rincian'               => isset($rows['rincian']) ? $rows['rincian'] : null,
                    'jumlah'                => isset($rows['jumlah']) ? $rows['jumlah'] : 0,
                    'created_at'            => isset($rows['created_at']) ? $rows['created_at'] : $date,   
                    'updated_at'            => $date
                ];
                $total += isset($rows['jumlah']) ? (int)$rows['jumlah'] : 0;

            }else if($rows['flag'] == '0'){
                $flagdelete[] = $rows['id'];
            }

            
            if($pembayaran && isset($pembayaran[$rows['kode'].'_debet'])){
                $pembayaran[$rows['kode'].'_debet'] = ($rows['flag'] == 1) ? $rows['jumlah'] : 0;
            }
        }

        $form['sekolahid'] = isset($form['sekolahid']) ? $form['sekolahid'] : 0;
        $form['tahun_ajaran_id'] = isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id;
        $form['created_by'] = isset($form['created_by']) ? $form['created_by'] : \Yii::$app->user->getId();
        $form['updated_by'] = \Yii::$app->user->getId();
        $form['created_at'] = isset($form['created_at']) ? $form['created_at'] : $date;
        $form['updated_at'] = $date;

        unset($form['nama_siswa']);
        unset($form['kelas']);
        $form['bulan'] = $form['month'];
        $form['tahun'] = $form['year'];
        unset($form['month']);
        unset($form['year']);

        // Set posting value
        $postingValue = [
            'date'                 => $form['tgl_kwitansi'],
            'noref'                => $form['no_kwitansi'],        
            'value'                => $total,
            'description'          => 'Transaksi Kwitansi Pembayaran NO . ' . $form['no_kwitansi'],
            'sekolahid'            => $form['sekolahid'],
            'tahun_ajaran_id'      => $form['tahun_ajaran_id'],
            'created_at'           => $form['created_at'],   
            'updated_at'           => $form['updated_at'],
            'created_by'           => $form['created_by'],   
            'updated_by'           => $form['updated_by']
        ];

        $result = $model->saveAndPosting([
            'rowHeader' => $form,
            'rowDetail' => $attrvalue,
            'rowDetailDel' => $flagdelete,
            'rowPembayaran' => $pembayaran,
            'postingValue' => $postingValue
        ]);
        
        if($result !== true){
            $this->response->setStatusCode(422, 'Data Validation Failed.');
        }else{
            $this->response->setStatusCode(201, 'Created.');
        }
        return $result;
    }

    public function actionDelete($id){
        $this->response = Yii::$app->getResponse();
        if($id && !empty($id) && $id != 'undefined'){
            $model = new $this->modelClass;
            $result = $model->deleteAndRemoveAll($id);
            if($result !== true){
                $this->response->setStatusCode(422, 'Data Validation Failed.');
            }else{
                // $this->response->setStatusCode(200, 'Created.');
            }
            return $result;
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'No Kwitansi can\'t be empty'
            ];
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionNewnokwitansi(){
        $model = new $this->modelClass();
        // $sekolahid = 2;
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', 0);
        return $model->getNewNOKwitansi(date('y'), $sekolahid);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionFindbyno(){
        $model = new \rest\models\KwitansiPembayaranD;
        $request = Yii::$app->getRequest();
        return $model->findByNo([
            'no_kwitansi' => $request->getQueryParam('no_kwitansi', ''),
            'query' => $request->getQueryParam('query', false)
        ]);
    }
}