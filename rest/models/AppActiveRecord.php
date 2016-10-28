<?php
/**
 * Base Model for app
 *
 * @author Uam <uamshare@gmail.com>
 * @since 1.0
 */
namespace rest\models;

use Yii;
use yii\db\Query;

class AppActiveRecord extends \yii\db\ActiveRecord
{
    protected $isAutoSaveLog = false;
    protected $tempAttributes;

    public function beforeSave($insert){
        if(parent::beforeSave($insert)){
            if($this->isAutoSaveLog){
            }
            return true;
        } else {
            return false;
        }
    }

    public function afterSave($insert, $changedAttributes){
        parent::afterSave($insert, $changedAttributes);
        if($this->isAutoSaveLog){
            $user = \Yii::$app->user;
            $sekolahid = (isset($user->sekolahid) && $user->sekolahid > 0) ? $user->sekolahid : 1;
            $sekolahid = \Yii::$app->getRequest()->getQueryParam('sekolahid', $sekolahid);
            $this->saveLogs($changedAttributes, $sekolahid);
        }
    }

    public function beforeDelete()
    {
        if (parent::beforeDelete()) {
            if($this->isAutoSaveLog){
                $this->tempAttributes = $this->attributes;
            }
            return true;
        } else {
            return false;
        }
    }

    public function afterDelete()
    {
        parent::beforeDelete();
        if($this->isAutoSaveLog){
            $sekolahid = (isset(\Yii::$app->user->sekolahid) && \Yii::$app->user->sekolahid > 0) ? $user->sekolahid : 1;
            $sekolahid = \Yii::$app->getRequest()->getQueryParam('sekolahid', $sekolahid);
            $this->saveLogs($this->tempAttributes, $sekolahid);
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
            $logs->created_at = $date; //isset($this->updated_at) ? $this->updated_at : $date;
            $logs->created_by = \Yii::$app->user->getId();

            $user = \Yii::$app->user;
            $request = Yii::$app->getRequest();
            $_sekolahid = $request->getQueryParam('sekolahid', null);
            $logs->sekolahid = (!is_null($sekolahid) ? $sekolahid : $_sekolahid);

            $logsave = $logs->save();
            if(!$logsave){
                \Yii::error($this->tempLogs->getErrors(), 'database');
            }else{
                // Yii::trace('save log success');
            }
        }
    }
}