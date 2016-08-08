<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "mcoac".
 *
 * @property integer $mcoacid
 * @property string $mcoaclassification
 * @property integer $mcoagid
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Mcoag $mcoag
 * @property Mcoah[] $mcoahs
 */
class Mcoac extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'mcoac';
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
            [['mcoaclassification', 'mcoagid'], 'required'],
            [['mcoagid'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['mcoaclassification'], 'string', 'max' => 100],
            [['mcoagid'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoag::className(), 'targetAttribute' => ['mcoagid' => 'mcoagid']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'mcoacid' => Yii::t('app', 'Id Klasifikasi'),
            'mcoaclassification' => Yii::t('app', 'Klasifikasi'),
            'mcoagid' => Yii::t('app', 'Id Grup'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoag()
    {
        return $this->hasOne(Mcoag::className(), ['mcoagid' => 'mcoagid']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoahs()
    {
        return $this->hasMany(Mcoah::className(), ['mcoacid' => 'mcoacid']);
    }
}
