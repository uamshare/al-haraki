<?php

namespace rest\models;

use Yii;

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
class TagihanPembayaran extends \yii\db\ActiveRecord
{
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

    private function queryOutstanding($filter){
        $sqlCustoms = " SELECT * FROM
              (SELECT    b.`id`
                  , a.id AS `idrombel`
                  , a.`siswaid`
                  , s.`nama_siswa` 
                  , a.`kelasid`
                  , a.`tahun_ajaran_id`
                  , b.`spp`
                  , b.`komite_sekolah`
                  , b.`catering`
                  , b.`keb_siswa`
                  , b.`ekskul`
                  , b.`keterangan`
                  , b.`created_at`
                  , b.`updated_at`
              FROM siswa_rombel a
              INNER JOIN siswa s ON a.`siswaid`=s.`id`
              LEFT JOIN 
                (SELECT 
                  `id`,
                  `idrombel`,
                  SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp,
                  SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah,
                  SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering,
                  SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa,
                  SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul,
                  `bulan`,
                  `tahun`,
                  `tahun_ajaran`,
                  `no_ref`,
                  `ket_ref`,
                  `keterangan`,
                  `created_at`,
                  `updated_at` 
                FROM
                  `tagihan_pembayaran`
                WHERE $filter
                GROUP BY idrombel

                ) b ON a.`id` = b.`idrombel`) AS q_info_tagihan ";
        return $sqlCustoms;
    }

    public function getListOutstanding($param){
        extract($param);
        $where = 'WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel=' . $idrombel;
        }

        if($kelasid){
            $where .= ' AND kelasid=' . $kelasid;
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id=' . $tahun_ajaran_id;
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        $param1 = $month + (12 * $year);
        $filter = '(bulan + (12 * tahun)) <= :param1';

        $sqlCustoms = $this->queryOutstanding($filter);

        $connection = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms . $where, [':param1' => $param1]);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    public function getListOutstandingByMonth($param){
        extract($param);
        $where = 'WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel=' . $idrombel;
        }

        if($kelasid){
            $where .= ' AND kelasid=' . $kelasid;
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id=' . $tahun_ajaran_id;
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

    public function insertBatch($rows, $log, $whereids = null){
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        $column = $this->attributes();
        unset($column[0]);
        $columnLog = [
            'idrombel',
            'spp',
            'komite_sekolah',
            'catering',
            'keb_siswa',
            'ekskul',
            'tahun_ajaran_id',
            'keterangan',
            'created_at',
            'updated_at'
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
            $updateL = $DB->createCommand()->update(
                'tagihan_info_input_log', 
                ['flag' => '0'], 
                ['id' => $whereids]
            );
            $updateL->execute();

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
        $values[]= '`'.$col.'` = VALUES(' . $col .')';
      }
      return implode(',', $values);
    }
}
