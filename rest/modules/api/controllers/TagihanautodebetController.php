<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class TagihanautodebetController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\TagihanAutodebetH';

    

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['delete']);
        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
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
    }
    
    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $date_start = $request->getQueryParam('date_start', false);
        $date_end = $request->getQueryParam('date_end', false);

        $query = $model->find()
                       ->orderBy(['tahun_ajaran_id' => SORT_DESC, 'no_transaksi' => SORT_DESC])
                       ->asArray();

        if($date_start && $date_end){
            $query->where(['between','tgl_transaksi', $date_start, $date_end]);
        }
        return $this->prepareDataProvider($query);
    }

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

    /**
     * Get List input Info Tagihan
     *
     */
    public function saveAndPosting($post){
        $this->response = Yii::$app->getResponse();
        $attrvalue = [];
        $pembayaran = [];
        $total = 0;
        extract($post);
        $date = date('Y-m-d H:i:s');
        $TahunAjaran = \rest\models\TahunAjaran::findOne('aktif = "1"');

        $form['sekolahid'] = isset($form['sekolahid']) ? $form['sekolahid'] : 0;
        $form['tahun_ajaran_id'] = isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id;
        $form['created_by'] = (isset($form['created_by']) && !empty($form['created_by'])) ? 
                                $form['created_by'] : \Yii::$app->user->getId();
        $form['updated_by'] = \Yii::$app->user->getId();

        $form['created_at'] = (isset($form['created_at']) && !empty($form['created_at'])) ? 
                                $form['created_at'] : $date;
        $form['updated_at'] = $date;

        foreach($grid as $k => $rows){
            $model = new $this->modelClass;
            $attrvalue[$k] = [
                'id'                    => isset($rows['id']) ? $rows['id'] : '', 
                'no_transaksi'          => isset($form['no_transaksi']) ? $form['no_transaksi'] : null,
                'idrombel'              => isset($rows['idrombel']) ? $rows['idrombel'] : null,        
                'nis'                   => isset($rows['nis']) ? $rows['nis'] : '',
                'nisn'                  => isset($rows['nisn']) ? $rows['nisn'] : '',
                'nama_siswa'            => isset($rows['nama_siswa']) ? $rows['nama_siswa'] : '',
                'no_rekening'           => isset($rows['no_rekening']) ? $rows['no_rekening'] : '',
                'nama_no_rekening'      => isset($rows['nama_no_rekening']) ? $rows['nama_no_rekening'] : '',
                'spp'                   => isset($rows['spp']) ? $rows['spp'] : 0,
                'komite_sekolah'        => isset($rows['komite_sekolah']) ? $rows['komite_sekolah'] : 0,
                'catering'              => isset($rows['catering']) ? $rows['catering'] : 0,
                'keb_siswa'             => isset($rows['keb_siswa']) ? $rows['keb_siswa'] : 0,
                'ekskul'                => isset($rows['ekskul']) ? $rows['ekskul'] : 0,
                'total'                 => isset($rows['total']) ? $rows['total'] : 0,
                'created_at'            => isset($rows['created_at']) ? $rows['created_at'] : $date,   
                'updated_at'            => $date
            ];
            $jumlah =   (int)$attrvalue[$k]['spp'] + 
                        (int)$attrvalue[$k]['komite_sekolah'] + 
                        (int)$attrvalue[$k]['catering'] + 
                        (int)$attrvalue[$k]['keb_siswa'] + 
                        (int)$attrvalue[$k]['ekskul'];

            $total += $jumlah;

            $pembayaran[$k] = [
                'idrombel' => $attrvalue[$k]['idrombel'],
                'spp_debet' => $attrvalue[$k]['spp'],
                'komite_sekolah_debet' => $attrvalue[$k]['komite_sekolah'],
                'catering_debet' => $attrvalue[$k]['catering'],
                'keb_siswa_debet' => $attrvalue[$k]['keb_siswa'],
                'ekskul_debet' => $attrvalue[$k]['ekskul'],
                'bulan' => $form['bulan'],
                'tahun' => $form['tahun'],
                'tahun_ajaran' => $form['tahun_ajaran_id'],
                'no_ref' => $form['no_transaksi'],
                'ket_ref' => $form['keterangan'],
                'created_at' => isset($form['created_at']) ? $form['created_at'] : $date,   
                'updated_at' => $date
            ];
        }

        // Set posting value
        $postingValue = [
            'date'                 => $form['tgl_transaksi'],
            'noref'                => $form['no_transaksi'],        
            'value'                => $total,
            'description'          => 'Transaksi Autodebet NO . ' . $form['no_transaksi'],
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
                'message' => 'No Transaksi can\'t be empty'
            ];
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionNewnotransaksi(){
        $model = new $this->modelClass();
        $post = Yii::$app->getRequest()->getBodyParams();
        $sekolahid = (isset($post['sekolahid'])) ? $post['sekolahid'] : 0;

        return $model->getNewNoTransaksi(date('y'), $sekolahid);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionFindbyno(){
        $model = new \rest\models\TagihanAutodebetD();
        $request = Yii::$app->getRequest();
        return $model->findByNo([
            'query' => $request->getQueryParam('query', false),
            'no_transaksi' => $request->getQueryParam('no_transaksi', false),
            'nis' => $request->getQueryParam('nis', false),
            'nisn' => $request->getQueryParam('nisn', false),
            'nama_siswa' => $request->getQueryParam('nama_siswa', false),
            'kelasid' => $request->getQueryParam('kelasid', false),
            'kelas' => $request->getQueryParam('kelas', false),
            'nama_kelas' => $request->getQueryParam('nama_kelas', false)
        ]);
    }


}