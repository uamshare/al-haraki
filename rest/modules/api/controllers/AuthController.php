<?php
namespace rest\modules\api\controllers;
use Yii;
use rest\modules\api\BaseApiController;

class AuthController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\Auth';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'profil' => ['get'],
                        'login' => ['post', 'options'],
                        'logout' => ['post'],
                        'assignmentrole' => ['post'],
                    ],
                ]
            ]
        );
    }

    // public function actionIndex(){
    // 	$data['data'] = ['__token' => Yii::$app->getSecurity()->generateRandomString()];
    // 	return $data;
    // }

    public function actionLogin()
    {
        $model = $this->modelClass;
        $post = Yii::$app->getRequest()->getBodyParams();
        $username = isset($post['username']) ? $post['username'] : false;
        $password = isset($post['password']) ? $post['password'] : false;

        // var_dump(Yii::$app->security->generatePasswordHash('12345678'));exit();

        if(!$username || !$password){
            $this->response = Yii::$app->getResponse();
            $this->response->setStatusCode(401, 'Unauthorized');
            return [
                'error_message' => 'Username or password not found'
            ];
        }

        $user = $model::findByLogin($username, $password);
        if($user && Yii::$app->user->login($user)){
            $user = \Yii::$app->user->identity;
            $user->access_token = \Yii::$app->getSecurity()->generateRandomString();
            $user->password_reset_token = \Yii::$app->getSecurity()->generateRandomString();
            $a = $user->save();
            if(!$a){
                $this->response = Yii::$app->getResponse();
                $this->response->setStatusCode(400, 'Data is empty.');
                return [
                    'message' => $user->getErrors()
                ];
            }
            $data = [
                // '__id' => \Yii::$app->getSecurity()->generateRandomKey(),
                '__accessToken' =>  $user->access_token,
                '__isLogin' => true,
                '__user_profile' => $user->profile,
                '__sekolah_profile' => \rest\models\Sekolah::getProfile($user->sekolahid),
            ];

            $data = array_merge($data);
        }else{
            $this->response = Yii::$app->getResponse();
            $this->response->setStatusCode(401, 'Unauthorized');
            $data = [
                // '__isLogin' => false,
                'error_message' => 'Username or password not found'
            ];
        }
        
        return $data;
    }

    public function actionLogout()
    {
        $user = \Yii::$app->user->identity;
        $user->access_token = \Yii::$app->getSecurity()->generateRandomString();
        $user->password_reset_token = \Yii::$app->getSecurity()->generateRandomString();
        $a = $user->save();
        
        Yii::$app->user->logout();
        return ['logout' => true];
    }

    public function actionProfile()
    {
        return Yii::$app->user->identity->profile;
    }

    // public function checkAccess($action, $model = null, $params = [])
    // {
    //     return true;
    // }
}