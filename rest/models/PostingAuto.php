<?php

namespace rest\models;

use Yii;

/**
 * This is the model class for table "posting_auto".
 *
 * @property integer $id
 * @property string $kode
 * @property string $transaksi
 * @property string $acc_debet
 * @property string $acc_credit
 * @property string $acc_debet2
 * @property string $acc_credit2
 * @property string $acc_debet3
 * @property string $acc_credit3
 * @property string $acc_debet4
 * @property string $acc_credit4
 * @property string $created_at
 * @property string $updated_at
 */
class PostingAuto extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'posting_auto';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['kode', 'transaksi', 'acc_debet', 'acc_credit', 'created_at', 'updated_at'], 'required'],
            [['created_at', 'updated_at'], 'safe'],
            [['kode'], 'string', 'max' => 4],
            [['transaksi'], 'string', 'max' => 100],
            [['acc_debet', 'acc_credit', 'acc_debet2', 'acc_credit2', 'acc_debet3', 'acc_credit3', 'acc_debet4', 'acc_credit4'], 'string', 'max' => 6],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'kode' => Yii::t('app', 'Kode'),
            'transaksi' => Yii::t('app', 'Transaksi'),
            'acc_debet' => Yii::t('app', 'Acc Debet'),
            'acc_credit' => Yii::t('app', 'Acc Credit'),
            'acc_debet2' => Yii::t('app', 'Acc Debet2'),
            'acc_credit2' => Yii::t('app', 'Acc Credit2'),
            'acc_debet3' => Yii::t('app', 'Acc Debet3'),
            'acc_credit3' => Yii::t('app', 'Acc Credit3'),
            'acc_debet4' => Yii::t('app', 'Acc Debet4'),
            'acc_credit4' => Yii::t('app', 'Acc Credit4'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }
}
