<?php

namespace rest\models;

use Yii;
use yii\db\Query;

/**
 * This is the model class for table "tagihan_info_input".
 *
 * @property integer $id
 * @property integer $idrombel
 * @property integer $spp
 * @property integer $komite_sekolah
 * @property integer $catering
 * @property integer $keb_siswa
 * @property integer $ekskul
 * @property string $keterangan
 * @property string $created_at
 * @property string $updated_at
 *
 * @property SiswaRombel $idrombel0
 */
class TagihanInfoInput extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tagihan_info_input';
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
            [['idrombel'], 'required'],
            [['idrombel', 'spp', 'komite_sekolah', 'catering', 'keb_siswa', 'ekskul'], 'integer'],
            [['keterangan'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['idrombel'], 'exist', 'skipOnError' => true, 'targetClass' => SiswaRombel::className(), 'targetAttribute' => ['idrombel' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'idrombel' => Yii::t('app', 'Idrombel'),
            'spp' => Yii::t('app', 'Spp'),
            'komite_sekolah' => Yii::t('app', 'Komite Sekolah'),
            'catering' => Yii::t('app', 'Catering'),
            'keb_siswa' => Yii::t('app', 'Keb Siswa'),
            'ekskul' => Yii::t('app', 'Ekskul'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIdrombel0()
    {
        return $this->hasOne(SiswaRombel::className(), ['id' => 'idrombel']);
    }

    public function getListInput($param){
        $customeQuery = new Query;
        $customeQuery->select('*')
            ->from('(SELECT    b.`id`
                      , a.id AS `idrombel`
                      , a.`siswaid`
                      , s.`nama_siswa` 
                      , a.`kelasid`
                      , a.`tahun_ajaran_id`
                      , b.`spp`
                      , b.`komite_sekolah`
                      , b.`catering`
                      , b.`keb_siswa`
                      , b.`ekskul`
                      , b.`keterangan`
                      , b.`created_at`
                      , b.`updated_at`
                FROM siswa_rombel a
                INNER JOIN siswa s ON a.`siswaid`=s.`id`
                LEFT JOIN tagihan_info_input b ON a.`id` = b.`idrombel`) as q_info_tagihan');

        extract($param);
        $customeQuery->where('1=1');
        if($idrombel){
            $customeQuery->andWhere('idrombel=' . $idrombel);
        }

        if($kelasid){
            $customeQuery->andWhere('kelasid=' . $kelasid);
        }

        if($tahun_ajaran_id){
            $customeQuery->andWhere('tahun_ajaran_id=' . $tahun_ajaran_id);
        }

        if($query){
            $customeQuery->andFilterWhere([
                'or',
                ['like', 'nama_siswa', $query],
                ['like', 'keterangan', $query],
            ]);
        }   

        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }
}
