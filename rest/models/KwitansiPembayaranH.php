<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "kwitansi_pembayaran_h".
 *
 * @property string $no_kwitansi
 * @property string $tgl_kwitansi
 * @property string $nama_pembayar
 * @property integer $idrombel
 * @property string $keterangan
 * @property integer $sekolahid
 * @property string $sumber_kwitansi
 * @property integer $bulan
 * @property integer $tahun
 * @property integer $created_by
 * @property integer $updated_by
 * @property string $created_at
 * @property string $updated_at
 *
 * @property KwitansiPembayaranD[] $kwitansiPembayaranDs
 * @property User $createdBy
 * @property User $updatedBy
 * @property Sekolah $sekolah
 */
class KwitansiPembayaranH extends \rest\models\AppActiveRecord // \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'kwitansi_pembayaran_h';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['no_kwitansi'], 'required'],
            [['tgl_kwitansi', 'created_at', 'updated_at'], 'safe'],
            [['idrombel', 'sekolahid', 'bulan', 'tahun', 'created_by', 'updated_by'], 'integer'],
            [['no_kwitansi'], 'string', 'max' => 20],
            [['nama_pembayar'], 'string', 'max' => 50],
            [['keterangan'], 'string', 'max' => 255],
            [['sumber_kwitansi'], 'string', 'max' => 2],
            [['created_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['created_by' => 'id']],
            [['updated_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['updated_by' => 'id']],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'no_kwitansi' => Yii::t('app', '01 : No Transaksi, 16 : Thn Transaksi, 02 : sekolahid, 00001 : no urut'),
            'tgl_kwitansi' => Yii::t('app', 'Tgl Kwitansi'),
            'nama_pembayar' => Yii::t('app', 'Nama Pembayar'),
            'idrombel' => Yii::t('app', 'Idrombel'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'sumber_kwitansi' => Yii::t('app', 'Sumber Kwitansi'),
            'bulan' => Yii::t('app', 'Bulan'),
            'tahun' => Yii::t('app', 'Tahun'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDetails()
    {
        return $this->hasMany(KwitansiPembayaranD::className(), ['no_kwitansi' => 'no_kwitansi']);
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
     * @return \yii\db\ActiveQuery
     */
    public function getSekolah()
    {
        return $this->hasOne(Sekolah::className(), ['id' => 'sekolahid']);
    }

    public function getNewNOKwitansi($year, $sekolahid){
        $sqlCustoms = "SELECT MAX((SUBSTR(no_kwitansi,7,5))) AS no_kwitansi FROM kwitansi_pembayaran_h
                    WHERE SUBSTR(no_kwitansi,3,2) = :param1 AND sekolahid = :param2";
        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, [':param1' => $year, ':param2' => $sekolahid]);
        // echo $customeQuery->rawSql;exit();
        $no = $customeQuery->queryOne()['no_kwitansi'];
        $no = $no + 1;
        $no = str_pad($no, 5, '0', STR_PAD_LEFT);
        return '01' . $year . str_pad($sekolahid, 2, '0', STR_PAD_LEFT) . $no;
    }
    
    /**
     * Save header data, detail data and posting to buku besar
     * @param $params, Array parameter post
     * 
     */
    public function saveAndPosting($params, $id = false){
        extract($params);
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        $column = $this->attributes();

        unset($column[0]);
        $columnD = [
            'id',
            'no_kwitansi',
            'kode',
            'rincian',
            'jumlah',
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

            $deleteD = $DB->createCommand()->delete(
                'kwitansi_pembayaran_d', 
                ['id' => $rowDetailDel]
            );
            // echo $deleteD->rawSql. '<br/>';;
            $deleteD->execute();
            
            $savedD = $DB->createCommand()->batchInsert(
                'kwitansi_pembayaran_d', 
                $columnD, 
                $rowDetail
            );
            $savedD->setSql($savedD->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnD,['id']));
            // echo $savedD->rawSql. '<br/>';
            $savedD->execute();

            if($rowPembayaran != false){
                if($id){
                    $savedP = $DB->createCommand()->update(
                        'tagihan_pembayaran',
                        $rowPembayaran,
                        ['no_ref' => $id]
                    );
                }else{
                    $savedP = $DB->createCommand()->insert(
                        'tagihan_pembayaran',
                        $rowPembayaran
                    );
                }
                
                // $savedP->setSql($savedP->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnP));
                $savedP->execute();
                // echo $savedD->rawSql;exit();
            }
            
            $GL = new \rest\models\Rgl();
            if($rowHeader['sumber_kwitansi'] == 1){
                foreach (['spp','komite_sekolah','catering','keb_siswa','ekskul'] as $tagihan) {
                    $postingValue['value'] = isset($tagihanvalue[$tagihan]) ? $tagihanvalue[$tagihan] : 0;
                    $postingValue['description'] = 'Kwitansi Pembayaran (' .$tagihan. ') NO . ' . $rowHeader['no_kwitansi'];
                    $autoPosting = $GL->AutoPosting('01', $postingValue, $tagihan);
                    $autoPosting['posting']->execute();
                }
            }else{
                $autoPosting = $GL->AutoPosting('01', $postingValue, 'none');
                $autoPosting['unposting']->execute();
                // var_dump($autoPosting['posting']->rawSql);exit();
                $autoPosting['posting']->execute();
            }

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
                'kwitansi_pembayaran_d',
                'no_kwitansi = :param1',
                ['param1' => $no]
            );
            // echo $deleteD->rawSql . '<br/>';
            $deleteD->execute();

            $deleteH = $DB->createCommand()->delete(
                self::tableName(),
                'no_kwitansi = :param1',
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

    private function setOnDuplicateValue($column, $colesc = array()){
        $values = [];
        $colesc[] = 'created_at';
        foreach($column as $col){
            if(!in_array($col, $colesc)){
                $values[]= '`'.$col.'` = VALUES(' . $col .')';
            }
        }
        return implode(',', $values);
    }
}
