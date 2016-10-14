<?php

namespace rest\models;

use Yii;
use yii\db\Query;

/**
 * This is the model class for table "siswa".
 *
 * @property integer $id
 * @property string $nis
 * @property string $nisn
 * @property string $nama_siswa
 * @property integer $sekolahid
 * @property string $nama_panggilan
 * @property string $jk
 * @property string $agama
 * @property string $tempat_lahir
 * @property string $tanggal_lahir
 * @property integer $anak_ke
 * @property integer $jml_saudara
 * @property string $asal_sekolah
 * @property string $alamat
 * @property string $kelurahan
 * @property string $kecamatan
 * @property string $kota
 * @property string $kodepos
 * @property string $tlp_rumah
 * @property string $nama_ayah
 * @property string $hp_ayah
 * @property string $pekerjaan_ayah
 * @property string $tempat_kerja_ayah
 * @property string $jabatan_ayah
 * @property string $pendidikan_ayah
 * @property string $email_ayah
 * @property string $nama_ibu
 * @property string $hp_ibu
 * @property string $pekerjaan_ibu
 * @property string $tempat_kerja_ibu
 * @property string $jabatan_ibu
 * @property string $pendidikan_ibu
 * @property string $email_ibu
 * @property integer $berat
 * @property integer $tinggi
 * @property string $gol_darah
 * @property string $riwayat_kesehatan
 * @property string $jenis_tempat_tinggal
 * @property string $jarak_ke_sekolah
 * @property string $sarana_transportasi
 * @property string $keterangan
 * @property string $created_at
 * @property string $updated_at
 * @property string $avatar
 *
 * @property Sekolah $sekolah
 * @property SiswaRombel[] $siswaRombels
 */
