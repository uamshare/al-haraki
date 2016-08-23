<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "kwitansi_pengeluaran_d".
 *
 * @property integer $id
 * @property string $no_kwitansi
 * @property string $kode
 * @property string $rincian
 * @property integer $jumlah
 * @property string $created_at
 * @property string $updated_at
 *
 * @property KwitansiPengeluaranH $noKwitansi
 */
class KwitansiPengeluaranD extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'kwitansi_pengeluaran_d';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['jumlah'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['no_kwitansi', 'kode'], 'string', 'max' => 20],
            [['rincian'], 'string', 'max' => 50],
            [['no_kwitansi'], 'exist', 'skipOnError' => true, 'targetClass' => KwitansiPengeluaranH::className(), 'targetAttribute' => ['no_kwitansi' => 'no_kwitansi']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'no_kwitansi' => Yii::t('app', 'No Kwitansi'),
            'kode' => Yii::t('app', 'Kode'),
            'rincian' => Yii::t('app', 'Rincian'),
            'jumlah' => Yii::t('app', 'Jumlah'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNoKwitansi()
    {
        return $this->hasOne(KwitansiPengeluaranH::className(), ['no_kwitansi' => 'no_kwitansi']);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function findByNo($params){
        extract($params);
        $where = 'WHERE 1=1';
        $bound = [];
        if($no_kwitansi){
            $where .= ' AND no_kwitansi= :no_kwitansi';
            $bound['no_kwitansi'] = $no_kwitansi;
        }

        if($query){
            $where .= " AND (no_kwitansi LIKE '%:query%')";
            $bound['query'] = $query;
        }

        $sqlCustoms = "SELECT 
                          `id`,
                          `no_kwitansi`,
                          `kode`,
                          `rincian`,
                          `jumlah`,
                          `created_at`,
                          `updated_at` 
                        FROM `kwitansi_pengeluaran_d` $where";

        $connection = $this->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms, $bound);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }
}
