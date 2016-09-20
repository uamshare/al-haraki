<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "kelas".
 *
 * @property integer $id
 * @property integer $kelas
 * @property string $nama_kelas
 * @property integer $sekolahid
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Sekolah $sekolah
 * @property SiswaRombel[] $siswaRombels
 */
class Kelas extends \rest\models\AppActiveRecord // \yii\db\ActiveRecord
{
    protected $isAutoSaveLog = true;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'kelas';
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
            [['kelas', 'sekolahid'], 'required'],
            [['kelas', 'sekolahid'], 'integer'],
            [['created_at'], 'safe'],
            [['nama_kelas'], 'string', 'max' => 50],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'kelas' => Yii::t('app', 'Kelas'),
            'nama_kelas' => Yii::t('app', 'Nama Kelas'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    public function extraFields()
    {
        return [ 
            'siswacount' => function($model) {
                return ($model->siswaRombels) ? $model->siswaRombels->count() : 0;
            }
        ];
    }
    
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSekolah()
    {
        return $this->hasOne(Sekolah::className(), ['id' => 'sekolahid']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSiswaRombels()
    {
        return $this->hasMany(SiswaRombel::className(), ['kelasid' => 'id']);
    }

    public function getList($param){
        $customeQuery = self::find()->with('siswaRombels');
        extract($param);
        
        $customeQuery->where('1=1');
        if($id){
            $customeQuery->andWhere('id=' . $id);
        }

        if($sekolahid){
            $customeQuery->andWhere('sekolahid=' . $sekolahid);
        }

        if($query){
            $customeQuery->andFilterWhere([
                'or',
                ['like', 'nama_kelas', $query]
            ]);
        }   

        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }
}
