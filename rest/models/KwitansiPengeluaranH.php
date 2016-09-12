<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "kwitansi_pengeluaran_h".
 *
 * @property string $no_kwitansi
 * @property string $tgl_kwitansi
 * @property string $nama_penerima
 * @property integer $nik
 * @property integer $sekolahid
 * @property string $tahun_ajaran_id
 * @property integer $created_by
 * @property integer $updated_by
 * @property string $created_at
 * @property string $updated_at
 *
 * @property KwitansiPengeluaranD[] $kwitansiPengeluaranDs
 * @property User $createdBy
 * @property User $updatedBy
 * @property Sekolah $sekolah
 */
class kwitansiPengeluaranH extends \rest\models\AppActiveRecord //\yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'kwitansi_pengeluaran_h';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['no_kwitansi'], 'required'],
            [['tgl_kwitansi', 'created_at', 'updated_at'], 'safe'],
            [['nik', 'sekolahid', 'created_by', 'updated_by'], 'integer'],
            [['no_kwitansi'], 'string', 'max' => 20],
            [['nama_penerima'], 'string', 'max' => 50],
            [['keterangan'], 'string', 'max' => 255],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
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
            'no_kwitansi' => Yii::t('app', 'No Kwitansi'),
            'tgl_kwitansi' => Yii::t('app', 'Tgl Kwitansi'),
            'nama_penerima' => Yii::t('app', 'Nama Penerima'),
            'nik' => Yii::t('app', 'Nik'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    // public function getKwitansiPengeluaranDs()
    // {
    //     return $this->hasMany(KwitansiPengeluaranD::className(), ['no_kwitansi' => 'no_kwitansi']);
    // }

     /**
     * @return \yii\db\ActiveQuery
     */
    public function getDetails()
    {
        return $this->hasMany(KwitansiPengeluaranD::className(), ['no_kwitansi' => 'no_kwitansi']);
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
        $sqlCustoms = "SELECT MAX((SUBSTR(no_kwitansi,7,5))) AS no_kwitansi FROM kwitansi_pengeluaran_h
                    WHERE SUBSTR(no_kwitansi,3,2) = :param1 AND sekolahid = :param2";
        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, [':param1' => $year, ':param2' => $sekolahid]);
        // echo $customeQuery->rawSql;exit();
        $no = $customeQuery->queryOne()['no_kwitansi'];
        $no = $no + 1;
        $no = str_pad($no, 5, '0', STR_PAD_LEFT);
        return '02' . $year . str_pad($sekolahid, 2, '0', STR_PAD_LEFT) . $no;
    }
    
    /**
     * Save header data, detail data and posting to buku besar
     * @param $params, Array parameter post
     * 
     */
    public function saveAndPosting($params){
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

        try {
            $savedH = $DB->createCommand()->insert(
                self::tableName(),
                $rowHeader
            );

            $savedH->setSql($savedH->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
            // echo $savedH->rawSql . '<br/>';
            $savedH->execute();

            $deleteD = $DB->createCommand()->delete(
                'kwitansi_pengeluaran_d', 
                ['id' => $rowDetailDel]
            );
            // var_dump($rowDetailDel);
            // echo $deleteD->rawSql. '<br/>';;
            $deleteD->execute();

            $savedD = $DB->createCommand()->batchInsert(
                'kwitansi_pengeluaran_d', 
                $columnD, 
                $rowDetail
            );
            $savedD->setSql($savedD->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnD));
            // echo $savedD->rawSql; 
            // exit();
            $savedD->execute();
            
            $GL = new \rest\models\Rgl();
            $autoPosting = $GL->AutoPosting('02', $postingValue, 'spp');
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
                'kwitansi_pengeluaran_d',
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
            if($col != 'created_at'){
                $values[]= '`'.$col.'` = VALUES(' . $col .')';
            }
        }
        return implode(',', $values);
    }
}
