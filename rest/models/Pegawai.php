<?php

namespace rest\models;

use Yii;
use yii\db\Query;

/**
 * This is the model class for table "pegawai".
 *
 * @property integer $id
 * @property string $nik
 * @property string $nuptk
 * @property string $nama_pegawai
 * @property integer $sekolahid
 * @property string $nama_panggilan
 * @property string $jk
 * @property integer $berat
 * @property integer $tinggi
 * @property string $gol_darah
 * @property string $agama
 * @property string $tempat_lahir
 * @property string $tanggal_lahir
 * @property string $alamat_ktp
 * @property string $alamat_domisili
 * @property string $tlp
 * @property string $no_ktp
 * @property string $status_rumah
 * @property string $pendidikan_terakhir
 * @property string $kependidikan
 * @property string $jurusan
 * @property string $nim_ijasah
 * @property string $no_sertifikat_sertifikasi
 * @property string $no_peserta_sertifikasi
 * @property string $pengalaman_kerja
 * @property string $bahasa_dikuasai
 * @property string $kursus_pelatihan
 * @property string $riwayat_penyakit_khusus
 * @property string $status_pernikahan
 * @property string $nama_pasangan
 * @property string $pekerjaan_pasangan
 * @property integer $jumlah_anak
 * @property string $nama_ayah_kandung
 * @property string $nama_ibu_kandung
 * @property integer $jumlah_saudara
 * @property string $tanggal_mulai_bertugas
 * @property string $status_kepegawaian
 * @property string $jarak_dari_rumah
 * @property string $transportasi
 * @property string $keterangan
 * @property string $nomor_bpjs_kesehatan
 * @property string $nomor_bpjs_ketenagakerjaan
 * @property string $ukuran_baju
 * @property string $jabatan
 * @property string $created_at
 * @property string $updated_at
 * @property string $avatar
 *
 * @property Sekolah $sekolah
 * @property User[] $users
 */
