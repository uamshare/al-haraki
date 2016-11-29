<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "rgl".
 *
 * @property integer $rglid
 * @property string $rgldt
 * @property string $mcoadno
 * @property string $noref
 * @property string $noref2
 * @property string $rglin
 * @property string $rglout
 * @property string $rgldesc
 * @property integer $fk_id
 * @property integer $sekolahid
 * @property string $tahun_ajaran_id
 * @property string $created_at
 * @property string $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 *
 * @property Mcoad $mcoadno0
 * @property Sekolah $sekolah
 * @property User $createdBy
 * @property User $updatedBy
 */
class Cashflow extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'rgl';
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function getCashflow($params){
        // extract($params);
        $periode = $this->rangeWeekByMonth((int)$params['month'], (int)$params['year']);
        $sqlCustoms = $this->queryCashFlow();

        // var_dump($params);exit();
        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, [
            'tahun_ajaran_id' => $params['tahun_ajaran_id'],
            'sekolahid' => (int)$params['sekolahid'],
            'month' => (int)$params['month'],
            'm_start' => $periode['rangeMonth']['start'],
            'm_end' => $periode['rangeMonth']['end'],
            'w_start1' => $periode['rangeWeek'][0]['start'],
            'w_end1' => $periode['rangeWeek'][0]['end'],
            'w_start2' => $periode['rangeWeek'][1]['start'],
            'w_end2' => $periode['rangeWeek'][1]['end'],
            'w_start3' => $periode['rangeWeek'][2]['start'],
            'w_end3' => $periode['rangeWeek'][2]['end'],
            'w_start4' => $periode['rangeWeek'][3]['start'],
            'w_end4' => $periode['rangeWeek'][3]['end'],
            'w_start5' => isset($periode['rangeWeek'][4]['start']) ? $periode['rangeWeek'][4]['start'] : '0',
            'w_end5' => isset($periode['rangeWeek'][4]['end']) ? $periode['rangeWeek'][4]['end'] : '0',
            'w_start6' => isset($periode['rangeWeek'][5]['start']) ? $periode['rangeWeek'][5]['start'] : '0',
            'w_end6' => isset($periode['rangeWeek'][5]['end']) ? $periode['rangeWeek'][5]['end'] : '0'
        ]);
        // var_dump($customeQuery->rawSql);exit();
        return [
            'periode' => $periode,
            'data' => $customeQuery->query()
        ];
    }

    private function queryCashFlow(){
        // extract($params);
        $sqlCustoms = "SELECT * FROM (SELECT  0 AS t_type,
                            IFNULL(gl.title,'PENERIMAAN') AS title,
                            IFNULL(gl.mcoadno,'110201') AS mcoadno,
                            IFNULL(gl.mcoadname,'Kas di Bank - SPP') AS mcoadname,
                            CONCAT(IFNULL(gl.mcoadname,'Kas di Bank - SPP'),' (Kelas - ',k.`kelas`,')') AS `name`,
                            SUM(IFNULL(gl.saldo_w1,0)) AS saldo_w1,
                            SUM(IFNULL(gl.saldo_w2,0)) AS saldo_w2,
                            SUM(IFNULL(gl.saldo_w3,0)) AS saldo_w3,
                            SUM(IFNULL(gl.saldo_w4,0)) AS saldo_w4,
                            SUM(IFNULL(gl.saldo_w5,0)) AS saldo_w5,
                            SUM(IFNULL(gl.saldo_w6,0)) AS saldo_w6,
                            k.sekolahid,
                            IFNULL(gl.tahun_ajaran_id, :tahun_ajaran_id) AS tahun_ajaran_id
                        FROM kelas k
                        LEFT JOIN(
                            SELECT 'PENERIMAAN' AS title,
                                a.`mcoadno`,
                                d.`mcoadname`,
                                SUM(IF(rgldt BETWEEN :w_start1 AND :w_end1, IFNULL(`rglin`,0),0)) AS saldo_w1,
                                SUM(IF(rgldt BETWEEN :w_start2 AND :w_end2, IFNULL(`rglin`,0),0)) AS saldo_w2,
                                SUM(IF(rgldt BETWEEN :w_start3 AND :w_end3, IFNULL(`rglin`,0),0)) AS saldo_w3,
                                SUM(IF(rgldt BETWEEN :w_start4 AND :w_end4, IFNULL(`rglin`,0),0)) AS saldo_w4,
                                SUM(IF(rgldt BETWEEN :w_start5 AND :w_end5, IFNULL(`rglin`,0),0)) AS saldo_w5,
                                SUM(IF(rgldt BETWEEN :w_start6 AND :w_end6, IFNULL(`rglin`,0),0)) AS saldo_w6,
                                sr.`kelasid`,
                                a.`sekolahid`,
                                a.`tahun_ajaran_id`
                            FROM rgl a
                            INNER JOIN mcoad d ON a.`mcoadno` = d.`mcoadno`
                            INNER JOIN mcoah h ON h.`mcoahno` = d.`mcoahno`
                            INNER JOIN siswa_rombel sr ON sr.`id` = a.`fk_id`
                            WHERE a.`tahun_ajaran_id` = :tahun_ajaran_id
                                AND a.sekolahid = :sekolahid 
                                AND d.`mcoadno` = '110201'
                                AND MONTH(rgldt) = :month
                            GROUP BY a.sekolahid,a.mcoadno,sr.`kelasid`
                        )gl ON k.`id` = gl.`kelasid` 
                        WHERE k.sekolahid = :sekolahid
                        GROUP BY k.`kelas`
                        UNION
                    SELECT 1 AS t_type,
                        'PENERIMAAN' AS title,
                        d.`mcoadno`,
                        d.`mcoadname`,
                        d.`mcoadname` `name`,
                        SUM(IF(rgldt BETWEEN :w_start1 AND :w_end1, IFNULL(`rglin`,0),0)) AS saldo_w1,
                        SUM(IF(rgldt BETWEEN :w_start2 AND :w_end2, IFNULL(`rglin`,0),0)) AS saldo_w2,
                        SUM(IF(rgldt BETWEEN :w_start3 AND :w_end3, IFNULL(`rglin`,0),0)) AS saldo_w3,
                        SUM(IF(rgldt BETWEEN :w_start4 AND :w_end4, IFNULL(`rglin`,0),0)) AS saldo_w4,
                        SUM(IF(rgldt BETWEEN :w_start5 AND :w_end5, IFNULL(`rglin`,0),0)) AS saldo_w5,
                        SUM(IF(rgldt BETWEEN :w_start6 AND :w_end6, IFNULL(`rglin`,0),0)) AS saldo_w6,
                        IFNULL(a.`sekolahid`, :sekolahid) `sekolahid`,
                        IFNULL(a.`tahun_ajaran_id`, :tahun_ajaran_id) `tahun_ajaran_id`
                    FROM mcoad d
                    INNER JOIN mcoah h ON h.`mcoahno` = d.`mcoahno`
                    LEFT JOIN rgl a ON a.`mcoadno` = d.`mcoadno` AND a.`tahun_ajaran_id` = :tahun_ajaran_id
                            AND a.`sekolahid` = :sekolahid AND MONTH(rgldt)= :month
                    WHERE h.mcoahno IN ('110200','110100') AND d.`mcoadno` <> '110201'
                    GROUP BY a.sekolahid,d.mcoadno
                    UNION
                    SELECT 2 AS t_type,
                        'PENGELUARAN' AS title,
                        d.`mcoadno`,
                        d.`mcoadname`,
                        d.`mcoadname` `name`,
                        SUM(IF(rgldt BETWEEN :w_start1 AND :w_end1, IFNULL(`rglout`,0),0)) AS saldo_w1,
                        SUM(IF(rgldt BETWEEN :w_start2 AND :w_end2, IFNULL(`rglout`,0),0)) AS saldo_w2,
                        SUM(IF(rgldt BETWEEN :w_start3 AND :w_end3, IFNULL(`rglout`,0),0)) AS saldo_w3,
                        SUM(IF(rgldt BETWEEN :w_start4 AND :w_end4, IFNULL(`rglout`,0),0)) AS saldo_w4,
                        SUM(IF(rgldt BETWEEN :w_start5 AND :w_end5, IFNULL(`rglout`,0),0)) AS saldo_w5,
                        SUM(IF(rgldt BETWEEN :w_start6 AND :w_end6, IFNULL(`rglout`,0),0)) AS saldo_w6,
                        IFNULL(a.`sekolahid`, :sekolahid) `sekolahid`,
                        IFNULL(a.`tahun_ajaran_id`, :tahun_ajaran_id) `tahun_ajaran_id`
                    FROM mcoad d
                    INNER JOIN mcoah h ON h.`mcoahno` = d.`mcoahno`
                    LEFT JOIN rgl a ON a.`mcoadno` = d.`mcoadno` AND a.`tahun_ajaran_id` = :tahun_ajaran_id
                            AND a.`sekolahid` = :sekolahid AND MONTH(rgldt)= :month
                    WHERE h.`mcoahno` IN ('110200','110100')
                    GROUP BY a.`sekolahid`,d.`mcoadno`
                    UNION
                    SELECT 3 AS t_type,
                        'OUTSTANDING' AS title,
                        h.`mcoahno`,
                        h.`mcoahname`,
                        h.`mcoahname` `name`,
                        0 AS saldo_w1,
                        0 AS saldo_w2,
                        0 AS saldo_w3,
                        0 AS saldo_w4,
                        0 AS saldo_w5,
                        SUM(CASE
                            WHEN h.`postbalance` = 'D' THEN IFNULL(`rglin`,0) - IFNULL(`rglout`,0)
                            WHEN h.`postbalance` = 'K' THEN IFNULL(`rglout`,0) - IFNULL(`rglin`,0)
                        END) AS saldo_w6,
                        a.`sekolahid`,
                        a.`tahun_ajaran_id`
                    FROM mcoad d
                    INNER JOIN mcoah h ON h.`mcoahno` = d.`mcoahno`
                    LEFT JOIN rgl a ON a.`mcoadno` = d.`mcoadno` AND a.`tahun_ajaran_id` = :tahun_ajaran_id
                        AND a.`sekolahid` = :sekolahid AND rgldt < :m_start
                    WHERE h.`mcoahno` = '110300'
                    GROUP BY a.`sekolahid`,h.`mcoahno`) q_cs ORDER BY t_type,mcoadno,`name`";

        return $sqlCustoms;
    }

    private function rangeMonth($datestr) {
        date_default_timezone_set(date_default_timezone_get());
        $dt = strtotime($datestr);
        $res['start'] = date('Y-m-d', strtotime('first day of this month', $dt));
        $res['end'] = date('Y-m-d', strtotime('last day of this month', $dt));
        return $res;
    }

    private function rangeWeekByMonth($month, $year){
        $rangeMonth = $this->rangeMonth("$year-$month-01");
        $rangeWeek = [];
        $daymonthend = date('j', strtotime($rangeMonth['end']));

        $i=1;
        $count=0;
        while($i<=$daymonthend){
            $rangeWeek[$count] = $this->rangeWeek("$year-$month-" . str_pad($i, 2, '0', STR_PAD_LEFT), 'month');
            $dayweekhend = date('j', strtotime($rangeWeek[$count]['end']));
            $i = $dayweekhend + 1;
            $count++;
        }
        return [
            'rangeMonth' => $rangeMonth,
            'rangeWeek' => $rangeWeek
        ];
    }

    /* 
     * @param $scope, year | month
     */
    private function rangeWeek($datestr, $scope = 'year') {
        date_default_timezone_set(date_default_timezone_get());
        $dt = strtotime($datestr);

        $month['start'] = date('Y-m-d', strtotime('first day of this month', $dt));
        $month['end'] = date('Y-m-d', strtotime('last day of this month', $dt));

        $res['start'] = date('N', $dt)==1 ? date('Y-m-d', $dt) : date('Y-m-d', strtotime('last monday', $dt));
        $res['end'] = date('N', $dt)==7 ? date('Y-m-d', $dt) : date('Y-m-d', strtotime('next sunday', $dt));

        if($scope == 'month'){
            // var_dump(date('n', $dt) . '>' .  date('n', strtotime($res['start'])));
            $res['start'] = (date('n', $dt) > date('n', strtotime($res['start']))) ? $month['start'] : $res['start'];

            if(date('n', $dt) == 12 && (date('n', $dt) > date('n', strtotime($res['end'])))){
                $res['end'] = $month['end'];
            }else{
                $res['end'] = (date('n', $dt) < date('n', strtotime($res['end']))) ? $month['end'] : $res['end'];    
            }
            
        }
        
        // exit();
        return $res;
    }
}
