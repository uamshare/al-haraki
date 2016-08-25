<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "tjmd".
 *
 * @property string $tjmdid
 * @property string $tjmhno
 * @property string $tjmddesc
 * @property string $mcoadno
 * @property string $debet
 * @property string $kredit
 * @property integer $userid
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Tjmh $tjmhno0
 * @property Mcoad $mcoadno0
 */
class Tjmd extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'tjmd';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['tjmhno', 'mcoadno'], 'required'],
            [['debet', 'kredit'], 'number'],
            [['created_at', 'updated_at'], 'safe'],
            [['tjmhno'], 'string', 'max' => 13],
            [['tjmddesc'], 'string', 'max' => 70],
            [['mcoadno'], 'string', 'max' => 6],
            [['tjmhno'], 'exist', 'skipOnError' => true, 'targetClass' => Tjmh::className(), 'targetAttribute' => ['tjmhno' => 'tjmhno']],
            [['mcoadno'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoad::className(), 'targetAttribute' => ['mcoadno' => 'mcoadno']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'tjmdid' => Yii::t('app', 'Tjmdid'),
            'tjmhno' => Yii::t('app', 'Tjmhno'),
            'tjmddesc' => Yii::t('app', 'Tjmddesc'),
            'mcoadno' => Yii::t('app', 'Mcoadno'),
            'debet' => Yii::t('app', 'Debet'),
            'kredit' => Yii::t('app', 'Kredit'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTjmhno()
    {
        return $this->hasOne(Tjmh::className(), ['tjmhno' => 'tjmhno']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoadno()
    {
        return $this->hasOne(Mcoad::className(), ['mcoadno' => 'mcoadno']);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function findByNo($params){
        extract($params);
        $where = 'WHERE 1=1';
        $bound = [];
        if($tjmhno){
            $where .= ' AND tjmhno= :tjmhno';
            $bound['tjmhno'] = $tjmhno;
        }

        if($query){
            $where .= " AND (tjmhno LIKE '%:query%' OR
                            mcoadno LIKE '%:query%' OR
                            mcoadname LIKE '%:query%' OR
                            tjmddesc LIKE '%:query%'
                            )";
            $bound['query'] = $query;
        }

        $sqlCustoms = "SELECT 
                  a.`tjmdid`,
                  a.`tjmhno`,
                  a.`mcoadno`,
                  b.`mcoadname`,
                  a.`tjmddesc`,
                  a.`debet`,
                  a.`kredit`,
                  a.`created_at`,
                  a.`updated_at` 
                FROM `tjmd` a
                INNER JOIN mcoad b ON a.`mcoadno` = b.`mcoadno` $where";

        $connection = $this->getDb();
        $customeQuery = $connection->createCommand($sqlCustoms, $bound);
        // var_dump($customeQuery->rawSql);exit();
        return $customeQuery->query();
    }
}
