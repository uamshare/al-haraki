<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "sekolah".
 *
 * @property integer $id
 * @property string $nama
 * @property string $alamat
 * @property string $tingkatan
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Kelas[] $kelas
 * @property KwitansiPembayaranH[] $kwitansiPembayaranHs
 * @property KwitansiPengeluaranH[] $kwitansiPengeluaranHs
 * @property Pegawai[] $pegawais
 * @property Siswa[] $siswas
 */
class Sekolah extends \rest\models\AppActiveRecord //\yii\db\ActiveRecord
{
    protected $isAutoSaveLog = true;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'sekolah';
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
            [['nama'], 'required'],
            [['alamat', 'tingkatan'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['nama'], 'string', 'max' => 50],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'nama' => Yii::t('app', 'Nama'),
            'alamat' => Yii::t('app', 'Alamat'),
            'tingkatan' => Yii::t('app', 'Tingkatan'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKelas()
    {
        return $this->hasMany(Kelas::className(), ['sekolahid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPembayaranHs()
    {
        return $this->hasMany(KwitansiPembayaranH::className(), ['sekolahid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKwitansiPengeluaranHs()
    {
        return $this->hasMany(KwitansiPengeluaranH::className(), ['sekolahid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPegawais()
    {
        return $this->hasMany(Pegawai::className(), ['sekolahid' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getKepalaSekolah()
    {
        return $this->hasOne(Pegawai::className(), ['sekolahid' => 'id'])->where(['jabatan' => 'Kepala Sekolah']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSiswas()
    {
        return $this->hasMany(Siswa::className(), ['sekolahid' => 'id']);
    }

    public static function getProfile($id){

        $self = static::find()->where(['id' => $id])->one();
        // var_dump($self);exit();
        $tahunAjaran = \rest\models\TahunAjaran::getActive();

        return [
            'sekolahid' => $self->id,
            'nama_sekolah' => $self->nama,
            'alamat' => $self->alamat,
            'tingkatan' => $self->tingkatan,
            'kepala_sekolah' => $self->kepalaSekolah->nama_pegawai,
            'tahun_ajaran_id' => $tahunAjaran->id,
            'tahun_ajaran' => $tahunAjaran->tahun_ajaran,
            'tahun_awal' => $tahunAjaran->tahun_awal,
            'tahun_akhir' => $tahunAjaran->tahun_akhir
        ];
    }
}
