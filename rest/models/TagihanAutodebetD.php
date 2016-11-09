<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tagihan_autodebet_d".
 *
 * @property integer $id
 * @property string $no_transaksi
 * @property integer $idrombel
 * @property string $nis
 * @property string $nisn
 * @property string $nama_siswa
 * @property string $no_rekening
 * @property string $nama_no_rekening
 * @property integer $spp
 * @property integer $komite_sekolah
 * @property integer $catering
 * @property integer $keb_siswa
 * @property integer $ekskul
 * @property integer $total
 * @property string $created_at
 * @property string $updated_at
 *
 * @property TagihanAutodebetH $noTransaksi
 * @property SiswaRombel $idrombel0
 */
class TagihanAutodebetD extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tagihan_autodebet_d';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['idrombel', 'spp', 'komite_sekolah', 'catering', 'keb_siswa', 'ekskul', 'total'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['no_transaksi'], 'string', 'max' => 11],
            [['nis'], 'string', 'max' => 10],
            [['nisn'], 'string', 'max' => 15],
            [['nama_siswa', 'nama_no_rekening'], 'string', 'max' => 50],
            [['no_rekening'], 'string', 'max' => 35],
            [['no_transaksi'], 'exist', 'skipOnError' => true, 'targetClass' => TagihanAutodebetH::className(), 'targetAttribute' => ['no_transaksi' => 'no_transaksi']],
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
            'no_transaksi' => Yii::t('app', 'No Transaksi'),
            'idrombel' => Yii::t('app', 'Idrombel'),
            'nis' => Yii::t('app', 'Nis'),
            'nisn' => Yii::t('app', 'Nisn'),
            'nama_siswa' => Yii::t('app', 'Nama Siswa'),
            'no_rekening' => Yii::t('app', 'No Rekening'),
            'nama_no_rekening' => Yii::t('app', 'Nama No Rekening'),
            'spp' => Yii::t('app', 'Spp'),
            'komite_sekolah' => Yii::t('app', 'Komite Sekolah'),
            'catering' => Yii::t('app', 'Catering'),
            'keb_siswa' => Yii::t('app', 'Keb Siswa'),
            'ekskul' => Yii::t('app', 'Ekskul'),
            'total' => Yii::t('app', 'Total'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNoTransaksi()
    {
        return $this->hasOne(TagihanAutodebetH::className(), ['no_transaksi' => 'no_transaksi']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIdrombel0()
    {
        return $this->hasOne(SiswaRombel::className(), ['id' => 'idrombel']);
    }

    private function where($data){
        $commaData = explode(",", $data);
        $impl = array();
        for($i=0; $i<count($commaData); $i++){
            $impl[$i] = "'{$commaData[$i]}'";
        }

        $implode = implode(",", $impl);

        if(count($impl) > 1)
            return " IN ($implode) ";
        else
            return " = $implode";
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function findByNo($params){
        extract($params);
        $where = 'WHERE 1=1';

        if($no_transaksi){
            $where .= ' AND a.no_transaksi ' . $this->where($no_transaksi);
        }

        if($nis){
            $where .= ' AND a.nis ' . $this->where($nis);
        }

        if($nisn){
            $where .= ' AND a.nisn ' . $this->where($nisn);
        }

        if($nama_siswa){
            $where .= ' AND a.nama_siswa ' . $this->where($nama_siswa);
        }

        if($kelasid){
            $where .= ' AND k.id ' . $this->where($kelasid);
        }

        if($kelas){
            $where .= ' AND k.kelas ' . $this->where($kelas);
        }

        if($nama_kelas){
            $where .= ' AND k.nama_kelas ' . $this->where($nama_kelas);
        }

        if($query){
            $where .= " AND (
                                a.nis LIKE '%$query%' OR
                                a.nisn LIKE '%$query%' OR
                                a.nama_siswa LIKE '%$query%' OR
                                k.kelas LIKE '%$query%' OR
                                k.nama_kelas LIKE '%$query%' OR
                            )";
        }

        $sqlCustoms = "SELECT 
            a.`id`,
            a.`no_transaksi`,
            a.`idrombel`,
            a.`nis`,
            a.`nisn`,
            a.`nama_siswa` as nama_siswa_xls,
            s.`nama_siswa` as nama_siswa,
            k.`id` AS kelasid,
            k.`kelas`,
            k.`nama_kelas`,
            a.`no_rekening`,
            a.`nama_no_rekening`,
            a.`spp`,
            a.`komite_sekolah`,
            a.`catering`,
            a.`keb_siswa`,
            a.`ekskul`,
            a.`total`,
            a.`created_at`,
            a.`updated_at` 
          FROM `tagihan_autodebet_d` a
          INNER JOIN siswa_rombel sr ON a.`idrombel` = sr.`id`
          INNER JOIN siswa s ON sr.`siswaid` = s.`id`
          INNER JOIN kelas k ON sr.`kelasid` = k.`id` $where";

        $connection = $this->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }
}
