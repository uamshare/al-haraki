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

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $date_start = $request->getQueryParam('date_start', false);
        $date_end = $request->getQueryParam('date_end', false);
        $sumber_kwitansi = $request->getQueryParam('sumber_kwitansi', 'all');
        $sekolahid = $request->getQueryParam('sekolahid', false);

        $query = $model->find()
                       ->select('h.*,s.nama_siswa,sr.kelasid,s.nis,k.kelas,k.nama_kelas')
                       ->from('kwitansi_pembayaran_h h')
                       ->leftJoin('siswa_rombel sr', 'sr.`id` = `h`.`idrombel`')
                       ->leftJoin('siswa s', 's.`id` = sr.`siswaid`')
                       ->leftJoin('kelas k', 'sr.`kelasid` = `k`.`id`')
                       ->with('details')
                       ->where('1=1')
                       ->orderBy(['h.tahun_ajaran_id' => SORT_DESC,'no_kwitansi' => SORT_DESC])
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['h.sekolahid' => $sekolahid]);
        }
        if($date_start && $date_end){
            $query->andWhere(['between','tgl_kwitansi', $date_start, $date_end]);
        }
        if($sumber_kwitansi != 'all'){
            if($sumber_kwitansi == '0'){
                $query->andWhere(['<>','sumber_kwitansi','1']);
            }else{
                $query->andWhere(['sumber_kwitansi' => $sumber_kwitansi]);
            }
        }
        // echo $query->createCommand()->rawSql;exit();
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
            return $this->saveAndPosting($post, $id);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    private function saveAndPosting($post, $id = false){
        $this->response = Yii::$app->getResponse();
        $attrvalue = [];
        $flagdelete = [];
        $total = 0;
        $tagihanvalue = [];
        extract($post);
        $date = date('Y-m-d H:i:s');

        if(!isset($form['idrombel']) || empty($form['idrombel'])){
            $form['idrombel'] = $this->addNewRombel($form['siswaid'], $form['kelasid'], $form['tahun_ajaran_id']);
        }

        $form['sekolahid'] = isset($form['sekolahid']) ? $form['sekolahid'] : 0;
        
        if($id == false){
            $modelK = new $this->modelClass();
            $form['no_kwitansi'] = $modelK->getNewNOKwitansi(date('y'), $form['sekolahid']);
        }        
        

        $TahunAjaran = \rest\models\TahunAjaran::findOne(['aktif' => '1']);
        
        // $_tgl_kwitansi = explode('T', $form['tgl_kwitansi']);
        // $form['tgl_kwitansi'] = $_tgl_kwitansi[0];

        if($form['sumber_kwitansi'] == 1){
            $bulanTagihan = $form['month']; //explode(',', $form['month']);
            $pembayaran = [];
            // $tahunAjaran = \rest\models\TahunAjaran::getActive();
            $tahunAjaran = \rest\models\TahunAjaran::getById($form['tahun_ajaran_id']);
            
            foreach ($bulanTagihan as $bln) {
                if($bln >= 7 && $bln <= 12 ){
                    $year = $tahunAjaran->tahun_awal;
                }else{
                    $year = $tahunAjaran->tahun_akhir;
                }
                
                $outtp = \rest\models\TagihanPembayaran::find()
                        ->select([
                            '`id`',
                            '`idrombel`',
                            'SUM(`spp_debet`) AS `spp_debet`',
                            'SUM(`spp_kredit`) AS `spp_kredit`',
                            'SUM(`komite_sekolah_debet`) AS `komite_sekolah_debet`',
                            'SUM(`komite_sekolah_kredit`) AS `komite_sekolah_kredit`',
                            'SUM(`catering_debet`) AS `catering_debet`',
                            'SUM(`catering_kredit`) AS `catering_kredit`',
                            'SUM(`keb_siswa_debet`) AS `keb_siswa_debet`',
                            'SUM(`keb_siswa_kredit`) AS `keb_siswa_kredit`',
                            'SUM(`ekskul_debet`) AS `ekskul_debet`',
                            'SUM(`ekskul_kredit`) AS `ekskul_kredit`',
                            '`bulan`',
                            '`tahun`',
                            '`tahun_ajaran`',
                            '`no_ref`',
                            '`ket_ref`',
                            '`keterangan`',
                            '`created_at`',
                            '`updated_at`',
                            '`tgl_ref`'
                        ])
                        ->where([
                            'idrombel' => $form['idrombel'],
                            'bulan' => $bln,
                            'tahun' => $year
                        ])
                        ->andWhere(['<>','no_ref', $form['no_kwitansi']])
                        ->groupBy('idrombel')
                // echo $outtp->createCommand()->rawSql;exit();
                        ->One();

                $pembayaran[] = [
                    'idrombel' => $form['idrombel'],
                    'spp_debet' => ($outtp) ? ($outtp->spp_kredit - $outtp->spp_debet) : 0,
                    'komite_sekolah_debet' => ($outtp) ? ($outtp->komite_sekolah_kredit - $outtp->komite_sekolah_debet) 
                                                : 0,
                    'catering_debet' => ($outtp) ? ($outtp->catering_kredit - $outtp->catering_debet) : 0,
                    'keb_siswa_debet' => ($outtp) ? $outtp->keb_siswa_kredit : 0,
                    'ekskul_debet' => ($outtp) ? $outtp->ekskul_kredit : 0,
                    'bulan' => $bln,
                    'tahun' => $year,
                    'tahun_ajaran' => isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id,
                    'no_ref' => $form['no_kwitansi'],
                    'tgl_ref' => $form['tgl_kwitansi'],
                    'ket_ref' => $form['keterangan'],
                    'created_at' => isset($form['created_at']) ? $form['created_at'] : $date,   
                    'updated_at' => $date
                ];
            }
            
        }else{
            $pembayaran = false;
        }

        foreach($grid as $k => $rows){
            if($rows['flag'] == '1'){
                $attrvalue[] = [
                    'id'                    => isset($rows['id']) ? $rows['id'] : null, 
                    'no_kwitansi'           => isset($form['no_kwitansi']) ? $form['no_kwitansi'] : null,
                    'kode'                  => isset($rows['kode']) ? $rows['kode'] : null,        
                    'rincian'               => isset($rows['rincian']) ? $rows['rincian'] : null,
                    'jumlah'                => isset($rows['jumlah']) ? $rows['jumlah'] : 0,
                    'created_at'            => isset($rows['created_at']) ? $rows['created_at'] : $date,   
                    'updated_at'            => $date
                ];
                $total += isset($rows['jumlah']) ? (int)$rows['jumlah'] : 0;
                $tagihanvalue[$rows['kode']] = $rows['jumlah'];
            }else if($rows['flag'] == '0' && isset($rows['id'])){
                $flagdelete[] = $rows['id'];
            }
            
            if($pembayaran && $rows['flag'] == 1){
                $jml = $rows['jumlah'];
                $count = 1;
                $pcount = count($pembayaran);
                foreach ($pembayaran as $key => $value) {
                    if(isset($pembayaran[$key][$rows['kode'].'_debet'])){

                        if($count == $pcount){
                            $pembayaran[$key][$rows['kode'].'_debet'] = $jml;
                            break;
                        }

                        if(in_array($rows['kode'], ['spp','komite_sekolah','catering'])){ // Tagihan Bulanan
                            if($pembayaran[$key][$rows['kode'].'_debet'] <= $jml){
                                $jml = $jml - $pembayaran[$key][$rows['kode'].'_debet'];
                            }else{
                                $pembayaran[$key][$rows['kode'].'_debet'] = $jml;
                            }
                        }else{ // Tagihan Tahunan
                            $pembayaran[$key][$rows['kode'].'_debet'] = $jml;
                            break; // Exit loop, set value to first index
                        }
                        $count++;
                    }
                }
            }
        }
        
        $form['tahun_ajaran_id'] = isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id;
        $form['created_by'] = isset($form['created_by']) ? $form['created_by'] : \Yii::$app->user->getId();
        $form['updated_by'] = \Yii::$app->user->getId();
        $form['created_at'] = isset($form['created_at']) ? $form['created_at'] : $date;
        $form['updated_at'] = $date;

        // Set posting value
        $postingValue = [
            'date'                 => $form['tgl_kwitansi'],
            'noref'                => $form['no_kwitansi'],        
            'value'                => $total,
            'description'          => 'Kwitansi Pembayaran NO . ' . $form['no_kwitansi'] . 
                                        ' Bulan ' . implode(",", $form['month']),
            'sekolahid'            => $form['sekolahid'],
            'tahun_ajaran_id'      => $form['tahun_ajaran_id'],
            'tahun_ajaran_id_old'  => isset($form['tahun_ajaran_id_old']) ? 
                                            $form['tahun_ajaran_id_old'] : $form['tahun_ajaran_id'],
            'fk_id'                => isset($form['idrombel']) ? $form['idrombel'] : substr($form['no_kwitansi'], -5),
            'created_at'           => $form['created_at'],   
            'updated_at'           => $form['updated_at'],
            'created_by'           => $form['created_by'],   
            'updated_by'           => $form['updated_by']
        ];

        unset($form['siswaid']);
        unset($form['nama_siswa']);
        unset($form['kelas']);
        unset($form['kelasid']);
        unset($form['nama_kelas']);
        unset($form['tahun_ajaran_id_old']);
        $form['bulan'] = implode(",", $form['month']);
        $form['tahun'] = $form['year'];
        unset($form['month']);
        unset($form['year']);

        // var_dump([
        //     'rowHeader' => $form,
        //     'rowDetail' => $attrvalue,
        //     'rowDetailDel' => $flagdelete,
        //     'rowPembayaran' => $pembayaran,
        //     'postingValue' => $postingValue,
        //     'tagihanvalue' => $tagihanvalue
        // ]);
        // exit();

        $model = new $this->modelClass;
        $result = $model->saveAndPosting([
            'rowHeader' => $form,
            'rowDetail' => $attrvalue,
            'rowDetailDel' => $flagdelete,
            'rowPembayaran' => $pembayaran,
            'postingValue' => $postingValue,
            'tagihanvalue' => $tagihanvalue
        ], $id);

        if($result !== true){
            $this->response->setStatusCode(422, 'Data Validation Failed.');
        }else{
            $this->response->setStatusCode(201, 'Created.');
        }
        // return $result;
        return $form['no_kwitansi'];
    }

    private function addNewRombel($siswaid, $kelasid, $tahunAjaranId){
        $rombel = \rest\models\SiswaRombel::find()
                    ->where("siswaid = '$siswaid' AND kelasid = '$kelasid' AND tahun_ajaran_id = $tahunAjaranId")
                    ->one();
        if(!$rombel){
            $rombel = new \rest\models\SiswaRombel();
        }
        
        $rombel->siswaid = $siswaid;
        $rombel->kelasid = $kelasid;
        $rombel->tahun_ajaran_id = $tahunAjaranId;

        if($rombel->save()){
            return $rombel->id;
        }else{
            \Yii::error( $rombel->getErrors(), $category = 'database' );
        }

        return null;
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
        $date = date('Y-m-d H:i:s');
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