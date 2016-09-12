<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tagihan_info_input_log".
 *
 * @property integer $id
 * @property integer $idrombel
 * @property integer $spp
 * @property integer $komite_sekolah
 * @property integer $catering
 * @property integer $keb_siswa
 * @property integer $ekskul
 * @property string $tahun_ajaran_id
 * @property string $keterangan
 * @property string $jenis_tagihan
 * @property string $flag
 * @property integer $periode_awal
 * @property integer $periode_akhir
 * @property string $created_at
 * @property string $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 *
 * @property SiswaRombel $idrombel0
 * @property User $createdBy
 * @property User $updatedBy
 */
class TagihanInfoInputLog extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tagihan_info_input_log';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['idrombel', 'tahun_ajaran_id', 'periode_awal', 'periode_akhir'], 'required'],
            [['idrombel', 'spp', 'komite_sekolah', 'catering', 'keb_siswa', 'ekskul', 'periode_awal', 'periode_akhir', 'created_by', 'updated_by'], 'integer'],
            [['keterangan', 'jenis_tagihan', 'flag'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
            [['idrombel', 'tahun_ajaran_id', 'periode_awal', 'periode_akhir'], 'unique', 'targetAttribute' => ['idrombel', 'tahun_ajaran_id', 'periode_awal', 'periode_akhir'], 'message' => 'The combination of Idrombel, Tahun Ajaran ID, Periode Awal and Periode Akhir has already been taken.'],
            [['idrombel'], 'exist', 'skipOnError' => true, 'targetClass' => SiswaRombel::className(), 'targetAttribute' => ['idrombel' => 'id']],
            [['created_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['created_by' => 'id']],
            [['updated_by'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['updated_by' => 'id']],
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
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'jenis_tagihan' => Yii::t('app', 'Jenis Tagihan'),
            'flag' => Yii::t('app', 'Flag'),
            'periode_awal' => Yii::t('app', 'Periode Awal'),
            'periode_akhir' => Yii::t('app', 'Periode Akhir'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIdrombel0()
    {
        return $this->hasOne(SiswaRombel::className(), ['id' => 'idrombel']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCreatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'created_by']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUpdatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'updated_by']);
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

    public function getListActive($param){
        extract($param);
        $where = ' WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel= :idrombel';
        }

        if($kelasid){
            $where .= ' AND kelasid= :kelasid';
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id= :tahun_ajaran_id';
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        $periode = ($month_start + ($year_start * 12));
        $sqlCustoms = $this->queryList();
        $orderBy = " ORDER BY nama_siswa";
        $conn = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms . $where . $orderBy, [
            'idrombel' => $idrombel,
            'kelasid' => $kelasid,
            'tahun_ajaran_id' => $tahun_ajaran_id,
            'month_start' => ($jenis_tagihan == '1') ? (int)$month_start : 7,
            'noref_like' => ($jenis_tagihan == '1') ? 't_info_1%' : 't_info_2%',
        ]);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    private function queryList(){
        $filter;
        return "SELECT * FROM
            (SELECT    b.`id`
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
              LEFT JOIN 
            (SELECT 
                a.`id`,
                a.`idrombel`,
                a.`spp_kredit` AS `spp`,
                a.`komite_sekolah_kredit` AS `komite_sekolah`,
                a.`catering_kredit` AS `catering`,
                a.`keb_siswa_kredit` AS `keb_siswa`,
                a.`ekskul_kredit` AS `ekskul`,
                a.`tahun_ajaran` AS tahun_ajaran_id,
                a.keterangan,
                a.`created_at`,
                a.`updated_at`
                FROM `tagihan_pembayaran` a
                WHERE no_ref LIKE :noref_like AND tahun_ajaran = :tahun_ajaran_id 
                AND `bulan` = :month_start) b ON a.`id` = b.`idrombel`) AS q_info_tagihan";
    }
}
