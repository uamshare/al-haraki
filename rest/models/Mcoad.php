<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "mcoad".
 *
 * @property string $mcoadno
 * @property string $mcoadname
 * @property string $mcoahno
 * @property integer $active
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Mcoah $mcoahno0
 * @property Tjmd[] $tjmds
 */
class Mcoad extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'mcoad';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['mcoadno', 'mcoadname', 'mcoahno', 'created_at'], 'required'],
            [['active'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['mcoadno', 'mcoahno'], 'string', 'max' => 6],
            [['mcoadname'], 'string', 'max' => 50],
            [['mcoahno'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoah::className(), 'targetAttribute' => ['mcoahno' => 'mcoahno']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'mcoadno' => Yii::t('app', 'No Akun'),
            'mcoadname' => Yii::t('app', 'Nama Akun'),
            'mcoahno' => Yii::t('app', 'No Master'),
            'active' => Yii::t('app', 'Active'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoahno0()
    {
        return $this->hasOne(Mcoah::className(), ['mcoahno' => 'mcoahno']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTjmds()
    {
        return $this->hasMany(Tjmd::className(), ['mcoadno' => 'mcoadno']);
    }
}
