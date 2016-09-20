<?php
namespace rest\modules\api\controllers;
use Yii;

class SiswarombelController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController // 
{
    public $modelClass = 'rest\models\SiswaRombel';

    public function actions()
    {
        $actions = parent::actions();
        // unset($actions['create']);
        // unset($actions['update']);
        // unset($actions['delete']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', false);
        $tahun_ajaran_id = $request->getQueryParam('tahun_ajaran_id', false);
        $kelasid = $request->getQueryParam('kelasid', false);

        $query = $model->find()
                       ->select([
                            'a.`id`',
                            'a.`siswaid`',
                            'b.`nis`',
                            'b.`nisn`',
                            'b.`nama_siswa`',
                            'a.`kelasid`',
                            'c.kelas',
                            'c.`nama_kelas`',
                            'b.`sekolahid`',
                            'a.`tahun_ajaran_id`',
                            'a.`created_at`',
                            'a.`updated_at`'
                        ])
                       ->from('siswa_rombel a')
                       ->innerJoin('siswa b', 'a.`siswaid` = b.`id`')
                       ->leftJoin('kelas c', 'a.`kelasid` = c.`id`')
                       ->where('1=1')
                       ->orderBy([
                            'b.`nama_siswa`' => SORT_ASC, 
                            'b.`nis`' => SORT_ASC, 
                            'a.`kelasid`' => SORT_ASC, 
                            'b.`sekolahid`' => SORT_ASC
                        ])
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['b.sekolahid' => $sekolahid]);
        }
        if($kelasid){
            $query->andWhere(['a.kelasid' => $kelasid]);
        }
        if($tahun_ajaran_id){
            $query->andWhere(['a.tahun_ajaran_id' => $tahun_ajaran_id]);
        }

        return $this->prepareDataProvider($query);
    }
    
    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $tahun_ajaran_id = '';
        $sekolahid = 0;
        return $model->getList([
            'query' => $request->getQueryParam('query', false),
            'nis' => $request->getQueryParam('nis', false),
            'nisn' => $request->getQueryParam('nisn', false),
            'nama_siswa' => $request->getQueryParam('nama_siswa', false),
            'kelas' => $request->getQueryParam('kelas', false),
            'nama_kelas' => $request->getQueryParam('nama_kelas', false),
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', $tahun_ajaran_id),
            'sekolahid' => $request->getQueryParam('sekolahid', $sekolahid)
        ]);
    }
}