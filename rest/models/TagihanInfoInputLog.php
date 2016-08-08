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
 * @property string $keterangan
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
            [['idrombel'], 'required'],
            [['idrombel', 'spp', 'komite_sekolah', 'catering', 'keb_siswa', 'ekskul'], 'integer'],
            [['keterangan'], 'string'],
            [['created_at', 'updated_at'], 'safe'],
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
            'keterangan' => Yii::t('app', 'Keterangan'),
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
}
