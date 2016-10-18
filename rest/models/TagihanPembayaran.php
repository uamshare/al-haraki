<?php

namespace rest\models;

use Yii;
use yii\db\Query;

/**
 * This is the model class for table "tagihan_pembayaran".
 *
 * @property integer $id
 * @property integer $idrombel
 * @property integer $spp_debet
 * @property integer $spp_kredit
 * @property integer $komite_sekolah_debet
 * @property integer $komite_sekolah_kredit
 * @property integer $catering_debet
 * @property integer $catering_kredit
 * @property integer $keb_siswa_debet
 * @property integer $keb_siswa_kredit
 * @property integer $ekskul_debet
 * @property integer $ekskul_kredit
 * @property integer $month
 * @property integer $year
 * @property string $year_ajaran
 * @property string $no_ref
 * @property string $ket_ref
 * @property string $keterangan
 * @property string $created_at
 * @property string $updated_at
 *
 * @property SiswaRombel $idrombel0
 */
class TagihanPembayaran extends \rest\models\AppActiveRecord // \yii\db\ActiveRecord
{
    protected $isAutoSaveLog = true;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tagihan_pembayaran';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['idrombel', 'bulan', 'tahun', 'tahun_ajaran'], 'required'],
            [['idrombel', 'spp_debet', 'spp_kredit', 'komite_sekolah_debet', 'komite_sekolah_kredit', 'catering_debet', 'catering_kredit', 'keb_siswa_debet', 'keb_siswa_kredit', 'ekskul_debet', 'ekskul_kredit', 'bulan', 'tahun'], 'integer'],
            [['keterangan'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['tahun_ajaran'], 'string', 'max' => 6],
            [['no_ref'], 'string', 'max' => 20],
            [['ket_ref'], 'string', 'max' => 50],
            [['idrombel', 'bulan', 'tahun','no_ref'], 'unique', 'targetAttribute' => ['idrombel', 'bulan', 'tahun','no_ref'], 'message' => 'The combination of Idrombel,No Ref, Bulan and Tahun has already been taken.'],
            [['idrombel'], 'exist', 'skipOnError' => true, 'targetClass' => SiswaRombel::className(), 'targetAttribute' => ['idrombel' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'idrombel' => Yii::t('app', 'Idrombel'),
            'spp_debet' => Yii::t('app', 'Spp Debet'),
            'spp_kredit' => Yii::t('app', 'Spp Kredit'),
            'komite_sekolah_debet' => Yii::t('app', 'Komite Sekolah Debet'),
            'komite_sekolah_kredit' => Yii::t('app', 'Komite Sekolah Kredit'),
            'catering_debet' => Yii::t('app', 'Catering Debet'),
            'catering_kredit' => Yii::t('app', 'Catering Kredit'),
            'keb_siswa_debet' => Yii::t('app', 'Keb Siswa Debet'),
            'keb_siswa_kredit' => Yii::t('app', 'Keb Siswa Kredit'),
            'ekskul_debet' => Yii::t('app', 'Ekskul Debet'),
            'ekskul_kredit' => Yii::t('app', 'Ekskul Kredit'),
            'bulan' => Yii::t('app', 'Bulan'),
            'tahun' => Yii::t('app', 'Tahun'),
            'tahun_ajaran' => Yii::t('app', 'Tahun Ajaran'),
            'no_ref' => Yii::t('app', 'No Ref'),
            'ket_ref' => Yii::t('app', 'Ket Ref'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIdrombel0()
    {
        return $this->hasOne(SiswaRombel::className(), ['id' => 'idrombel']);
    }

    private function where($data){
        $commaData = explode(",", $data);
        $impl = array();
        for($i=0; $i<count($commaData); $i++){
            $impl[$i] = "'{$commaData[$i]}'";
        }

        $implode = implode(",", $impl);

        if(count($impl) > 1)
            return " IN ($implode) ";
        else
            return " = $implode";
    }

    private function queryOutstanding($filter, $filter2, $status = 'all'){
        if($status == 'all'){
            $join = 'LEFT JOIN';
        }else{
            $join = 'INNER JOIN';
        }
        $sqlCustoms = " SELECT * FROM
              (SELECT    b.`id`
                  , a.id AS `idrombel`
                  , a.`siswaid`
                  , s.`nama_siswa` 
                  , a.`kelasid`
                  , k.kelas
                  , k.nama_kelas
                  , a.`tahun_ajaran_id`
                  , b.`spp`
                  , b.`komite_sekolah`
                  , b.`catering`
                  , b.`keb_siswa`
                  , b.`ekskul`
                  , b.`bulan`
                  , b.`tahun`
                  , b.`keterangan`
                  , b.`created_at`
                  , b.`updated_at`
              FROM siswa_rombel a
              INNER JOIN siswa s ON a.`siswaid`=s.`id`
              INNER JOIN kelas k ON a.`kelasid`=k.`id`
              $join
                (SELECT 
                  a.`id`,
                  a.`idrombel`,
                  SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp,
                  SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah,
                  SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering,
                  SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa,
                  SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul,
                  a.`bulan`,
                  a.`tahun`,
                  a.`tahun_ajaran`,
                  a.`no_ref`,
                  a.`ket_ref`,
                  a.`keterangan`,
                  a.`created_at`,
                  a.`updated_at` 
                FROM
                  `tagihan_pembayaran` a
                LEFT JOIN kwitansi_pembayaran_h b ON TRIM(a.`no_ref`) = TRIM(b.`no_kwitansi`) $filter2
                LEFT JOIN tagihan_autodebet_h c ON TRIM(a.`no_ref`) = TRIM(c.`no_transaksi`)
                WHERE (a.bulan <> 0 AND a.bulan is not null) AND $filter
                GROUP BY idrombel
                ) b ON a.`id` = b.`idrombel`) AS q_info_tagihan ";
        return $sqlCustoms;
    }

    private function queryPembayaran($filter, $status = 'all'){
        if($status == 'all'){
            $join = 'LEFT JOIN';
        }else{
            $join = 'INNER JOIN';
        }
        $sqlCustoms = "SELECT * FROM
              (SELECT    b.`id`
                          , a.id AS `idrombel`
                          , a.`siswaid`
                          , s.`nama_siswa` 
                          , a.`kelasid`
                          , k.kelas
                          , k.nama_kelas
                          , a.`tahun_ajaran_id`
                          , b.`spp`
                          , b.`komite_sekolah`
                          , b.`catering`
                          , b.`keb_siswa`
                          , b.`ekskul`
                          , b.`bulan`
                          , b.`tahun`
                          , b.`keterangan`
                          , b.`created_at`
                          , b.`updated_at`
                      FROM siswa_rombel a
                      INNER JOIN siswa s ON a.`siswaid`=s.`id`
                      INNER JOIN kelas k ON a.`kelasid`=k.`id`
                      $join
                        (SELECT 
                          a.`id`,
                          a.`idrombel`,
                          IFNULL(`spp_debet`,0) AS spp,
                          IFNULL(`komite_sekolah_debet`,0) AS komite_sekolah,
                          IFNULL(`catering_debet`,0) AS catering,
                          IFNULL(`keb_siswa_debet`,0) AS keb_siswa,
                          IFNULL(`ekskul_debet`,0) AS ekskul,
                          a.`bulan`,
                          a.`tahun`,
                          a.`tahun_ajaran`,
                          a.`no_ref`,
                          a.`ket_ref`,
                          a.`keterangan`,
                          a.`created_at`,
                          a.`updated_at` 
                        FROM `tagihan_pembayaran` a
                        INNER JOIN (SELECT idrombel,kp.`no_kwitansi`,kp.`tgl_kwitansi` FROM kwitansi_pembayaran_h kp
                          UNION ALL 
                          SELECT idrombel,h.no_transaksi,h.tgl_transaksi FROM tagihan_autodebet_h h
                          INNER JOIN tagihan_autodebet_d d ON h.no_transaksi = d.no_transaksi) 
                          b ON a.`no_ref` = b.`no_kwitansi` AND a.`idrombel`=b.idrombel
                        WHERE $filter) b ON a.`id` = b.`idrombel`) AS q_info_tagihan ";
        return $sqlCustoms;
    }

    public function getListOutstanding($param){
        extract($param);
        $where = 'WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel ' . $this->where($idrombel);
        }

        if($kelasid){
            $where .= ' AND kelasid ' . $this->where($kelasid);
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id ' . $this->where($tahun_ajaran_id);
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        
        if($date_end){
            $param1 = date('m', strtotime($date_end)) + (12 * date('Y', strtotime($date_end)));
            $filter = '(a.bulan + (12 * a.tahun)) <= :param1';
            $filter2 = " AND DATE_FORMAT(b.`tgl_kwitansi`,'%Y-%m-%d') <= :param2 ";
            $bound = [':param1' => $param1, ':param2' => $date_end];
        }else{
            $param1 = $month + (12 * $year);
            $filter = '(a.bulan + (12 * a.tahun)) <= :param1';
            $filter2 = '';
            $bound = [':param1' => $param1];
        }

        $sqlCustoms = $this->queryOutstanding($filter, $filter2, $status);

        $connection = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms . $where, $bound);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    /**
     * Get Summary Outstanding By Tagihan
     *
     *
     */
    public function getSummaryOutsByTagihan($params){
        $customeQuery = new Query;
        $customeQuery
            ->select([
                'a.`tahun_ajaran`',
                'SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp',
                'SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah',
                'SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering',
                'SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa',
                'SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul'
            ])
            ->from('tagihan_pembayaran a');

        if(is_array($params)){
            extract($params);
            $customeQuery->where('1=1');

            if($tahun_ajaran_id){
                $customeQuery->andWhere(['a.tahun_ajaran' => $tahun_ajaran_id]);
            }

            // if($date){
            //     $customeQuery->andWhere(['<=','a.updated_at',$date]);
            // }
            if($date){
                $month = date('m', strtotime($date));
                $year = date('Y', strtotime($date));
                $param = $month + (12 * $year);
                $customeQuery->andWhere(['<=', '(a.bulan + (12 * a.tahun))', $param]);
            }
        }else if(is_string($params) || is_int($params)){
            $customeQuery->andWhere(['a.id' => $params]);
        }
         
        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }

    /**
     * Get Summary Outstanding By Tagihan
     *
     *
     */
    public function getSummaryOutsBySekolah($params){
        $customeQuery = new Query;
        if(is_array($params)){
            extract($params);

            if($date){
                $month = date('m', strtotime($date));
                $year = date('Y', strtotime($date));
                $param = $month + (12 * $year);
            }

            $customeQuery
            ->select([
                '`kelas`',
                '`sekolahid`',
                'p.`tahun_ajaran`',
                'SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp',
                'SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah',
                'SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering',
                'SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa',
                'SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul'
            ])
            ->from('`kelas` k')
            ->innerJoin('siswa_rombel sr', 'sr.`kelasid` = k.`id`')
            ->leftJoin(
                'tagihan_pembayaran p', 
                'sr.`id` = p.`idrombel` AND p.`tahun_ajaran` = :tahun_ajaran_id AND (p.bulan + (12 * p.tahun)) <= :param',
                [ 'tahun_ajaran_id' => $tahun_ajaran_id, 'param' => $param ]
            )
            ->groupBy(['k.`sekolahid`','k.`kelas`'])
            ->where('1=1');
        }
         
        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }

    public function getListOutstandingByMonth($param){
        extract($param);
        $where = 'WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel ' . $this->where($idrombel);
        }

        if($kelasid){
            $where .= ' AND kelasid ' . $this->where($kelasid);
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id ' . $this->where($tahun_ajaran_id);
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        // $param1 = $month + (12 * $year);
        $filter = 'bulan = :param1 AND tahun= :param2';

        $sqlCustoms = $this->queryOutstanding($filter);

        $connection = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms . $where, [':param1' => $month, ':param2' => $year]);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    public function getListPembayaran($param){
        extract($param);
        $where = 'WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel ' . $this->where($idrombel);
        }

        if($kelasid){
            $where .= ' AND kelasid ' . $this->where($kelasid);
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id ' . $this->where($tahun_ajaran_id);
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        // $filter = '(bulan = :param1 AND tahun = :param2)';
        $filter = '(b.`tgl_kwitansi` BETWEEN :param1 AND :param2)';

        $sqlCustoms = $this->queryPembayaran($filter, $status);

        $conn = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms . $where, [':param1' => $date_start, ':param2' => $date_end]);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }


    /**
     * Save tagihan info into outstanding pembayaran
     * @param $jt, String jenis tagihan
     * @param $rows, Array value outstanding pembayaran
     * @param $log, Array value info tagihan log
     * @param $whereids, Array id log tagihan
     */
    public function insertBatch($jt, $rows, $log, $whereids = null){
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        // $column = $this->attributes();
        // unset($column[0]);
        $column = ($jt == '1') ? [
            'idrombel',
            'spp_kredit',
            'komite_sekolah_kredit',
            'catering_kredit',
            'bulan',
            'tahun',
            'tahun_ajaran',
            'no_ref',
            'ket_ref',
            'keterangan',
            'created_at',
            'updated_at'
        ] : [
            'idrombel',
            'keb_siswa_kredit',
            'ekskul_kredit',
            'bulan',
            'tahun',
            'tahun_ajaran',
            'no_ref',
            'ket_ref',
            'keterangan',
            'created_at',
            'updated_at'
        ];

        $columnLog = [
            'idrombel',
            'spp',
            'komite_sekolah',
            'catering',
            'keb_siswa',
            'ekskul',
            'tahun_ajaran_id',
            'keterangan',
            'jenis_tagihan',
            'periode_awal',
            'periode_akhir',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by'
        ];
        try {
            $saved = $DB->createCommand()->batchInsert(
                self::tableName(), 
                $column, 
                $rows
            );
            $saved->setSql($saved->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
            // echo $saved->rawSql . '<br/>';
            $saved->execute();

            // Set flag 0 to old log
            // $updateL = $DB->createCommand()->update(
            //     'tagihan_info_input_log', 
            //     ['flag' => '0'], 
            //     ['id' => $whereids]
            // );
            // $updateL->execute();

            // Save new log
            $saveL = $DB->createCommand()->batchInsert(
               'tagihan_info_input_log', 
                $columnLog, 
                $log
            );
            $saveL->setSql($saveL->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnLog));
            // echo $saveL->rawSql;exit();
            $saveL->execute();

            $transaction->commit();
            return true;
        } catch(\Exception $e) {
            $msg =  (string)($e) . ' on ' . __METHOD__;
            \Yii::error(date('Y-m-d H:i:s A') . ' Error during save data. ' . $msg);
            $transaction->rollBack();
            return [
                'name' => 'Error during save data.',
                'message' => (isset($e->errorInfo)) ? $e->errorInfo : 'Undefined error',
                'log' => $msg
            ];
        }
    }

    private function setOnDuplicateValue($column){
      $values = [];
      foreach($column as $col){
        if($col != 'cretaed_at'){
              $values[]= '`'.$col.'` = VALUES(' . $col .')';
          }
      }
      return implode(',', $values);
    }

}
