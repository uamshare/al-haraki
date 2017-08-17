<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tahun_ajaran".
 *
 * @property string $id
 * @property string $tahun_ajaran
 * @property integer $tahun_awal
 * @property integer $tahun_akhir
 * @property string $aktif
 *
 * @property SiswaRombel[] $siswaRombels
 */
class TahunAjaran extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tahun_ajaran';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['tahun_awal', 'tahun_akhir'], 'integer'],
            [['aktif'], 'string'],
            [['id'], 'string', 'max' => 6],
            [['tahun_ajaran'], 'string', 'max' => 10],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'tahun_ajaran' => Yii::t('app', 'Tahun Ajaran'),
            'tahun_awal' => Yii::t('app', 'Tahun Awal'),
            'tahun_akhir' => Yii::t('app', 'Tahun Akhir'),
            'aktif' => Yii::t('app', 'Aktif'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSiswaRombels()
    {
        return $this->hasMany(SiswaRombel::className(), ['tahun_ajaran_id' => 'id']);
    }

    public static function getActive($asArray = false){
        return ($asArray) 
                ? static::find(['aktif' => '1'])->asArray()->one()
                : static::findOne(['aktif' => '1' ]);
    }

    public static function findList($asArray = false){
        $query = static::find()
                    ->where("id <= (select id from tahun_ajaran where aktif = '1')");

        return ($asArray) 
                ? $query->asArray()
                : $query;
    }
}
