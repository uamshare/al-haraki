<?php
namespace rest\modules\api\controllers;
use Yii;

class SiswarombelController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController // 
{
    public $modelClass = 'rest\models\SiswaRombel';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        // unset($actions['update']);
        unset($actions['delete']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', false);
        $tahun_ajaran_id = $request->getQueryParam('tahun_ajaran_id', false);
        $kelasid = $request->getQueryParam('kelasid', false);
        $scenario = $request->getQueryParam('scenario', false);

        // var_dump($scenario);exit();
        if($scenario && $scenario == '1'){
            return $this->getAllInfoSiswa([
                'kelasid' => $request->getQueryParam('kelasid', false),
                'sekolahid' => $request->getQueryParam('sekolahid', $sekolahid),
                'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', $tahun_ajaran_id),
            ]);
        }else{
            $query = $model->find()
                           ->select([
                                'a.`id`',
                                'a.`siswaid`',
                                'b.`nis`',
                                'b.`nisn`',
                                'b.`nama_siswa`',
                                'a.`kelasid`',
                                'c.kelas',
                                'c.`nama_kelas`',
                                'b.`sekolahid`',
                                'a.`tahun_ajaran_id`',
                                'a.`created_at`',
                                'a.`updated_at`'
                            ])
                           ->from('siswa_rombel a')
                           ->innerJoin('siswa b', 'a.`siswaid` = b.`id`')
                           ->leftJoin('kelas c', 'a.`kelasid` = c.`id`')
                           ->where('1=1')
                           ->asArray();
            if($sekolahid){
                $query->andWhere(['b.sekolahid' => $sekolahid]);
            }
            if($kelasid){
                $query->andWhere(['a.kelasid' => $kelasid]);
            }
            if($tahun_ajaran_id){
                $query->andWhere(['a.tahun_ajaran_id' => $tahun_ajaran_id]);
            }

            $query->orderBy([
                'b.`sekolahid`' => SORT_ASC,
                'a.`kelasid`' => SORT_ASC, 
                'b.`nama_siswa`' => SORT_ASC, 
                'b.`nis`' => SORT_ASC
            ]);
            if($scenario && $scenario == 'rombel_old'){
                $query->leftJoin("(SELECT siswaid FROM siswa_rombel WHERE `tahun_ajaran_id`='201718') sr", 'a.siswaid = sr.`siswaid`')
                    ->andWhere(['IS', 'sr.`siswaid`', new \yii\db\Expression('Null')])
                    ->orderBy([
                        '`sekolahid`' => SORT_ASC,
                        '`kelasid`' => SORT_ASC, 
                        '`nama_siswa`' => SORT_ASC, 
                        '`nis`' => SORT_ASC
                    ]);
                $query = $this->unionWithNewSiswa($query);
            }

            // var_dump($query->createCommand()->rawSql);exit();
            return $this->prepareDataProvider($query);
        }
    }
    
    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $tahun_ajaran_id = '';
        $sekolahid = 0;
        $scenario =  $request->getQueryParam('scenario', false);

        
        if($scenario && $scenario =='1'){ // scenari that include all information siwa
            return $this->getAllInfoSiswa([
                'kelasid' => $request->getQueryParam('kelasid', false),
                'sekolahid' => $request->getQueryParam('sekolahid', $sekolahid),
                'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', $tahun_ajaran_id),
            ]);
        }else{
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
        
    }

    private function getAllInfoSiswa($params){
        extract($params);
        $model = new $this->modelClass();
        $query = $model->find()
                       ->select([
                            'a.`id`',
                            'a.`siswaid`',
                            'a.`kelasid`',
                            'c.kelas',
                            'c.`nama_kelas`',
                            'b.nis',
                            'nisn',
                            'nama_siswa',
                            'nama_panggilan',
                            'jk',
                            'asal_sekolah',
                            'tempat_lahir',
                            'tanggal_lahir',
                            'anak_ke',
                            'jml_saudara',
                            'berat',
                            'tinggi',
                            'gol_darah',
                            'riwayat_kesehatan',
                            'alamat',
                            'kelurahan',
                            'kecamatan',
                            'kota',
                            'kodepos',
                            'tlp_rumah',
                            'nama_ayah',
                            'hp_ayah',
                            'pekerjaan_ayah',
                            'tempat_kerja_ayah',
                            'jabatan_ayah',
                            'pendidikan_ayah',
                            'email_ayah',
                            'nama_ibu',
                            'hp_ibu',
                            'pekerjaan_ibu',
                            'tempat_kerja_ibu',
                            'jabatan_ibu',
                            'pendidikan_ibu',
                            'email_ibu',
                            'jenis_tempat_tinggal',
                            'jarak_ke_sekolah',
                            'sarana_transportasi',
                            'keterangan',
                            'b.`sekolahid`',
                            'a.`tahun_ajaran_id`',
                            'a.`created_at`',
                            'a.`updated_at`'
                        ])
                       ->from('siswa_rombel a')
                       ->innerJoin('siswa b', 'a.`siswaid` = b.`id`')
                       ->leftJoin('kelas c', 'a.`kelasid` = c.`id`')
                       ->where('1=1')
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['b.sekolahid' => $sekolahid]);
        }
        if($kelasid){
            $query->andWhere(['a.kelasid' => $kelasid]);
        }
        if($tahun_ajaran_id){
            $query->andWhere(['a.tahun_ajaran_id' => $tahun_ajaran_id]);
        }

        $query->orderBy([
            'b.`sekolahid`' => SORT_ASC,
            'a.`kelasid`' => SORT_ASC, 
            'b.`nama_siswa`' => SORT_ASC, 
            'b.`nis`' => SORT_ASC
        ]);

        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
    }

    /**
     * Insert / Update SiswRombel
     *
     */
    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        // var_dump($post);exit();
        if($post){
            extract($post);
            $attrvalue = [];
            $date = date('Y-m-d H:i:s');
            
            foreach($rombels as $k => $rows){
                $attrvalue[] = [
                    'id'                => '', //isset($rows['id']) ? $rows['id'] : '', 
                    'siswaid'           => isset($rows['siswaid']) ? $rows['siswaid'] : null,
                    'kelasid'           => isset($kelasid) ? $kelasid : null,        
                    'tahun_ajaran_id'   => isset($tahun_ajaran_id) ? $tahun_ajaran_id : null,
                    'created_at'        => isset($rows['created_at']) && !empty($rows['created_at']) ? 
                                                $rows['created_at'] : $date,   
                    'updated_at'        => $date
                ];
            }

            // var_dump($attrvalue);exit();
            $model = new $this->modelClass;
            $result = $model->batchInsert([
                'rows' => $attrvalue,
                'sekolahid' => $sekolahid
            ]);
            
            if($result !== true){
                Yii::$app->getResponse()->setStatusCode(422, 'Data Validation Failed.');
            }else{
                Yii::$app->getResponse()->setStatusCode(201, 'Created.');
            }
            return $result;
        }else{
            Yii::$app->getResponse()->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }     
    }

     /**
     * Delete SiswRombel
     * $scenario, [1 = delete rombel by selection]
     */
    public function actionDelete($id){
        $scenario = \Yii::$app->getRequest()->getQueryParam('scenario', false);
        $rombelid = \Yii::$app->getRequest()->getQueryParam('rombelid', false);
        
        if($scenario && $scenario == '1' && $rombelid){

            $id = explode(',', $rombelid);

            // $model = $this->modelClass;
            $del = \rest\models\SiswaRombel::deleteAll(['in', 'id', $id]);

            if ( $del === false ) {
                throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
            }

            Yii::$app->getResponse()->setStatusCode(200, 'OK');
            return ['message' => 'data is deleted'];
        }

        if($id && !empty($id) && $id != 'undefined' && !$scenario){
            $model = $this->modelClass;
            $model = $model::findOne($id);

            if($model){
                try{
                    $del = $model->delete();
                } catch(\Exception $e) {
                    // var_dump($e->errorInfo);exit();
                    if(isset($e->errorInfo[0])){
                        switch ($e->errorInfo[0]) {
                            case '23000':
                                $del = $model->deleteWithAllForeignKeys();
                                if($del === true){
                                    Yii::$app->getResponse()->setStatusCode(200, 'OK');
                                    return [
                                        'data' => $model,
                                        'scenario' => 'confirm_delete_keep',
                                        'message' => 'data is deleted',
                                        'errorInfo' => $e,
                                        'result' => $del
                                    ];
                                }else{
                                    Yii::$app->getResponse()->setStatusCode(422, 'Data Validation Failed.');
                                    return $del;
                                }
                                
                                break;
                            default:
                                $del = false;
                                break;
                        }
                    }
                }
                
                if ($del === true) {
                    // throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
                    Yii::$app->getResponse()->setStatusCode(200, 'OK');
                    return ['message' => 'data is deleted'];
                }else{
                    Yii::$app->getResponse()->setStatusCode(422, 'Data Validation Failed.');
                    return $del;
                }
            }
            
        }

        Yii::$app->getResponse()->setStatusCode(400, 'Data is empty.');
        return [
            'message' => 'ID can\'t be empty'
        ];
    }

     /**
     * Delete all data
     * @param $params, Array parameter
     * 
     */
    private function deleteRombelBySelection($params){
        
    }

    private function unionWithNewSiswa($query){
        $query2 = (new \yii\db\Query())
        ->select([
            '"" AS `id`',
            's.id AS `siswaid`',
            's.`nis`',
            's.`nisn`',
            's.`nama_siswa`',
            '0 AS `kelasid`',
            '0 AS `kelas`',
            '"Siswa Baru" AS `nama_kelas`',
            '"1" AS `sekolahid`',
            '"201516" AS `tahun_ajaran_id`',
            '"" AS `created_at`',
            '"" AS `updated_at`'
        ])
        ->from('siswa s')
        ->leftJoin('siswa_rombel sr', 's.id = sr.`siswaid`')
        ->where(['IS', 'sr.`siswaid`', new \yii\db\Expression('Null')]);

        return $query2->union($query);
    }

    
}