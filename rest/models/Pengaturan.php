<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "pengaturan".
 *
 * @property string $keyid
 * @property string $nama_pengaturan
 * @property string $value
 * @property string $created_at
 * @property string $updated_at
 */
class Pengaturan extends \yii\db\ActiveRecord
{
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
            [['keyid'], 'required'],
            [['created_at', 'updated_at'], 'safe'],
            [['keyid', 'nama_pengaturan', 'value'], 'string', 'max' => 50],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'keyid' => Yii::t('app', 'Keyid'),
            'nama_pengaturan' => Yii::t('app', 'Nama Pengaturan'),
            'value' => Yii::t('app', 'Value'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }
}
