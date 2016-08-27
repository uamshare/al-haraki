<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;

class UserController extends \yii\rest\ActiveController //\yii\redis\ActiveRecord // \rest\modules\api\ActiveController //
{
    public $modelClass = 'rest\models\User';

    public function actions()
    {
        $actions = parent::actions();
        // unset($actions['create']);
        // unset($actions['delete']);
        // unset($actions['update']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbs' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'index'  => ['get'],
                        'view'   => ['get'],
                        'create' => ['post'],
                        'update' => ['put'],
                        'delete' => ['delete'],
                    ],
                ],
            ]
        );
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $this->prepareDataProvider($model->getList([
            'id' => $request->getQueryParam('id', false),
            'username' => $request->getQueryParam('username', false),
            'email' => $request->getQueryParam('email', false),
            'query' => $request->getQueryParam('query', false)
        ]));
    }

    public function actionView($id){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();

        return $this->prepareDataProvider($model->getList([
            'id' => $id
        ]));
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
}