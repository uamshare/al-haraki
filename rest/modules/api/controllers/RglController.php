<?php
namespace rest\modules\api\controllers;
use Yii;

class RglController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController // 
{
    public $modelClass = 'rest\models\Rgl';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['index']);
        unset($actions['view']);
        unset($actions['delete']);
        return $actions;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        
        // $kls = $request->getQueryParam('kelasid', false);
        return $model->getList([
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'sekolahid' => $request->getQueryParam('sekolahid', 0),
            'date_start' => $request->getQueryParam('date_start', '0000-00-00'),
            'date_end' => $request->getQueryParam('date_end', '0000-00-00'),
            'mcoahno' => $request->getQueryParam('mcoahno', false),
            'mcoahname' => $request->getQueryParam('mcoahname', false),
        ]);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionView($id){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        
        // $kls = $request->getQueryParam('kelasid', false);
        return $model->getListDetail([
            'tahun_ajaran_id' => $request->getQueryParam('tahun_ajaran_id', false),
            'sekolahid' => $request->getQueryParam('sekolahid', 0),
            'date_start' => $request->getQueryParam('date_start', '0000-00-00'),
            'date_end' => $request->getQueryParam('date_end', '0000-00-00'),
            'mcoahno' => $id ? $id : $request->getQueryParam('mcoahno', false),
            'mcoadno' => $request->getQueryParam('mcoadno', false),
            'mcoahname' => $request->getQueryParam('mcoahname', false),
        ]);
    }
}