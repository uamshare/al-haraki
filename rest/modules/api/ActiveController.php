<?php
namespace rest\modules\api;
use Yii;
use yii\web\Response;
use yii\data\ActiveDataProvider;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use rest\modules\api\auth\HttpHeaderAuth;

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
            $action->id = $this->checkAccess($action->id);
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

        // var_dump($parentActions);exit();

        $response = Yii::$app->response;
        return $parentActions;
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        $actionid = \Yii::$app->controller->id . '.' . \Yii::$app->controller->action->id;
        $behaviors = parent::behaviors();

        if(!in_array($actionid, ['auth.login']) && \Yii::$app->controller->action->id != 'options'){
            $behaviors['authenticator'] = [
                'class' => CompositeAuth::className(),
                'authMethods' => [
                    HttpBasicAuth::className(),
                    HttpBearerAuth::className(),
                    QueryParamAuth::className(),
                    HttpHeaderAuth::className()
                ]
            ];
        }
        

        $behaviors['contentNegotiator'] = [
            'class' => 'yii\filters\ContentNegotiator',
            'formats' => [
                'text/html' => Response::FORMAT_JSON,
                'application/json' => Response::FORMAT_JSON,
                'application/xml' => Response::FORMAT_XML,
            ],
        ];
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Allow-Credentials' => true,
                'Access-Control-Max-Age' => 86400,
            ],
        ];
        return $behaviors;
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
        $method = Yii::$app->getRequest()->method;
        $actiontransform = [
            'GET' => 'index',
            'POST' => 'create',
            'PUT' => 'update',
            'DELETE' => 'delete',
        ];

        if($method == 'OPTIONS'){
            return 'options';
        }

        if( in_array($this->id . '.' . $action, ['auth.login']) ){
            return $action;
        }

        if( !in_array($action, [
                'index','view','create','update','delete',
                'changeprofile',
                'logout',
                'profile',
                'menuprivileges',
                'avatar'
            ])  && 
            !in_array($this->id . '_' . $action, 
            [
                'tagihaninfoinput_list',
                'tagihanpembayaran_listbayar',
                'tagihanpembayaran_summaryouts',
                'kelas_list'
            ])
        ){
            $action = $actiontransform[$method];
        }
        // var_dump($this->id . '_' . $action);
        // var_dump(Yii::$app->user->can($this->id . '_' . $action));exit();
        if ( Yii::$app->user->can($this->id . '_' . $action) === false) 
        {
             throw new \yii\web\ForbiddenHttpException('You don\'t have permission.');
        }

        return $action;
    }
}