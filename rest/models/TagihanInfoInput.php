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

    /**
     * Get Summary Outstanding By Tagihan
     *
     *
     */
    public function getSummaryOutsForPosting($params){
        $customeQuery = new Query;
        $customeQuery
        ->select([
            'a.`tahun_ajaran`',
            's.`sekolahid`',
            'a.`bulan`',
            'a.`tahun`',
            'CONCAT(a.`tahun`, "-", a.`bulan`, "-", "1") AS dt',
            'SUM(IFNULL(`spp_kredit`,0) - IFNULL(`spp_debet`,0)) AS spp',
            'SUM(IFNULL(`komite_sekolah_kredit`,0) - IFNULL(`komite_sekolah_debet`,0)) AS komite_sekolah',
            'SUM(IFNULL(`catering_kredit`,0) - IFNULL(`catering_debet`,0)) AS catering',
            'SUM(IFNULL(`keb_siswa_kredit`,0) - IFNULL(`keb_siswa_debet`,0)) AS keb_siswa',
            'SUM(IFNULL(`ekskul_kredit`,0) - IFNULL(`ekskul_debet`,0)) AS ekskul'
        ])
        ->from('`tagihan_pembayaran` a')
        ->innerJoin('siswa_rombel sr', 'sr.`id` = a.`idrombel`')
        ->innerJoin('siswa s', 's.`id` = sr.`siswaid`')
        ->groupBy(['a.`tahun_ajaran`, s.`sekolahid`, a.`tahun`, a.`bulan`'])
        ->where(['LIKE','no_ref','t_info'])
        ->andWhere(['>','a.bulan', 0]);

        if(is_array($params)){
            extract($params);

            if($tahun_ajaran_id){
                $customeQuery->andWhere(['a.`tahun_ajaran`' => $tahun_ajaran_id]);
            }

            if($sekolahid){
                $customeQuery->andWhere(['s.`sekolahid`' => $sekolahid]);
            } 
        }
         
        // var_dump($customeQuery->createCommand()->rawSql);exit();

        return $customeQuery;
    }

    public function updatePostingData($params){
        // $model = new $this->modelClass();
        $date = date('Y-m-d H:i:s');
        $outstanding = $this->getSummaryOutsForPosting($params)->All();
        // var_dump($outstanding);exit();
        
        $GL = new \rest\models\Rgl();
        foreach($outstanding as $key => $row){
            if($row['bulan'] > 0 && $row['bulan'] < 13){
                foreach (['spp','komite_sekolah','catering','keb_siswa','ekskul'] as $tagihan) {
                    $postingValue = [
                        'date'                 => $row['dt'],
                        'noref'                => 't_info_' .$row['bulan']. '_' .  $row['tahun_ajaran'],        
                        'value'                => $row[$tagihan],
                        'description'          => 'Info Tagihan ' .$tagihan. ' Bulan  ' .$row['bulan']. ' Tahun ' . 
                                                    $row['tahun_ajaran'],
                        'sekolahid'            => $row['sekolahid'],
                        'tahun_ajaran_id'      => $row['tahun_ajaran'],
                        'created_at'           => null,
                        'created_by'           => null,
                        'updated_at'           => $date,
                        'updated_by'           => \Yii::$app->user->getId(),
                    ];
                    $autoPosting = $GL->AutoPosting('00', $postingValue, $tagihan);
                    // $autoPosting['unposting']->execute();
                    $autoPosting['posting']->execute();
                }
            }
        }
        // var_dump($outstanding);exit();
        $rest = \rest\models\Rgl::find()->where(['LIKE','noref','t_info_'])
                                       ->andWhere([ 'tahun_ajaran_id' => $row['tahun_ajaran']])
                                       ->All();
        // var_dump($rest->createCommand()->rawSql);exit();
        return $rest;
    }
}
