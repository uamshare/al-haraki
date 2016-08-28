<?php

namespace rest\models;

use Yii;
use yii\db\Query;

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
class User extends \rest\models\AppActiveRecord
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
            [['username'], 'required'],
            [['auth_key', 'password_hash'], 'required'],
            [['status', 'pegawai_id','sekolahid'], 'integer'],
            [['type_token'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['username', 'password_hash', 'password_reset_token', 'email', 'access_token'], 'string', 'max' => 255],
            [['auth_key'], 'string', 'max' => 32],
            [['username'], 'unique'],
            // [['email'], 'unique'],
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
            'sekolahid' => Yii::t('app', 'Sekolah ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    public function init() {
        parent::init();
        // $this->on(parent::EVENT_AFTER_FIND, [$this, 'afterFind']);
        // $this->on(parent::EVENT_BEFORE_UPDATE, [$this, 'beforeUpdate']);
        // $this->on(parent::EVENT_BEFORE_INSERT, [$this, 'beforInsert']);
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
            'sekolahid' => $this->sekolahid,
        ];
    }

    // public function beforeValidate(){
    //     if($this->isNewRecord){
    //         $this->auth_key = Yii::$app->getSecurity()->generateRandomString();
    //         $this->password_hash = Yii::$app->security->generatePasswordHash($this->password_hash);
    //     }else{
    //         $old = $this->oldAttributes;
    //         // $this->password_hash = (empty($this->password_hash)) ? $old['password_hash'] : 
    //         //                             Yii::$app->security->generatePasswordHash($this->password_hash);
    //     }
        
    //     return parent::beforeValidate();
    // }

    /**
     * Get List input Info Tagihan
     *
     */
    public function getList($params){
        $customeQuery = new Query;
        $customeQuery
            ->select([
                'a.`id`',
                'a.`username`',
                'a.`email`',
                'a.`status`',
                'a.`pegawai_id`',
                'p.`nama_pegawai`',
                'a.`sekolahid`',
                'IF(a.sekolahid = 0, "All", `s`.`nama`) AS `sekolah`',
                'b.item_name as role',
                'a.`created_at`',
                'a.`updated_at`',
            ])
            ->from('user a')
            ->leftJoin('auth_assignment b', 'b.user_id = a.id')
            ->leftJoin('pegawai p', 'p.id = a.pegawai_id')
            ->leftJoin('sekolah s', 's.id = a.sekolahid');

        if(is_array($params)){
            extract($params);
            $customeQuery->where('1=1');

            if(isset($id) && $id){
                $customeQuery->andWhere(['a.id' => $id]);
            }

            if(isset($username) && $username){
                $customeQuery->andWhere(['a.username' => $username]);
            }

            if(isset($email) && $email){
                $customeQuery->andWhere(['a.email' => $email]);
            }

            if(isset($query) && $query){
                $customeQuery->andFilterWhere([
                    'or',
                    ['like', 'username', $query],
                    ['like', 'email', $query],
                ]);
            }  
        }else if(is_string($params) || is_int($params)){
            $customeQuery->andWhere(['a.id' => $params]);
        }
         
        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }

}
