<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "siswa_rombel".
 *
 * @property integer $id
 * @property integer $siswaid
 * @property integer $kelasid
 * @property string $tahun_ajaran_id
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Siswa $siswa
 * @property Kelas $kelas
 * @property TahunAjaran $tahunAjaran
 * @property TagihanInfoInput[] $tagihanInfoInputs
 * @property TagihanPembayaran[] $tagihanPembayarans
 */
class SiswaRombel extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'siswa_rombel';
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
            [['siswaid', 'kelasid', 'tahun_ajaran_id'], 'required'],
            [['siswaid', 'kelasid'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
            [['siswaid', 'kelasid', 'tahun_ajaran_id'], 'unique', 'targetAttribute' => ['siswaid', 'kelasid', 'tahun_ajaran_id'], 'message' => 'The combination of Siswaid, Kelasid and Tahun Ajaran ID has already been taken.'],
            [['siswaid'], 'exist', 'skipOnError' => true, 'targetClass' => Siswa::className(), 'targetAttribute' => ['siswaid' => 'id']],
            [['kelasid'], 'exist', 'skipOnError' => true, 'targetClass' => Kelas::className(), 'targetAttribute' => ['kelasid' => 'id']],
            [['tahun_ajaran_id'], 'exist', 'skipOnError' => true, 'targetClass' => TahunAjaran::className(), 'targetAttribute' => ['tahun_ajaran_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'siswaid' => Yii::t('app', 'Siswaid'),
            'kelasid' => Yii::t('app', 'Kelasid'),
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSiswa()
    {
        return $this->hasOne(Siswa::className(), ['id' => 'siswaid']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKelas()
    {
        return $this->hasOne(Kelas::className(), ['id' => 'kelasid']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTahunAjaran()
    {
        return $this->hasOne(TahunAjaran::className(), ['id' => 'tahun_ajaran_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTagihanInfoInputs()
    {
        return $this->hasMany(TagihanInfoInput::className(), ['idrombel' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTagihanPembayarans()
    {
        return $this->hasMany(TagihanPembayaran::className(), ['idrombel' => 'id']);
    }
}
