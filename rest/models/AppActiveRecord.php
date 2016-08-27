<?php

namespace rest\models;

use Yii;
use yii\db\Query;

class AppActiveRecord extends \yii\db\ActiveRecord
{
	public function beforeSave($insert){
        if(parent::beforeSave($insert)) {
            $logs = new \rest\models\Logs();
            $logs->controller_id = \Yii::$app->controller->id;
            $logs->action_id = \Yii::$app->controller->action->id;
            $logs->tablename = $this->tableName();
            $dirty_attributes = $this->dirtyAttributes;
            $date = date('Y-m-d H:i:s');
            $dirty_attributes['created_at'] = $date;
            $dirty_attributes['updated_at'] = $date;
            $logs->dirty_attributes = json_encode($dirty_attributes);
            $logs->created_at = $this->created_at;
            $logs->created_by = \Yii::$app->user->getId();
            if(!$logs->save()){
                var_dump($logs->getErrors());
            }
            return true;
        } else {
            return false;
        }
    }
}