class Siswa extends \rest\models\AppActiveRecord // \yii\db\ActiveRecord
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
        return 'siswa';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['nama_siswa', 'sekolahid'], 'required'],
            [['sekolahid', 'anak_ke', 'jml_saudara', 'berat', 'tinggi'], 'integer'],
            [['tanggal_lahir', 'created_at', 'updated_at'], 'safe'],
            [['avatar'], 'string'],
            [['nis'], 'string', 'max' => 10],
            [['nisn', 'agama'], 'string', 'max' => 15],
            [['nama_siswa'], 'string', 'max' => 100],
            [['nama_panggilan', 'kelurahan', 'kecamatan', 'jabatan_ayah', 'jabatan_ibu'], 'string', 'max' => 35],
            [['jk'], 'string', 'max' => 1],
            [['tempat_lahir', 'kota'], 'string', 'max' => 25],
            [['asal_sekolah', 'tlp_rumah', 'nama_ayah', 'hp_ayah', 'pekerjaan_ayah', 'tempat_kerja_ayah', 'email_ayah', 'nama_ibu', 'hp_ibu', 'pekerjaan_ibu', 'tempat_kerja_ibu', 'email_ibu', 'jenis_tempat_tinggal', 'sarana_transportasi'], 'string', 'max' => 50],
            [['alamat', 'riwayat_kesehatan', 'keterangan'], 'string', 'max' => 255],
            [['kodepos'], 'string', 'max' => 7],
            [['pendidikan_ayah', 'pendidikan_ibu', 'gol_darah'], 'string', 'max' => 5],
            [['jarak_ke_sekolah'], 'string', 'max' => 20],
            [['nis'], 'unique'],
            [['nisn'], 'unique'],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID Siswa'),
            'nis' => Yii::t('app', 'NIS'),
            'nisn' => Yii::t('app', 'NISN'),
            'nama_siswa' => Yii::t('app', 'Nama Siswa'),
            'sekolahid' => Yii::t('app', 'SekolahId'),
            'nama_panggilan' => Yii::t('app', 'Nama Panggilan'),
            'jk' => Yii::t('app', 'Jk'),
            'agama' => Yii::t('app', 'Agama'),
            'tempat_lahir' => Yii::t('app', 'Tempat Lahir'),
            'tanggal_lahir' => Yii::t('app', 'Tanggal Lahir'),
            'anak_ke' => Yii::t('app', 'Anak Ke'),
            'jml_saudara' => Yii::t('app', 'Jml Saudara'),
            'asal_sekolah' => Yii::t('app', 'Asal Sekolah'),
            'alamat' => Yii::t('app', 'Alamat'),
            'kelurahan' => Yii::t('app', 'Kelurahan'),
            'kecamatan' => Yii::t('app', 'Kecamatan'),
            'kota' => Yii::t('app', 'Kota'),
            'kodepos' => Yii::t('app', 'Kodepos'),
            'tlp_rumah' => Yii::t('app', 'Tlp Rumah'),
            'nama_ayah' => Yii::t('app', 'Nama Ayah'),
            'hp_ayah' => Yii::t('app', 'Hp Ayah'),
            'pekerjaan_ayah' => Yii::t('app', 'Pekerjaan Ayah'),
            'tempat_kerja_ayah' => Yii::t('app', 'Tempat Kerja Ayah'),
            'jabatan_ayah' => Yii::t('app', 'Jabatan Ayah'),
            'pendidikan_ayah' => Yii::t('app', 'Pendidikan Ayah'),
            'email_ayah' => Yii::t('app', 'Email Ayah'),
            'nama_ibu' => Yii::t('app', 'Nama Ibu'),
            'hp_ibu' => Yii::t('app', 'Hp Ibu'),
            'pekerjaan_ibu' => Yii::t('app', 'Pekerjaan Ibu'),
            'tempat_kerja_ibu' => Yii::t('app', 'Tempat Kerja Ibu'),
            'jabatan_ibu' => Yii::t('app', 'Jabatan Ibu'),
            'pendidikan_ibu' => Yii::t('app', 'Pendidikan Ibu'),
            'email_ibu' => Yii::t('app', 'Email Ibu'),
            'berat' => Yii::t('app', 'Berat'),
            'tinggi' => Yii::t('app', 'Tinggi'),
            'gol_darah' => Yii::t('app', 'Gol Darah'),
            'riwayat_kesehatan' => Yii::t('app', 'Riwayat Kesehatan'),
            'jenis_tempat_tinggal' => Yii::t('app', 'Jenis Tempat Tinggal'),
            'jarak_ke_sekolah' => Yii::t('app', 'Jarak Ke Sekolah'),
            'sarana_transportasi' => Yii::t('app', 'Sarana Transportasi'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'avatar' => Yii::t('app', 'Avatar'),
        ];
    }

    public function scenarios(){
        $scenarios = parent::scenarios();
        $scenarios['avatar'] = ['avatar'];//Scenario Values Only Accepted
        return $scenarios;
    }

    public function getAvatarPath()
    {
        $baseurl = Yii::$app->urlManager->createAbsoluteUrl(\Yii::$app->params['profile_siswa_path'] . $this->avatar);
        return (isset($this->avatar) && !empty($this->avatar)) ? $baseurl : '';
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
        return $this->hasMany(SiswaRombel::className(), ['siswaid' => 'id']);
    }

    /**
     * Save header data, detail data and posting to buku besar
     * @param $params, Array parameter post
     * 
     */
    public function saveBatch($params)
    {
        extract($params);
        $DB = $this->getDb();
        $transaction = $DB->beginTransaction();
        $column = $this->attributes();
        unset($column[0]);

        $column = [
            // 'id',
            'nis',
            'nisn',
            'nama_siswa',
            'nama_panggilan',
            'jk',
            'asal_sekolah',
            'tempat_lahir',
            'tanggal_lahir',
            'anak_ke',
            'jml_saudara',
            'berat',
            'tinggi',
            'gol_darah',
            'riwayat_kesehatan',
            'alamat',
            'kelurahan',
            'kecamatan',
            'kota',
            'kodepos',
            'tlp_rumah',
            'nama_ayah',
            'hp_ayah',
            'pekerjaan_ayah',
            'tempat_kerja_ayah',
            'jabatan_ayah',
            'pendidikan_ayah',
            'email_ayah',
            'nama_ibu',
            'hp_ibu',
            'pekerjaan_ibu',
            'tempat_kerja_ibu',
            'jabatan_ibu',
            'pendidikan_ibu',
            'email_ibu',
            'jenis_tempat_tinggal',
            'jarak_ke_sekolah',
            'sarana_transportasi',
            'keterangan',
            'sekolahid',
            'created_at',
            'updated_at'
        ];

        try {

            $saved = $DB->createCommand()->batchInsert(
                self::tableName(),
                $column, 
                $rowDetail
            );
            $saved->setSql($saved->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
            // echo $saved->rawSql. '<br/>';
            $saved->execute();

            $this->created_at = $created_at;
            $this->saveLogs([
                'rows' => $rowDetail
            ], $sekolahid);

            $transaction->commit();
            return true;
        } catch(\Exception $e) {
            $msg =  (string)($e) . ' on ' . __METHOD__;
            \Yii::error(date('Y-m-d H:i:s A') . ' Error during save data. ' . $msg);
            $transaction->rollBack();
            return [
                'name' => 'Error during save data.',
                'message' => (isset($e->errorInfo)) ? $e->errorInfo : 'Undefined error',
                'log' => $msg
            ];
        }
    }

    private function setOnDuplicateValue($column){
        $values = [];
        foreach($column as $col){
            if($col != 'created_at'){
                $values[]= '`'.$col.'` = VALUES(' . $col .')';
            }
        }
        return implode(',', $values);
    }
}