class Pegawai extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'pegawai';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['nama_pegawai', 'sekolahid'], 'required'],
            [['sekolahid', 'berat', 'tinggi', 'jumlah_anak', 'jumlah_saudara'], 'integer'],
            [['jk', 'kependidikan', 'avatar'], 'string'],
            [['tanggal_lahir', 'tanggal_mulai_bertugas', 'created_at', 'updated_at'], 'safe'],
            [['jarak_dari_rumah'], 'number'],
            [['nik', 'nuptk', 'agama', 'status_rumah', 'status_pernikahan', 'jabatan'], 'string', 'max' => 15],
            [['nama_pegawai', 'pengalaman_kerja'], 'string', 'max' => 100],
            [['nama_panggilan'], 'string', 'max' => 20],
            [['gol_darah'], 'string', 'max' => 3],
            [['tempat_lahir', 'tlp', 'no_ktp', 'jurusan', 'nim_ijasah', 'status_kepegawaian', 'nomor_bpjs_kesehatan', 'nomor_bpjs_ketenagakerjaan'], 'string', 'max' => 25],
            [['alamat_ktp', 'alamat_domisili', 'bahasa_dikuasai', 'kursus_pelatihan', 'riwayat_penyakit_khusus', 'nama_ibu_kandung', 'keterangan'], 'string', 'max' => 255],
            [['pendidikan_terakhir', 'ukuran_baju'], 'string', 'max' => 5],
            [['no_sertifikat_sertifikasi', 'no_peserta_sertifikasi', 'pekerjaan_pasangan', 'transportasi'], 'string', 'max' => 35],
            [['nama_pasangan', 'nama_ayah_kandung'], 'string', 'max' => 50],
            [['nik'], 'unique'],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
        ];
    }

    public function scenarios(){
        $scenarios = parent::scenarios();
        $scenarios['avatar'] = ['avatar'];//Scenario Values Only Accepted
        return $scenarios;
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'nik' => Yii::t('app', 'Nik'),
            'nuptk' => Yii::t('app', 'Nuptk'),
            'nama_pegawai' => Yii::t('app', 'Nama Pegawai'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'nama_panggilan' => Yii::t('app', 'Nama Panggilan'),
            'jk' => Yii::t('app', 'Jk'),
            'berat' => Yii::t('app', 'Berat'),
            'tinggi' => Yii::t('app', 'Tinggi'),
            'gol_darah' => Yii::t('app', 'Gol Darah'),
            'agama' => Yii::t('app', 'Agama'),
            'tempat_lahir' => Yii::t('app', 'Tempat Lahir'),
            'tanggal_lahir' => Yii::t('app', 'Tanggal Lahir'),
            'alamat_ktp' => Yii::t('app', 'Alamat Ktp'),
            'alamat_domisili' => Yii::t('app', 'Alamat Domisili'),
            'tlp' => Yii::t('app', 'Tlp'),
            'no_ktp' => Yii::t('app', 'No Ktp'),
            'status_rumah' => Yii::t('app', 'Status Rumah'),
            'pendidikan_terakhir' => Yii::t('app', 'Pendidikan Terakhir'),
            'kependidikan' => Yii::t('app', 'Kependidikan'),
            'jurusan' => Yii::t('app', 'Jurusan'),
            'nim_ijasah' => Yii::t('app', 'Nim Ijasah'),
            'no_sertifikat_sertifikasi' => Yii::t('app', 'No Sertifikat Sertifikasi'),
            'no_peserta_sertifikasi' => Yii::t('app', 'No Peserta Sertifikasi'),
            'pengalaman_kerja' => Yii::t('app', 'Pengalaman Kerja'),
            'bahasa_dikuasai' => Yii::t('app', 'Bahasa Dikuasai'),
            'kursus_pelatihan' => Yii::t('app', 'Kursus Pelatihan'),
            'riwayat_penyakit_khusus' => Yii::t('app', 'Riwayat Penyakit Khusus'),
            'status_pernikahan' => Yii::t('app', 'Status Pernikahan'),
            'nama_pasangan' => Yii::t('app', 'Nama Pasangan'),
            'pekerjaan_pasangan' => Yii::t('app', 'Pekerjaan Pasangan'),
            'jumlah_anak' => Yii::t('app', 'Jumlah Anak'),
            'nama_ayah_kandung' => Yii::t('app', 'Nama Ayah Kandung'),
            'nama_ibu_kandung' => Yii::t('app', 'Nama Ibu Kandung'),
            'jumlah_saudara' => Yii::t('app', 'Jumlah Saudara'),
            'tanggal_mulai_bertugas' => Yii::t('app', 'Tanggal Mulai Bertugas'),
            'status_kepegawaian' => Yii::t('app', 'Status Kepegawaian'),
            'jarak_dari_rumah' => Yii::t('app', 'Jarak Dari Rumah'),
            'transportasi' => Yii::t('app', 'Transportasi'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'nomor_bpjs_kesehatan' => Yii::t('app', 'Nomor Bpjs Kesehatan'),
            'nomor_bpjs_ketenagakerjaan' => Yii::t('app', 'Nomor Bpjs Ketenagakerjaan'),
            'ukuran_baju' => Yii::t('app', 'Ukuran Baju'),
            'jabatan' => Yii::t('app', 'Jabatan'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'avatar' => Yii::t('app', 'Avatar'),
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
    public function getUsers()
    {
        return $this->hasMany(User::className(), ['pegawai_id' => 'id']);
    }

    public function getAvatarPath(){

        $baseurl = Yii::$app->urlManager->createAbsoluteUrl(\Yii::$app->params['profile_pegawai_path'] . $this->avatar);
        return $baseurl;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function getList($params){
        $customeQuery = new Query;
        $customeQuery->select('`id`,
                  `nik`,
                  `nuptk`,
                  `nama_pegawai`,
                  `sekolahid`,
                  `nama_panggilan`,
                  `jk`,
                  `berat`,
                  `tinggi`,
                  `gol_darah`,
                  `agama`,
                  `tempat_lahir`,
                  `tanggal_lahir`,
                  `alamat_ktp`,
                  `alamat_domisili`,
                  `tlp`,
                  `no_ktp`,
                  `status_rumah`,
                  `pendidikan_terakhir`,
                  `kependidikan`,
                  `jurusan`,
                  `nim_ijasah`,
                  `no_sertifikat_sertifikasi`,
                  `no_peserta_sertifikasi`,
                  `pengalaman_kerja`,
                  `bahasa_dikuasai`,
                  `kursus_pelatihan`,
                  `riwayat_penyakit_khusus`,
                  `status_pernikahan`,
                  `nama_pasangan`,
                  `pekerjaan_pasangan`,
                  `jumlah_anak`,
                  `nama_ayah_kandung`,
                  `nama_ibu_kandung`,
                  `jumlah_saudara`,
                  `tanggal_mulai_bertugas`,
                  `status_kepegawaian`,
                  `jarak_dari_rumah`,
                  `transportasi`,
                  `keterangan`,
                  `nomor_bpjs_kesehatan`,
                  `nomor_bpjs_ketenagakerjaan`,
                  `ukuran_baju`,
                  `jabatan`,
                  `created_at`,
                  `updated_at` ')
            ->from(self::tableName());

        extract($params);
        $customeQuery->where('1=1');

        if(isset($id) && $id){
            $customeQuery->andWhere(['id' => $id]);
        }

        if(isset($nik) && $nik){
            $customeQuery->andWhere(['nik' => $Nik]);
        }

        if(isset($nuptk) && $nuptk){
            $customeQuery->andWhere(['nuptk' => $nuptk]);
        }

        if(isset($nama_pegawai) && $nama_pegawai){
            $customeQuery->andWhere(['nama_pegawai' => $nama_pegawai]);
        }

        if(isset($nama_panggilan) && $nama_panggilan){
            $customeQuery->andWhere(['nama_panggilan' => $nama_panggilan]);
        }

        if(isset($sekolahid) && $sekolahid){
            $customeQuery->andWhere(['sekolahid' => $sekolahid]);
        }

        if(isset($query) && $query){
            $customeQuery->andFilterWhere([
                'or',
                ['like', 'nik', $query],
                ['like', 'nuptk', $query],
                ['like', 'nama_pegawai', $query],
                ['like', 'nama_panggilan', $query]
            ]);
        }   

        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }
}
