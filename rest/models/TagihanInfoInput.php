<?php

namespace rest\models;

use Yii;
use yii\db\Query;

class TagihanInfoInput extends TagihanPembayaran
{
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

    public function getListInput($param){
        extract($param);
        $where = 'WHERE 1=1';
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

        $param1 = $bulan + (12 * $tahun);
        

        $sqlCustoms = " SELECT * FROM
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
                  SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp,
                  SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah,
                  SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering,
                  SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa,
                  SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul,
                  `bulan`,
                  `tahun`,
                  `tahun_ajaran`,
                  `no_ref`,
                  `ket_ref`,
                  `keterangan`,
                  `created_at`,
                  `updated_at` 
                FROM
                  `tagihan_pembayaran`
                WHERE (bulan + (12 * tahun)) <= :param1
                GROUP BY idrombel

                ) b ON a.`id` = b.`idrombel`) AS q_info_tagihan $where";

        $connection = Yii::$app->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms, [':param1' => $param1]);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }
}
