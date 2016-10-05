<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "user_auth".
 *
 * @property integer $userid
 * @property string $access_token
 * @property string $auth_key
 * @property string $create_at
 * @property string $expired_at
 *
 * @property User $user
 */
class UserAuth extends \rest\models\AppActiveRecord
{
    protected $isAutoSaveLog = true;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_auth';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['userid'], 'required'],
            [['userid'], 'integer'],
            [['created_at', 'expired_at'], 'safe'],
            [['access_token'], 'string', 'max' => 255],
            [['auth_key'], 'string', 'max' => 32],
            [['userid'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['userid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'userid' => Yii::t('app', 'Userid'),
            'access_token' => Yii::t('app', 'Access Token'),
            'auth_key' => Yii::t('app', 'Auth Key'),
            'created_at' => Yii::t('app', 'Create At'),
            'expired_at' => Yii::t('app', 'Expired At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'userid']);
    }
}
