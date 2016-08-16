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
 * @property string $flag
 * @property string $created_at
 * @property string $updated_at
 *
 * @property SiswaRombel $idrombel0
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
            [['idrombel', 'tahun_ajaran_id'], 'required'],
            [['idrombel', 'spp', 'komite_sekolah', 'catering', 'keb_siswa', 'ekskul'], 'integer'],
            [['keterangan', 'flag'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
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
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'keterangan' => Yii::t('app', 'Keterangan'),
            'flag' => Yii::t('app', 'Flag'),
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

    public function getListActive($param){
        extract($param);
        $where = ' WHERE 1=1';
        if($idrombel){
            $where .= ' AND idrombel=' . $idrombel;
        }

        if($kelasid){
            $where .= ' AND kelasid=' . $kelasid;
        }

        if($tahun_ajaran_id){
            $where .= ' AND tahun_ajaran_id=' . $tahun_ajaran_id;
        }

        if($query){
            $where .= " AND (nama_siswa LIKE '%$query%' OR keterangan LIKE '%$query%')";
        } 

        $sqlCustoms = $this->queryList($tahun_ajaran_id);

        $connection = $this->getDb(); //Yii::$app->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms . $where);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    private function queryList($thnajaran){
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
              `id`,
              `idrombel`,
              `spp`,
              `komite_sekolah`,
              `catering`,
              `keb_siswa`,
              `ekskul`,
              `tahun_ajaran_id`,
              `keterangan`,
              `flag`,
              `created_at`,
              `updated_at` 
            FROM
              `tagihan_info_input_log` 
            WHERE flag='1' AND tahun_ajaran_id='$thnajaran'
        ) b ON a.`id` = b.`idrombel`) AS q_info_tagihan";
    }
}
