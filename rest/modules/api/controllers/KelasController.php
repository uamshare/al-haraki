<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class KelasController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController // 
{
    public $modelClass = 'rest\models\Kelas';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'list'  => ['get'],
                    ],
                ],
            ]
        );
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $kelasid = $request->getQueryParam('kelasid', false);
        $sekolahid = $request->getQueryParam('sekolahid', false);
        $query = $request->getQueryParam('query', false);
        
        $queryM = $model->find()
                       ->select([
                            'k.*',
                            'COUNT(sr.id) as `siswacount`'
                        ])
                       ->from('kelas k')
                       ->leftJoin('siswa_rombel sr', 'sr.`kelasid` = `k`.`id`')
                       ->where('1=1')
                       ->groupBy('k.id')
                       ->orderBy(['k.kelas' => SORT_ASC,'k.id' => SORT_ASC])
                       ->asArray();

        if($kelasid){
            $queryM->andWhere(['id' => $kelasid]);
        }

        if($sekolahid){
            $queryM->andWhere(['sekolahid' => $sekolahid]);
        }

        if($query){
            $queryM->andFilterWhere([
                'or',
                ['like', 'nama_kelas', $query]
            ]);
        }
            
        // var_dump($queryM->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($queryM);
    }
}