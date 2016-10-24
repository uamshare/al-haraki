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
class Rgl extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'rgl';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['rgldt', 'mcoadno', 'sekolahid', 'created_at', 'created_by', 'updated_by'], 'required'],
            [['rgldt', 'created_at', 'updated_at'], 'safe'],
            [['rglin', 'rglout'], 'number'],
            [['rgldesc'], 'string'],
            [['fk_id', 'sekolahid', 'created_by', 'updated_by'], 'integer'],
            [['mcoadno'], 'string', 'max' => 8],
            [['noref'], 'string', 'max' => 30],
            [['noref2'], 'string', 'max' => 25],
            [['tahun_ajaran_id'], 'string', 'max' => 6],
            [['mcoadno'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoad::className(), 'targetAttribute' => ['mcoadno' => 'mcoadno']],
            [['sekolahid'], 'exist', 'skipOnError' => true, 'targetClass' => Sekolah::className(), 'targetAttribute' => ['sekolahid' => 'id']],
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
            'rglid' => Yii::t('app', 'Rglid'),
            'rgldt' => Yii::t('app', 'Rgldt'),
            'mcoadno' => Yii::t('app', 'Mcoadno'),
            'noref' => Yii::t('app', 'Noref'),
            'noref2' => Yii::t('app', 'Noref2'),
            'rglin' => Yii::t('app', 'Rglin'),
            'rglout' => Yii::t('app', 'Rglout'),
            'rgldesc' => Yii::t('app', 'Rgldesc'),
            'fk_id' => Yii::t('app', 'Fk ID'),
            'sekolahid' => Yii::t('app', 'Sekolahid'),
            'tahun_ajaran_id' => Yii::t('app', 'Tahun Ajaran ID'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
            'created_by' => Yii::t('app', 'Created By'),
            'updated_by' => Yii::t('app', 'Updated By'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoadno0()
    {
        return $this->hasOne(Mcoad::className(), ['mcoadno' => 'mcoadno']);
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

    private function setOnDuplicateValue($column){
        $values = [];
        foreach($column as $col){
            if(!in_array($col, ['created_at','created_by'])){
                $values[]= '`'.$col.'` = VALUES(' . $col .')';
            }
        }
        return implode(',', $values);
    }

    /**
     * Auto posting for transaction
     * $postingValue = [
            'date'                 => $form['tgl_transaksi'],
            'noref'                => $form['no_transaksi'],        
            'value'                => $total,
            'description'          => 'Transaksi Autodebet NO . ' . $form['no_transaksi'],
            'sekolahid'            => $form['sekolahid'],
            'tahun_ajaran_id'      => $form['tahun_ajaran_id'],
            'created_at'           => $form['created_at'],   
            'updated_at'           => $form['updated_at'],
            'created_by'           => $form['created_by'],   
            'updated_by'           => $form['updated_by']
        ];
     * @param $kode, kode transaksi
     * @param $values, value data
     */
    public function AutoPosting($kode, $values, $jtagihan = 'spp'){
        $DB = $this->getDb();
        $posAuto = \rest\models\PostingAuto::find()->where([
            'kode' => $kode, 
            'j_tagihan' => $jtagihan
        ])->One();
        
        $postingvalue = [];

        $debet1 = $this->setPostingValue( $posAuto->acc_debet, $values, 1 );
        if( $debet1 != false){
            $postingvalue[] = $debet1;
        }
        $debet2 = $this->setPostingValue( $posAuto->acc_debet2, $values, 1 );
        if( $debet2 != false){
            $postingvalue[] = $debet2;
        }
        $debet3 = $this->setPostingValue( $posAuto->acc_debet3, $values, 1 );
        if( $debet3 != false){
            $postingvalue[] = $debet3;
        }
        $debet4 = $this->setPostingValue( $posAuto->acc_debet4, $values, 1 );
        if( $debet4 != false){
            $postingvalue[] = $debet4;
        }

        $kredit1 = $this->setPostingValue( $posAuto->acc_credit, $values, 2 );
        if( $kredit1 != false){
            $postingvalue[] = $kredit1;
        }
        $kredit2 = $this->setPostingValue( $posAuto->acc_credit2, $values, 2 );
        if( $kredit2 != false){
            $postingvalue[] = $kredit2;
        }
        $kredit3 = $this->setPostingValue( $posAuto->acc_credit3, $values, 2 );
        if( $kredit3 != false){
            $postingvalue[] = $kredit3;
        }
        $kredit4 = $this->setPostingValue( $posAuto->acc_credit4, $values, 2 );
        if( $kredit4 != false){
            $postingvalue[] = $kredit4;
        }
        
        return [
            'unposting' => $this->unposting($DB, [
                'noref' => $values['noref'],
                'sekolahid' => $values['sekolahid'],
                'tahun_ajaran_id' => $values['tahun_ajaran_id']
            ]),
            'posting' => $this->posting($DB, $postingvalue)
        ];
    }

    public function posting($DB, $values){
        $column = $this->attributes();
        unset($column[0]);

        $posting = $DB->createCommand()->batchInsert(
            self::tableName(),
            $column, 
            $values
        );
        $posting->setSql($posting->rawSql . ' ON DUPLICATE KEY UPDATE ' . $this->setOnDuplicateValue($column));
        return $posting;
    }

    public function unposting($DB, $where){
        $delete = $DB->createCommand()->delete(
            self::tableName(),
            $where
        );
        return $delete;
    }

    /**
     * Auto posting for transaction
     * @param $AccoutNo, NO Account
     * @param $values, value data
     * @param $pos, posisi saldo 1:Debet, 2:kredit
     */
    private function setPostingValue($AccoutNo, $values, $pos = 1){
        if(isset($AccoutNo) && !empty($AccoutNo)){
            return [
                'rgldt'                => $values['date'], 
                'mcoadno'              => $AccoutNo,
                'noref'                => $values['noref'],        
                'noref2'               => (isset($values['noref2'])) ? $values['noref2'] : $values['noref'], 
                'rglin'                => ($pos == 1) ? $values['value'] : 0,
                'rglout'               => ($pos == 2) ? $values['value'] : 0,
                'rgldesc'              => $values['description'],
                'fk_id'                => isset($values['fk_id']) ? $values['fk_id'] : null,
                'sekolahid'            => $values['sekolahid'],
                'tahun_ajaran_id'      => $values['tahun_ajaran_id'],
                'created_at'           => $values['created_at'],   
                'updated_at'           => $values['updated_at'],
                'created_by'           => $values['created_by'],   
                'updated_by'           => $values['updated_by']
            ];
        }
        return false;
    }

    private function where($data, &$bound = false, $name = false){
        $commaData = explode(",", $data);
        $impl = array();
        for($i=0; $i<count($commaData); $i++){
            $impl[$i] = "'{$commaData[$i]}'";
        }

        
        $implode = implode(",", $impl);
        if($bound && $name){
            $bound[$name] = (count($impl) > 1) ? $implode : $data;
        }
        if(count($impl) > 1){
            return " IN (:$name) ";
        }
        else{
            return " = :$name";
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function getList($params){
        extract($params);
        $where = 'WHERE 1=1 AND saldo_e > 0 ';
        $bound[':sekolahid'] = $sekolahid;
        if($date_start && $date_end){
            $bound[':date1'] = $date_start;
            $bound[':date2'] = $date_end;
        }

        if($mcoahno){
            $where .= ' AND mcoahno ' . $this->where($mcoahno);
        }

        if($mcoahname){
            $where .= ' AND mcoahname ' . $this->where($mcoahname);
        }

        $sqlCustoms = "SELECT * FROM 
            (SELECT 
              h.`mcoahno`,
              h.`mcoahname`,
              IFNULL(b.`saldo_a`,0) AS `saldo_a`,
              IFNULL(a.`saldo_c`,0) AS `saldo_c`,
              (IFNULL(b.`saldo_a`,0)) + IFNULL(a.`saldo_c`,0) AS `saldo_e`
            FROM mcoah h
            LEFT JOIN 
            (SELECT 
              h.`mcoahno`,
              d.`mcoadno`,
              h.mcoahname,
              (CASE
                WHEN h.`postbalance` = 'D' THEN (SUM(IFNULL(`rglin`,0) - IFNULL(`rglout`,0)))
                WHEN h.`postbalance` = 'K' THEN (SUM(IFNULL(`rglout`,0) - IFNULL(`rglin`,0)))
              END) AS `saldo_c`
            FROM mcoah h
            INNER JOIN mcoad d ON h.`mcoahno` = d.`mcoahno`
            LEFT JOIN 
                (SELECT `rgldt`,
                    `mcoadno`,
                    rglin,
                    rglout,
                    `sekolahid`,
                    `tahun_ajaran_id`
                FROM `rgl` a 
                WHERE rgldt BETWEEN :date1 AND :date2 AND sekolahid = :sekolahid
                ) a ON a.`mcoadno` = d.mcoadno
            GROUP BY h.`mcoahno`) a ON a.`mcoahno` = h.`mcoahno`
            LEFT JOIN 
              (SELECT 
              h.`mcoahno`,
              d.`mcoadno`,
              h.mcoahname,
                (CASE
                WHEN h.`postbalance` = 'D' THEN (SUM(IFNULL(`rglin`,0) - IFNULL(`rglout`,0)))
                WHEN h.`postbalance` = 'K' THEN (SUM(IFNULL(`rglout`,0) - IFNULL(`rglin`,0)))
              END) AS `saldo_a`
            FROM mcoah h
            INNER JOIN mcoad d ON h.`mcoahno` = d.`mcoahno`
            LEFT JOIN 
                (SELECT `rgldt`,
                    `mcoadno`,
                    rglin,
                    rglout,
                    `sekolahid`,
                    `tahun_ajaran_id`
                FROM `rgl` a 
                WHERE rgldt < :date1 AND sekolahid = :sekolahid
                ) a ON a.`mcoadno` = d.mcoadno
            GROUP BY h.`mcoahno`) b ON b.`mcoahno` = h.`mcoahno`
            ) AS q_gl ";

        $connection = $this->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms . $where, $bound);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function getListDetail($params){
        extract($params);
        // $where = 'WHERE 1=1 AND rgldt IS NOT NULL';
        // $where = 'WHERE (IFNULL(debet_c,0) + IFNULL(`credit_c`,0)) > 0 ';
        $where = 'WHERE 1=1 ';
        $where_sq = '';

        if($date_start && $date_end){
            $bound[':date1'] = $date_start;
            $bound[':date2'] = $date_end;
        }
        $bound[':sekolahid'] = $sekolahid;

        if($mcoahno){
            $where .= ' AND mcoahno ' . $this->where($mcoahno, $bound, 'mcoahno');
        }

        if($mcoadno){
            $cond = ' AND mcoadno ' . $this->where($mcoadno, $bound, 'mcoadno');
            $where .= $cond;
            $where_sq .= $cond;
        }

        if($mcoahname){
            $where .= ' AND mcoahname ' . $this->where($mcoahname, $bound, 'mcoahname');
        }
        
        $sqlCustoms = "SELECT * FROM 
                (SELECT 
                  h.`mcoahno`,
                  h.`postgl`,
                  h.`mcoahname`,
                  a.`rgldt`,
                  a.noref,
                  a.`rgldesc`,
                  a.`sekolahid`,
                  a.`tahun_ajaran_id`,
                  d.`mcoadno`,
                  d.`mcoadname`,
                  IFNULL(b.`saldo_a`,0) AS `saldo_a`,
                  IFNULL(a.`debet_c`,0) AS `debet_c`,
                  IFNULL(a.`credit_c`,0) AS `credit_c`
                FROM mcoah h
                INNER JOIN mcoad d ON h.`mcoahno` = d.`mcoahno`
                LEFT JOIN (SELECT 
                          a.`rgldt`,
                          a.noref,
                          a.noref2,
                          a.`rgldesc`,
                          a.`mcoadno`,
                          a.`rglin` AS `debet_c`,
                          a.`rglout` AS `credit_c`,
                          a.`sekolahid`,
                          a.`tahun_ajaran_id`
                        FROM `rgl` a
                        WHERE rgldt BETWEEN :date1 AND :date2 AND sekolahid = :sekolahid $where_sq
                    ) a ON a.`mcoadno` = d.`mcoadno` 
                LEFT JOIN (SELECT 
                          h.`mcoahno`,
                          d.`mcoadno`,
                          h.mcoahname,
                          (CASE
                            WHEN h.`postbalance` = 'D' THEN (SUM(IFNULL(`rglin`,0) - IFNULL(`rglout`,0)))
                            WHEN h.`postbalance` = 'K' THEN (SUM(IFNULL(`rglout`,0) - IFNULL(`rglin`,0)))
                          END) AS `saldo_a`
                        FROM mcoah h
                        INNER JOIN mcoad d ON h.`mcoahno` = d.`mcoahno`
                        LEFT JOIN 
                            (SELECT `rgldt`,
                                `mcoadno`,
                                rglin,
                                rglout,
                                `sekolahid`,
                                `tahun_ajaran_id`
                            FROM `rgl` a 
                            WHERE rgldt < :date1 AND sekolahid = :sekolahid $where_sq
                            ) a ON a.`mcoadno` = d.mcoadno
                        GROUP BY h.`mcoahno`
                    ) b ON b.`mcoahno` = h.`mcoahno`
                ) AS q_gl_detail 
                $where
                ORDER BY rgldt,sekolahid,mcoahno, noref, mcoadno ";
        

        $conn = $this->getDb();
        $customeQuery = $conn->createCommand($sqlCustoms, $bound);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }
}
