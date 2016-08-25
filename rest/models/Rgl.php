<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "rgl".
 *
 * @property integer $rglid
 * @property string $rgldt
 * @property string $mcoadno
 * @property string $noref
 * @property string $noref2
 * @property string $rglin
 * @property string $rglout
 * @property string $rgldesc
 * @property integer $fk_id
 * @property integer $sekolahid
 * @property string $tahun_ajaran_id
 * @property string $created_at
 * @property string $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 *
 * @property Mcoad $mcoadno0
 * @property Sekolah $sekolah
 * @property User $createdBy
 * @property User $updatedBy
 */
class Rgl extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'rgl';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['rgldt', 'mcoadno', 'sekolahid', 'created_at', 'created_by', 'updated_by'], 'required'],
            [['rgldt', 'created_at', 'updated_at'], 'safe'],
            [['rglin', 'rglout'], 'number'],
            [['rgldesc'], 'string'],
            [['fk_id', 'sekolahid', 'created_by', 'updated_by'], 'integer'],
            [['mcoadno'], 'string', 'max' => 8],
            [['noref'], 'string', 'max' => 30],
            [['noref2'], 'string', 'max' => 25],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
            [['mcoadno'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoad::className(), 'targetAttribute' => ['mcoadno' => 'mcoadno']],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
            [['created_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['created_by' => 'id']],
            [['updated_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['updated_by' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'rglid' => Yii::t('app', 'Rglid'),
            'rgldt' => Yii::t('app', 'Rgldt'),
            'mcoadno' => Yii::t('app', 'Mcoadno'),
            'noref' => Yii::t('app', 'Noref'),
            'noref2' => Yii::t('app', 'Noref2'),
            'rglin' => Yii::t('app', 'Rglin'),
            'rglout' => Yii::t('app', 'Rglout'),
            'rgldesc' => Yii::t('app', 'Rgldesc'),
            'fk_id' => Yii::t('app', 'Fk ID'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoadno0()
    {
        return $this->hasOne(Mcoad::className(), ['mcoadno' => 'mcoadno']);
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

    private function setOnDuplicateValue($column){
        $values = [];
        foreach($column as $col){
            if($col != 'cretaed_at'){
                $values[]= '`'.$col.'` = VALUES(' . $col .')';
            }
        }
        return implode(',', $values);
    }

    public function posting($DB, $values){
        $column = $this->attributes();
        unset($column[0]);

        $posting = $DB->createCommand()->batchInsert(
            self::tableName(),
            $column, 
            $values
        );
        $posting->setSql($posting->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
        return $posting;
    }

    public function unposting($DB, $where){
        $delete = $DB->createCommand()->delete(
            self::tableName(),
            $where
        );
        return $delete;
    }

}
