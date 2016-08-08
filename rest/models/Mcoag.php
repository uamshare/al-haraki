<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "mcoag".
 *
 * @property integer $mcoagid
 * @property string $mcoagroup
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Mcoac[] $mcoacs
 */
class Mcoag extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'mcoag';
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
            [['created_at', 'updated_at'], 'safe'],
            [['mcoagroup'], 'string', 'max' => 30],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'mcoagid' => Yii::t('app', 'Id Grup'),
            'mcoagroup' => Yii::t('app', 'Grup'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoacs()
    {
        return $this->hasMany(Mcoac::className(), ['mcoagid' => 'mcoagid']);
    }
}
