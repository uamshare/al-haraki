<?php
namespace rest\modules\api\controllers;
use Yii;
use rest\modules\api\BaseApiController;

class AuthController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\Auth';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbs' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'login' => ['post']
                    ],
                ],
            ]
        );
    }

    public function actionIndex(){
    	$data['data'] = ['__token' => Yii::$app->getSecurity()->generateRandomString()];
    	return $data;
    }

    public function actionLogin()
    {
        $model = $this->modelClass;
        $post = Yii::$app->getRequest()->getBodyParams();
        $username = isset($post['username']) ? $post['username'] : false;
        $password = isset($post['password']) ? $post['password'] : false;
        // var_dump($post);exit();
        $user = $model::findByLogin($username, md5($password));
        
        if($user && Yii::$app->user->login($user)){
            // var_dump(Yii::$app->getSecurity()->generatePasswordHash($user->iduser));exit();
            $user = \Yii::$app->user->identity;
            $data = [
                '__id' => \Yii::$app->getSecurity()->generateRandomString(),
                '__accessToken' =>  $user->access_token, //Yii::$app->getSecurity()->generatePasswordHash($user->access_token),
                '__isLogin' => true,
            ];

            $session = \Yii::$app->getSession();
            $session->set('__token', $data['__accessToken']);
            $session->set('__token_id', $data['__id']);
            $session->set('__expired', time() + \Yii::$app->params['user.passwordResetTokenExpire']);
            $session->set('__ip',\Yii::$app->request->userip);

        }else{
            $this->response = Yii::$app->getResponse();
            $this->response->setStatusCode(401, 'Unauthorized');
            $data = [
                '__isLogin' => false,
                'error_message' => 'Username or password not found'
            ];
        }
        
        return $data;
    }

    public function actionLogout()
    {
        Yii::$app->user->logout();
        return ['logout' => true];
    }

    public function checkAccess($action, $model = null, $params = [])
    {
        return true;
    }
}