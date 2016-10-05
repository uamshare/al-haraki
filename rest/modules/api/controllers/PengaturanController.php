<?php
namespace rest\modules\api\controllers;

use Yii;

class PengaturanController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\Pengaturan';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        // unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $pjudul = $request->getQueryParam('pjudul', false);
        $sekolahid = $request->getQueryParam('sekolahid', false);

        $query = $model->find()
                       ->where('1=1')
                       ->orderBy(['sekolahid' => SORT_ASC,'created_at' => SORT_ASC])
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['sekolahid' => $sekolahid]);
        }
        if($pjudul){
            $query->andWhere(['pjudul' => $pjudul]);
        }
        return $this->prepareDataProvider($query);
    }
}