<?php
namespace rest\modules\api\controllers;
use Yii;
use rest\modules\api\BaseApiController;

class AuthController extends BaseApiController
{
    public $modelClass = 'rest\models\User';

    public function actionIndex(){
    	$data['data'] = ['__token' => Yii::$app->getSecurity()->generateRandomString()];
    	return $data;
    }

    public function actionLogin()
    {
        $model = $this->modelClass;
        $username = Yii::$app->getRequest()->post('username', '');
        $password = Yii::$app->getRequest()->post('password', '');
        $user = $model::findByLogin($username, md5($password));
        
        if($user && Yii::$app->user->login($user)){
            // var_dump(Yii::$app->getSecurity()->generatePasswordHash($user->iduser));exit();
            $user = \Yii::$app->user->identity;
            $data = [
                '__id' => \Yii::$app->getSecurity()->generateRandomString(),
                '__accessToken' => Yii::$app->getSecurity()->generatePasswordHash($user->pswd), // $user->accessToken, //'100-token',
                '__isLogin' => true,
            ];

            $session = \Yii::$app->getSession();
            $session->set('__token', $data['__accessToken']);
            $session->set('__token_id', $data['__id']);
            $session->set('__expired', time() + \Yii::$app->params['user.tokenExpire']);
            $session->set('__ip',\Yii::$app->request->userip);

        }else{
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