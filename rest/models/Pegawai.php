<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "pegawai".
 *
 * @property integer $id
 * @property string $nik
 * @property string $nuptk
 * @property string $nama
 * @property integer $sekolahid
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Sekolah $sekolah
 */
class Pegawai extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'pegawai';
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            [
            'class' => \yii\behaviors\TimestampBehavior::className(),
                'createdAtAttribute' => 'created_at',
                'updatedAtAttribute' => 'updated_at',
                'value' => new \yii\db\Expression('NOW()'),
            ]
        ];
    }
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['nama', 'sekolahid'], 'required'],
            [['sekolahid'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['nik', 'nuptk'], 'string', 'max' => 15],
            [['nama'], 'string', 'max' => 100],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'nik' => Yii::t('app', 'Nik'),
            'nuptk' => Yii::t('app', 'Nuptk'),
            'nama' => Yii::t('app', 'Nama'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSekolah()
    {
        return $this->hasOne(Sekolah::className(), ['id' => 'sekolahid']);
    }
}
