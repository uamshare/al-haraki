<?php
namespace rest\modules\api\actions;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;
use yii\web\ServerErrorHttpException;

/**
 * UpdateAction implements the API endpoint for updating a model.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class UpdateAction extends \yii\rest\Action
{
    /**
     * @var string the scenario to be assigned to the model before it is validated and updated.
     */
    public $scenario = Model::SCENARIO_DEFAULT;


    /**
     * Updates an existing model.
     * @param string $id the primary key of the model.
     * @return \yii\db\ActiveRecordInterface the model being updated
     * @throws ServerErrorHttpException if there is any error when updating the model
     */
    public function run($id)
    {
        /* @var $model ActiveRecord */
        $model = $this->findModel($id);
        
        if ($this->checkAccess) {
            call_user_func($this->checkAccess, $this->id, $model);
        }

        $model->scenario = $this->scenario;
        $post = Yii::$app->getRequest()->getBodyParams();

        // if(!isset($post[$model->formName()])){
        //     throw new \yii\web\HttpException('404','Root Property not set.');
        // }

        // $post[$model->formName()] = json_decode($post[$model->formName()], true);

        $model->load($post, '');
        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }
        return $model;
    }
}
