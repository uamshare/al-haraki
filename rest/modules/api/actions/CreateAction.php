<?php
namespace rest\modules\api\actions;

use Yii;
use yii\base\Model;
use yii\helpers\Url;
use yii\web\ServerErrorHttpException;

/**
 * CreateAction implements the API endpoint for creating a new model from the given data.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class CreateAction extends \yii\rest\Action
{
    /**
     * @var string the scenario to be assigned to the new model before it is validated and saved.
     */
    public $scenario = Model::SCENARIO_DEFAULT;
    /**
     * @var string the name of the view action. This property is need to create the URL when the model is successfully created.
     */
    public $viewAction = 'view';


    /**
     * Creates a new model.
     * @return \yii\db\ActiveRecordInterface the model newly created
     * @throws ServerErrorHttpException if there is any error when creating the model
     */
    public function run()
    {
        if ($this->checkAccess) {
            call_user_func($this->checkAccess, $this->id);
        }

        /* @var $model \yii\db\ActiveRecord */
        $model = new $this->modelClass([
            'scenario' => $this->scenario,
        ]);


        $post = Yii::$app->getRequest()->getBodyParams();
        $model->load($post, '');
        // var_dump(get_object_vars($model));exit(); 
        try{
            $model->save();
            Yii::$app->getResponse()->setStatusCode(201);
            return ['message' => 'data is deleted'];
        } catch(\Exception $e) {
            if($e->errorInfo){
                switch($e->errorInfo[1]){
                    case 1062 :
                        \Yii::$app->getResponse()->setStatusCode(500);
                        return ['message' => 'Terjadi duplikasi data, silahkan hubungi administrator', 'errorInfo' => $e->errorInfo];
                        break;
                    default :
                        throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
                        break;
                }
                return $e->errorInfo;
            }else{
                throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
            }
        }

        // if ($model->save()) {
        //     $response = Yii::$app->getResponse();
        //     $response->setStatusCode(201);
        //     $id = implode(',', array_values($model->getPrimaryKey(true)));
        //     $response->getHeaders()->set('Location', Url::toRoute([$this->viewAction, 'id' => $id], true));
        // } elseif (!$model->hasErrors()) {
        //     throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        // }

        return $model;
    }
}
