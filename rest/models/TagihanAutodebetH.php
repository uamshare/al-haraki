<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tagihan_autodebet_h".
 *
 * @property string $no_transaksi
 * @property string $tgl_transaksi
 * @property integer $sekolahid
 * @property string $keterangan
 * @property string $file_import
 * @property integer $bulan
 * @property integer $tahun
 * @property integer $tahun_ajaran_id
 * @property string $created_at
 * @property string $updated_at
 *
 * @property TagihanAutodebetD[] $tagihanAutodebetDs
 * @property Sekolah $sekolah
 */
class TagihanAutodebetH extends \rest\models\AppActiveRecord //\yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tagihan_autodebet_h';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['no_transaksi'], 'required'],
            [['tgl_transaksi', 'created_at', 'updated_at'], 'safe'],
            [['sekolahid', 'bulan', 'tahun', 'tahun_ajaran_id'], 'integer'],
            [['no_transaksi'], 'string', 'max' => 11],
            [['keterangan', 'file_import'], 'string', 'max' => 255],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'no_transaksi' => Yii::t('app', 'No Transaksi'),
            'tgl_transaksi' => Yii::t('app', 'Tgl Transaksi'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'file_import' => Yii::t('app', 'File Import'),
            'bulan' => Yii::t('app', 'Bulan'),
            'tahun' => Yii::t('app', 'Tahun'),
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTagihanAutodebetDs()
    {
        return $this->hasMany(TagihanAutodebetD::className(), ['no_transaksi' => 'no_transaksi']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSekolah()
    {
        return $this->hasOne(Sekolah::className(), ['id' => 'sekolahid']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCreatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'created_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUpdatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'updated_by']);
    }
    
    /**
     * Get Autonumber Transaksi
     * 
     */
    public function getNewNoTransaksi($year, $sekolahid)
    {
        $sqlCustoms = "SELECT MAX((SUBSTR(no_transaksi,7,5))) AS no_transaksi FROM tagihan_autodebet_h
                    WHERE SUBSTR(no_transaksi,3,2) = :param1 AND sekolahid = :param2";
        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, [':param1' => $year, ':param2' => $sekolahid]);
        $no = $customeQuery->queryOne()['no_transaksi'];
        $no = $no + 1;
        $no = str_pad($no, 5, '0', STR_PAD_LEFT);
        // var_dump($customeQuery->rawSql);exit();
        return '03' . $year . str_pad($sekolahid, 2, '0', STR_PAD_LEFT) . $no;
    }

    /**
     * Save header data, detail data and posting to buku besar
     * @param $params, Array parameter post
     * 
     */
    public function saveAndPosting($params)
    {
        extract($params);
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        $column = $this->attributes();
        unset($column[0]);

        $columnD = [
            'id',
            'no_transaksi',
            'idrombel',
            'nis',
            'nisn',
            'nama_siswa',
            'no_rekening',
            'nama_no_rekening',
            'spp',
            'komite_sekolah',
            'catering',
            'keb_siswa',
            'ekskul',
            'total',
            'created_at',
            'updated_at'
        ];

        $columnP = [
            'idrombel',
            'spp_debet',
            'komite_sekolah_debet',
            'catering_debet',
            'keb_siswa_debet',
            'ekskul_debet',
            'bulan',
            'tahun',
            'tahun_ajaran',
            'no_ref',
            'ket_ref',
            'created_at',
            'updated_at'
        ];

        try {
            $savedH = $DB->createCommand()->insert(
                self::tableName(),
                $rowHeader
            );
            $savedH->setSql($savedH->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
            // echo $savedH->rawSql . '<br/>';
            $savedH->execute();

            $savedD = $DB->createCommand()->batchInsert(
                'tagihan_autodebet_d', 
                $columnD, 
                $rowDetail
            );
            $savedD->setSql($savedD->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnD));
            // echo $savedD->rawSql. '<br/>';
            $savedD->execute();

            if($rowPembayaran != false){
                $savedP = $DB->createCommand()->batchInsert(
                    'tagihan_pembayaran',
                    $columnP,
                    $rowPembayaran
                );
                $savedP->setSql($savedP->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnP));
                $savedP->execute();
                // echo $savedD->rawSql;exit();
            }
            
            $GL = new \rest\models\Rgl();
            $autoPosting = $GL->AutoPosting('03', $postingValue);
            $autoPosting['unposting']->execute();
            $autoPosting['posting']->execute();

            $this->created_at = $rowHeader['created_at'];
            $this->saveLogs([
                'rowHeader' => $rowHeader,
                'rowDetail' => $rowDetail
            ]);

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

    /**
     * Delete all data
     * @param $no, String no kwitansi
     * 
     */
    public function deleteAndRemoveAll($no){
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        try {
            $deleteD = $DB->createCommand()->delete(
                'tagihan_autodebet_d',
                'no_transaksi = :param1',
                ['param1' => $no]
            );
            // echo $deleteD->rawSql . '<br/>';
            $deleteD->execute();

            $deleteH = $DB->createCommand()->delete(
                self::tableName(),
                'no_transaksi = :param1',
                ['param1' => $no]
            );
            // echo $deleteH->rawSql . '<br/>';
            $deleteH->execute();

            $deleteP = $DB->createCommand()->delete(
                'tagihan_pembayaran',
                'no_ref = :param1',
                ['param1' => $no]
            );
            // echo $deleteP->rawSql;exit();
            $deleteP->execute();

            $GL = new \rest\models\Rgl();
            $unpostingGL = $GL->unposting($DB, [
                'noref' => $no
            ]);
            $unpostingGL->execute();
            
            $this->created_at = date('Y-m-d H:i:s A');
            $this->saveLogs([
                'no_kwitansi' => $no
            ]);

            $transaction->commit();
            return true;
        } catch(\Exception $e) {
            $msg =  (string)($e) . ' on ' . __METHOD__;
            \Yii::error(date('Y-m-d H:i:s A') . ' Error during save data. ' . $msg);
            $transaction->rollBack();
            return [
                'name' => 'Error during delete data.',
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
