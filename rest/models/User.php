<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property string $username
 * @property string $auth_key
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property integer $status
 * @property string $access_token
 * @property string $type_token
 * @property integer $pegawai_id
 * @property string $created_at
 * @property string $updated_at
 *
 * @property KwitansiPembayaranH[] $kwitansiPembayaranHs
 * @property KwitansiPembayaranH[] $kwitansiPembayaranHs0
 * @property KwitansiPengeluaranH[] $kwitansiPengeluaranHs
 * @property KwitansiPengeluaranH[] $kwitansiPengeluaranHs0
 * @property Pegawai $pegawai
 */
class User extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['username', 'auth_key', 'password_hash', 'email', 'access_token', 'created_at', 'updated_at'], 'required'],
            [['status', 'pegawai_id'], 'integer'],
            [['type_token'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['username', 'password_hash', 'password_reset_token', 'email', 'access_token'], 'string', 'max' => 255],
            [['auth_key'], 'string', 'max' => 32],
            [['username'], 'unique'],
            [['email'], 'unique'],
            [['password_reset_token'], 'unique'],
            [['pegawai_id'], 'exist', 'skipOnError' => true, 'targetClass' => Pegawai::className(), 'targetAttribute' => ['pegawai_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'username' => Yii::t('app', 'Username'),
            'auth_key' => Yii::t('app', 'Auth Key'),
            'password_hash' => Yii::t('app', 'Password Hash'),
            'password_reset_token' => Yii::t('app', 'Password Reset Token'),
            'email' => Yii::t('app', 'Email'),
            'status' => Yii::t('app', 'Status'),
            'access_token' => Yii::t('app', 'Access Token'),
            'type_token' => Yii::t('app', 'Type Token'),
            'pegawai_id' => Yii::t('app', 'Pegawai ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPembayaranHs()
    {
        return $this->hasMany(KwitansiPembayaranH::className(), ['created_by' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPembayaranHs0()
    {
        return $this->hasMany(KwitansiPembayaranH::className(), ['updated_by' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPengeluaranHs()
    {
        return $this->hasMany(KwitansiPengeluaranH::className(), ['created_by' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPengeluaranHs0()
    {
        return $this->hasMany(KwitansiPengeluaranH::className(), ['updated_by' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPegawai()
    {
        return $this->hasOne(Pegawai::className(), ['id' => 'pegawai_id']);
    }

    public function getProfile(){
        return [
            'name' => $this->username,
            'fullname' => ($this->pegawai) ? $this->pegawai->nama_pegawai : $this->username,
            'jabatan' => ($this->pegawai) ? $this->pegawai->jabatan : '',
            'sekolahid' => 0, //($this->pegawai) ? $this->pegawai->sekolahid : 0,
        ];
    }

}
