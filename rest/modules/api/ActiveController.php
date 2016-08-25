<?php
namespace rest\modules\api;
use Yii;

class ActiveController extends \yii\rest\ActiveController
{
    // public $serializer = 'rest\modules\api\Serializer';
	/**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
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
        // var_dump($this->id . '_' . $action);
        // exit();
        
        // if ( Yii::$app->user->can($this->id . '_' . $action) === false) 
        // {
        //      throw new \yii\web\ForbiddenHttpException('You don\'t have permission.');
        // }

    }
}