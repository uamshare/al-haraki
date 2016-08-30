<?php
namespace rest\modules\api;
use Yii;
use yii\data\ActiveDataProvider;

class ActiveController extends \yii\rest\ActiveController
{
    // public $serializer = 'rest\modules\api\Serializer';
	/**
     * @inheritdoc
     */

    public $checkAccess = true;

    public function init()
    {
        parent::init();
    }

    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        if ($this->checkAccess) {
            $this->checkAccess($action->id);
        }

        return true; // or false to not run the action
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
    	$parentActions =  parent::actions();
    	$parentActions['index'] = [
    		'class' => 'rest\modules\api\actions\IndexAction',
            // 'class' => 'yii\rest\IndexAction',
            'modelClass' => $this->modelClass,
            'checkAccess' => [$this, 'checkAccess']
    	];
        $parentActions['create'] = [
            'class' => 'rest\modules\api\actions\CreateAction',
            'modelClass' => $this->modelClass,
            'checkAccess' => [$this, 'checkAccess'],
            'scenario' => $this->createScenario,
        ];

        $parentActions['update'] = [
            'class' => 'rest\modules\api\actions\UpdateAction',
            'modelClass' => $this->modelClass,
            'checkAccess' => [$this, 'checkAccess'],
            'scenario' => $this->createScenario,
        ];

        $response = Yii::$app->response;
        return $parentActions;
    }

    /**
     * Prepares the data provider that should return the requested collection of the models.
     * @return ActiveDataProvider
     */
    protected function prepareDataProvider($query)
    {
        $request = Yii::$app->getRequest();
        $perpage = $request->getQueryParam('per-page', 20);
        $pagination = [
            'pageSize' => $perpage
        ];

        return new ActiveDataProvider([
            'query' => $query,
            'pagination' => ($perpage > 0) ? $pagination : false
        ]);
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
    public function checkAccess($action, $model = null, $params = [])
    {
        if( in_array($this->id . '.' . $action, ['auth.login','auth.logout','role.menuprivileges']) ){
            return $action;
        }
        if( !in_array($action, ['index','view','create','update','delete']) ){
            $method = Yii::$app->getRequest()->method;
            $actiontransform = [
                'GET' => 'index',
                'POST' => 'create',
                'PUT' => 'update',
                'DELETE' => 'delete',
            ];
            $action = $actiontransform[$method];
        }
        if ( Yii::$app->user->can($this->id . '_' . $action) === false) 
        {
             throw new \yii\web\ForbiddenHttpException('You don\'t have permission.');
        }
    }
}