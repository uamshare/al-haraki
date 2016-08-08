<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "mcoah".
 *
 * @property string $mcoahno
 * @property string $mcoahname
 * @property integer $mcoacid
 * @property string $postbalance
 * @property string $postgl
 * @property string $active
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Mcoad[] $mcoads
 * @property Mcoac $mcoac
 */
class Mcoah extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'mcoah';
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
            [['mcoahno', 'mcoahname', 'mcoacid', 'created_at'], 'required'],
            [['mcoacid'], 'integer'],
            [['postbalance', 'postgl', 'active'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['mcoahno'], 'string', 'max' => 6],
            [['mcoahname'], 'string', 'max' => 100],
            [['mcoacid'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoac::className(), 'targetAttribute' => ['mcoacid' => 'mcoacid']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'mcoahno' => Yii::t('app', 'No Akun'),
            'mcoahname' => Yii::t('app', 'Akun Master'),
            'mcoacid' => Yii::t('app', 'Klasifikasi'),
            'postbalance' => Yii::t('app', 'Posisi Neraca (Balance)'),
            'postgl' => Yii::t('app', 'Posisi Buku Besar (GL)'),
            'active' => Yii::t('app', 'Active'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoads()
    {
        return $this->hasMany(Mcoad::className(), ['mcoahno' => 'mcoahno']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoac()
    {
        return $this->hasOne(Mcoac::className(), ['mcoacid' => 'mcoacid']);
    }
}
