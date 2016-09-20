<?php
namespace rest\modules\api\controllers;
use Yii;

class LogController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\Logs';

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
     *
     */
    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $date_start = $request->getQueryParam('date_start', false);
        $date_end = $request->getQueryParam('date_end', false);
        $controllerid = $request->getQueryParam('controllerid', false);
        $sekolahid = $request->getQueryParam('sekolahid', false);

        $query = $model->find()
                       ->select([
                            'a.`id`',
                            'a.`dirty_attributes`',
                            'a.`tablename`',
                            'a.`controller_id`',
                            'a.`action_id`',
                            'a.`sekolahid`',
                            'a.`created_at`',
                            'a.`created_by`',
                            'IFNULL(p.nama_pegawai,u.username) fullname'
                        ])
                       ->from('logs a')
                       ->leftJoin('user u', 'a.`created_by` = `u`.`id`')
                       ->leftJoin('pegawai p', 'u.`pegawai_id` = `p`.`id`')
                       ->where('1=1')
                       ->orderBy(['created_at' => SORT_DESC, 'id' => SORT_DESC])
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['a.sekolahid' => $sekolahid]);
        }
        if($controllerid){
            $query->andWhere(['a.controller_id' => $controllerid]);
        }
        if($date_start && $date_end){
            $date_start = date('Y-m-d',strtotime($date_start)) . ' 00:00:00';
            $date_end = date('Y-m-d',strtotime($date_end)) . ' 23:59:59';
            $query->andWhere(['between','a.created_at', $date_start, $date_end]);
        }
        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
    }
}