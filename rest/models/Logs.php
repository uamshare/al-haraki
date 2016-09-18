<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "logs".
 *
 * @property integer $id
 * @property string $dirty_attributes
 * @property string $tablename
 * @property string $controller_id
 * @property string $action_id
 * @property integer $sekolahid
 * @property string $created_at
 * @property integer $created_by
 */
class Logs extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'logs';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['dirty_attributes'], 'string'],
            [['sekolahid'], 'required'],
            [['sekolahid', 'created_by'], 'integer'],
            [['created_at'], 'safe'],
            [['tablename', 'controller_id', 'action_id'], 'string', 'max' => 35],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'dirty_attributes' => Yii::t('app', 'Dirty Attributes'),
            'tablename' => Yii::t('app', 'Tablename'),
            'controller_id' => Yii::t('app', 'Controller ID'),
            'action_id' => Yii::t('app', 'Action ID'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'created_at' => Yii::t('app', 'Created At'),
            'created_by' => Yii::t('app', 'Created By'),
        ];
    }
}
