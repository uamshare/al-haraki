<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "pengaturan".
 *
 * @property integer $pid
 * @property string $pjudul
 * @property string $pdeskripsi
 * @property integer $sekolahid
 * @property string $created_at
 * @property string $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 */
class Pengaturan extends \rest\models\AppActiveRecord
{
    protected $isAutoSaveLog = true;
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
    public static function tableName()
    {
        return 'pengaturan';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['pjudul', 'pdeskripsi', 'sekolahid'], 'required'],
            [['pdeskripsi'], 'string'],
            [['sekolahid', 'created_by', 'updated_by'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['pjudul'], 'string', 'max' => 50],
            [['pjudul', 'sekolahid'], 'unique', 'targetAttribute' => ['pjudul', 'sekolahid'], 'message' => 'The combination of Pjudul and Sekolahid has already been taken.'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'pid' => Yii::t('app', 'Pid'),
            'pjudul' => Yii::t('app', 'Pjudul'),
            'pdeskripsi' => Yii::t('app', 'Pdeskripsi'),
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
}
