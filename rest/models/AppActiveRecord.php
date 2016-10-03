<?php

namespace rest\models;

use Yii;
use yii\db\Query;

class AppActiveRecord extends \yii\db\ActiveRecord
{
    protected $isAutoSaveLog = false;

	public function beforeSave($insert){
        if(parent::beforeSave($insert)){
            if($this->isAutoSaveLog){
                $user = \Yii::$app->user;
                $request = Yii::$app->getRequest();

                $sekolahid = (isset($user->sekolahid) && $user->sekolahid > 0) ? $user->sekolahid : 1;
                $sekolahid = $request->getQueryParam('sekolahid', $sekolahid);
                $this->saveLogs(null, $sekolahid);
            }
            return true;
        } else {
            return false;
        }
    }

    public function beforeDelete()
    {
        if (parent::beforeDelete()) {
            if($this->isAutoSaveLog){
                $user = \Yii::$app->user;
                $request = Yii::$app->getRequest();

                $sekolahid = (isset($user->sekolahid) && $user->sekolahid > 0) ? $user->sekolahid : 1;
                $sekolahid = $request->getQueryParam('sekolahid', $sekolahid);
                $this->saveLogs($this->attributes, $sekolahid);
            }
            return true;
        } else {
            return false;
        }
    }

    public function saveLogs($dirtyAttributes = null, $sekolahid = null){
        $logs = new \rest\models\Logs();
        $logs->controller_id = \Yii::$app->controller->id;
        $logs->action_id = \Yii::$app->controller->action->id;
        $logs->tablename = $this->tableName();
        $dirty_attributes = (is_null($dirtyAttributes)) ? $this->dirtyAttributes : $dirtyAttributes;

        $date = date('Y-m-d H:i:s');

        if($dirty_attributes){

            $dirty_attributes['created_at'] = $date;
            $dirty_attributes['updated_at'] = $date;
            $logs->dirty_attributes = json_encode($dirty_attributes);
            $logs->created_at = isset($this->updated_at) ? $this->updated_at : $date;
            $logs->created_by = \Yii::$app->user->getId();

            $user = \Yii::$app->user;
            $request = Yii::$app->getRequest();
            $_sekolahid = $request->getQueryParam('sekolahid', null);
            $logs->sekolahid = (!is_null($sekolahid) ? $sekolahid : $_sekolahid);

            if(!$logs->save()){
                var_dump($logs->getErrors());
            }
        }
    }
}