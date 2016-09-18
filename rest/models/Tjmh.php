<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tjmh".
 *
 * @property string $tjmhno
 * @property string $tjmhdt
 * @property string $tjmhdesc
 * @property integer $sekolahid
 * @property string $created_at
 * @property string $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 *
 * @property Tjmd[] $tjmds
 * @property Sekolah $sekolah
 */
class Tjmh extends \rest\models\AppActiveRecord //\yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tjmh';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['tjmhno', 'tjmhdt', 'tjmhdesc', 'created_at'], 'required'],
            [['tjmhdt', 'created_at', 'updated_at'], 'safe'],
            [['sekolahid', 'created_by', 'updated_by'], 'integer'],
            [['tjmhno'], 'string', 'max' => 13],
            [['tjmhdesc'], 'string', 'max' => 200],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'tjmhno' => Yii::t('app', 'Tjmhno'),
            'tjmhdt' => Yii::t('app', 'Tjmhdt'),
            'tjmhdesc' => Yii::t('app', 'Tjmhdesc'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTjmds()
    {
        return $this->hasMany(Tjmd::className(), ['tjmhno' => 'tjmhno']);
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

    public function getNewNOKwitansi($year, $sekolahid){
        $sqlCustoms = "SELECT MAX((SUBSTR(tjmhno,7,5))) AS tjmhno FROM tjmh
                    WHERE SUBSTR(tjmhno,3,2) = :param1 AND sekolahid = :param2";
        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, [':param1' => $year, ':param2' => $sekolahid]);
        // echo $customeQuery->rawSql;exit();
        $no = $customeQuery->queryOne()['tjmhno'];
        $no = $no + 1;
        $no = str_pad($no, 5, '0', STR_PAD_LEFT);
        return '04' . $year . str_pad($sekolahid, 2, '0', STR_PAD_LEFT) . $no;
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
            'tjmdid',
            'tjmhno',
            'tjmddesc',
            'mcoadno',
            'debet',
            'kredit',
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

            if(count($rowDetailDel['id']) > 0){
                $deleteD = $DB->createCommand()->delete(
                    'tjmd', 
                    ['tjmdid' => $rowDetailDel['id']]
                );
                // var_dump($rowDetailDel);
                // echo $deleteD->rawSql. '<br/>';;
                $deleteD->execute();
            }
            

            $savedD = $DB->createCommand()->batchInsert(
                'tjmd', 
                $columnD, 
                $rowDetail
            );
            $savedD->setSql($savedD->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($columnD));
            // echo $savedD->rawSql; 
            // exit();
            $savedD->execute();
            $GL = new \rest\models\Rgl();
            if(count($rowDetailDel['mcoadno']) > 0){
                $unpostingGLWhere = [
                    'noref' => $rowHeader['tjmhno'],
                    'mcoadno' => $rowDetailDel['mcoadno'],
                    'sekolahid' => $rowHeader['sekolahid'],
                    'tahun_ajaran_id' => $rowHeader['tahun_ajaran_id']
                ];

                $unpostingGL = $GL->unposting($DB, $unpostingGLWhere);
                $unpostingGL->execute();
            }
            
            $postingGL = $GL->posting($DB, $postingvalue);
            // echo $postingGL->rawSql; 
            // exit();
            $postingGL->execute();
            
            $this->created_at = $rowHeader['created_at'];
            $this->saveLogs([
                'rowHeader' => $rowHeader,
                'rowDetail' => $rowDetail
            ], $rowHeader['sekolahid']);
            
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
                'tjmd',
                'tjmhno = :param1',
                ['param1' => $no]
            );
            // echo $deleteD->rawSql . '<br/>';
            $deleteD->execute();

            $deleteH = $DB->createCommand()->delete(
                self::tableName(),
                'tjmhno = :param1',
                ['param1' => $no]
            );
            // echo $deleteH->rawSql . '<br/>';
            $deleteH->execute();

            $GL = new \rest\models\Rgl();
            $unpostingGL = $GL->unposting($DB, [
                'noref' => $no
            ], substr($no, 4,2));
            $unpostingGL->execute();
            
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
