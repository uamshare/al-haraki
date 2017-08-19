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

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        // unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        
        $scenario = Yii::$app->getRequest()->getQueryParam('scenario', false);
        switch ($scenario) {
            case '1': // Get Group Kelas
                $query = $this->findGroupSekolah();
                break;

            default:
                $query = $this->findBySekolah();
                break;
        }

        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
    }

    private function findBySekolah(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', false);

        $query = $model->find()
                       ->where('1=1')
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['sekolahid' => $sekolahid]);
        }

        $query->orderBy([
            '`sekolahid`' => SORT_ASC,
            '`nama_kelas`' => SORT_ASC,
        ]);

        return $query;
    }

    private function findGroupSekolah(){
        $model = new $this->modelClass();
        $sekolahid = Yii::$app->getRequest()->getQueryParam('sekolahid', false);

        $query = $model->find()
                        ->select([
                            'id','group_kelas',
                        ])
                        ->where('group_kelas iS NOT NULL')
                        ->asArray();
        if($sekolahid){
            $query->andWhere(['sekolahid' => $sekolahid]);
        }


        $query->orderBy([
            '`sekolahid`' => SORT_ASC,
            '`nama_kelas`' => SORT_ASC,
        ]);
        $query->groupBy('group_kelas');

        return $query;
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
        $tahun_ajaran_id = $request->getQueryParam('tahun_ajaran_id', false);
        $query = $request->getQueryParam('query', false);
        
        $queryM = $model->find()
                       ->select([
                            'k.*',
                            'COUNT(sr.id) as `siswacount`'
                        ])
                       ->from('kelas k')
                       ->leftJoin('siswa_rombel sr', 'sr.`kelasid` = `k`.`id` AND tahun_ajaran_id ="'. $tahun_ajaran_id . '"')
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