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
     * @inheritdoc
     */
    // protected function verbs()
    // {
    //     return [
    //         'index' => ['GET', 'HEAD', ],
    //         'view' => ['GET', 'HEAD'],
    //         'create' => ['POST'],
    //         'update' => ['PUT', 'PATCH'],
    //         'delete' => ['DELETE'],
    //     ];
    // }
}