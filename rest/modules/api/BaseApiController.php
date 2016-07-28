<?php
namespace rest\modules\api;
use Yii;
// use sipenelitian\models\Archives;
use yii\rest\ActiveController;
use linslin\yii2\curl;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;

use yii\helpers\Url;
use yii\web\ServerErrorHttpException;
use yii\web\HttpException;

class BaseApiController extends ActiveController
{
    // public $modelClass = 'app\models\Usergroup';

    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        if(!isset($this->modelClass)) throw new NotFoundHttpException("Object not found");
        return true; // or false to not run the action
    }
    
    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    protected function verbs()
    {
        return [
            'index' => ['GET', 'HEAD'],
            'view' => ['GET', 'HEAD'],
            'create' => ['POST'],
            'update' => ['POST','PUT', 'PATCH'],
            'delete' => ['POST','DELETE'],
        ];
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionIndex()
    {
        $model = $this->findModel();
        return $model;
    }

    /**
     * Displays a model.
     * @param string $id the primary key of the model.
     * @return \yii\db\ActiveRecordInterface the model being displayed
     */
    public function actionView($id)
    {
        $model = $this->findModel($id);

        return $model;
    }

    /**
     * Creates a new model.
     * @return \yii\db\ActiveRecordInterface the model newly created
     * @throws ServerErrorHttpException if there is any error when creating the model
     */
    public function actionCreate()
    {
       

        /* @var $model \yii\db\ActiveRecord */
        $model = new $this->modelClass;

        $post = Yii::$app->getRequest()->getBodyParams();
        if(!isset($post[$model->formName()])){
            throw new HttpException('404','Root Property not set.');
        }

        $post[$model->formName()] = json_decode($post[$model->formName()], true);

        $model->load($post);

        if ($model->save()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            $id = implode(',', array_values($model->getPrimaryKey(true)));
            $response->getHeaders()->set('Location', Url::toRoute(['view', 'id' => $id], true));
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return $model;
    }

    /**
     * Updates an existing model.
     * @param string $id the primary key of the model.
     * @return \yii\db\ActiveRecordInterface the model being updated
     * @throws ServerErrorHttpException if there is any error when updating the model
     */
    public function actionUpdate($id)
    {
        /* @var $model ActiveRecord */
        $modelClass = $this->modelClass;
        $model = $modelClass::findOne($id);

        $post = Yii::$app->getRequest()->getBodyParams();
        $post[$model->formName()] = json_decode($post[$model->formName()], true);
        $model->load($post);
        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        return $model;
    }

    /**
     * Deletes a model.
     * @param mixed $id id of the model to be deleted.
     * @throws ServerErrorHttpException on failure.
     */
    public function actionDelete($id)
    {
        $modelClass = $this->modelClass;
        $model = $modelClass::findOne($id);

        if ($model->delete() === false) {
            throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
        }

        Yii::$app->getResponse()->setStatusCode(204);
    }

    /**
     * Checks the privilege of the current user.
     *
     * This method should be overridden to check whether the current user has the privilege
     * to run the specified action against the specified data model.
     * If the user does not have access, a [[ForbiddenHttpException]] should be thrown.
     *
     * @param string $action the ID of the action to be executed
     * @param object $model the model to be accessed. If null, it means no specific model is being accessed.
     * @param array $params additional parameters
     * @throws ForbiddenHttpException if the user does not have access
     */
    public function getCheckAccess()
    {
    }

    /**
     * Returns the data model based on the primary key given.
     * If the data model is not found, a 404 HTTP exception will be raised.
     * @param string $id the ID of the model to be loaded. If the model has a composite primary key,
     * the ID must be a string of the primary key values separated by commas.
     * The order of the primary key values should follow that returned by the `primaryKey()` method
     * of the model.
     * @return ActiveRecordInterface the model found
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function findModel($id = -1)
    {
        
        $modelClass = $this->modelClass;
        $count = $modelClass::find();
        $model = $modelClass::find()
        		->offset(Yii::$app->request->getQueryParam('start', 0))
            	->limit(Yii::$app->request->getQueryParam('limit', 20));

        $keys = $modelClass::primaryKey();
        if((int)$id > 0){
            $values = explode(',',(string)$id);
        	$model->where(array_combine($keys, $values));
        	$count->where(array_combine($keys, $values));
        }

        // get like filter
        $schema = $modelClass::getTableSchema()->columns;
        $query  = Yii::$app->request->getQueryParam('query', null);
        if($query){
        	foreach ($schema as $column => $val) {
	            $model->orFilterWhere(['like', $column, $query]);
	            $count->orFilterWhere(['like', $column, $query]);
	        }
        }
        
        // var_dump($model->createCommand()->rawSql);exit();

        $response['total'] = $count->count();
        $response['rows'] = $model->All();
        if (isset($model)) {
            return $response;
        } else {
            throw new NotFoundHttpException("Object not found: $id");
        }
    }

    /**
     * Checks the privilege of the current user.
     *
     * This method should be overridden to check whether the current user has the privilege
     * to run the specified action against the specified data model.
     * If the user does not have access, a [[ForbiddenHttpException]] should be thrown.
     *
     * @param string $action the ID of the action to be executed
     * @param object $model the model to be accessed. If null, it means no specific model is being accessed.
     * @param array $params additional parameters
     * @throws ForbiddenHttpException if the user does not have access
     */
    // public function checkAccess($action, $model = null, $params = [])
    // {
    //     return true;
    // }
}