<?php

namespace rest\models;

use Yii;
use yii\db\Query;


/**
 * This is the model class for table "mcoad".
 *
 * @property string $mcoadno
 * @property string $mcoadname
 * @property string $mcoahno
 * @property integer $active
 * @property string $created_at
 * @property string $updated_at
 *
 * @property Mcoah $mcoahno0
 * @property Tjmd[] $tjmds
 */
class Mcoad extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'mcoad';
    }

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
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['mcoadno', 'mcoadname', 'mcoahno', 'created_at'], 'required'],
            [['active'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['mcoadno', 'mcoahno'], 'string', 'max' => 6],
            [['mcoadname'], 'string', 'max' => 50],
            [['mcoahno'], 'exist', 'skipOnError' => true, 'targetClass' => Mcoah::className(), 'targetAttribute' => ['mcoahno' => 'mcoahno']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'mcoadno' => Yii::t('app', 'No Akun'),
            'mcoadname' => Yii::t('app', 'Nama Akun'),
            'mcoahno' => Yii::t('app', 'No Master'),
            'active' => Yii::t('app', 'Active'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMcoah()
    {
        return $this->hasOne(Mcoah::className(), ['mcoahno' => 'mcoahno']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTjmds()
    {
        return $this->hasMany(Tjmd::className(), ['mcoadno' => 'mcoadno']);
    }

    // public function fields(){
    //     $fields = parent::fields();
    //     // var_dump($this->Mcoah->mcoahname);exit();
    //     return array_merge($fields, [
    //         'mcoahname' => function($model) {
    //             return $model->mcoah->mcoahname; // or anything else from the mission relation
    //         },
    //         'mcoaclassification' => function($model) {
    //             return $model->mcoah->mcoac->mcoaclassification; // or anything else from the mission relation
    //         },
    //         'mcoagroup' => function($model) {
    //             return $model->mcoah->mcoac->mcoag->mcoagroup; // or anything else from the mission relation
    //         },
    //     ]);
    // }

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

    public function getList($params){
        $customeQuery = new Query;
        $customeQuery
            ->select([
                'a.`mcoadno`',
                'a.`mcoadname`',
                'a.`mcoahno`',
                'a.`active`',
                'b.`mcoahname`',
                'c.`mcoaclassification`',
                'g.`mcoagroup`',
                'a.`created_at`',
                'a.`updated_at`'
            ])
            ->from('mcoad a')
            ->innerJoin('mcoah b', 'a.`mcoahno` = b.`mcoahno`')
            ->innerJoin('mcoac c', 'b.`mcoacid` = c.`mcoacid`')
            ->innerJoin('mcoag g', 'g.`mcoagid` = c.`mcoagid`');

        if(is_array($params)){
            extract($params);
            $customeQuery->where('1=1');

            if(isset($mcoadno) && $mcoadno){
                $customeQuery->andWhere(['a.mcoadno' => $mcoadno]);
            }

            if(isset($mcoahno) && $mcoahno){
                $customeQuery->andWhere(['a.mcoahno' => $mcoahno]);
            }

            if(isset($mcoadname) && $mcoadname){
                $customeQuery->andWhere(['a.mcoadname' => $mcoadname]);
            }

            if(isset($query) && $query){
                $customeQuery->andFilterWhere([
                    'or',
                    ['like', 'a.mcoadno', $query],
                    ['like', 'a.mcoadname', $query],
                ]);
            }  
        }else if(is_string($params) || is_int($params)){
            $customeQuery->andWhere(['a.mcoadno' => $params]);
        }
        // var_dump($customeQuery->createCommand()->rawSql);exit();
        return $customeQuery;
    }
}
