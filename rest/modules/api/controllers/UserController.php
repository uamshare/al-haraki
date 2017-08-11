<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\data\ActiveDataProvider;
use yii\web\ServerErrorHttpException;

class UserController extends \rest\modules\api\ActiveController // \yii\rest\ActiveController
{
    public $modelClass = 'rest\models\User';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        // unset($actions['delete']);
        unset($actions['update']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
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

    public function actionProfile(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();

        return [
            'user' => Yii::$app->user->identity->getList()->One(),
            'pegawai' => Yii::$app->user->identity->pegawai,
        ];
    }

    public function actionCreate(){
        $model = new $this->modelClass();

        $post = Yii::$app->getRequest()->getBodyParams();

        $post['auth_key'] = Yii::$app->getSecurity()->generateRandomString();
        $post['password_hash'] = Yii::$app->security->generatePasswordHash($post['password_hash']);
        $post['pegawai_id'] = (isset($post['pegawai_id']) && !empty($post['pegawai_id'])) ? 
                                (int)$post['pegawai_id'] : null;
        $post['sekolahid'] = (isset($post['sekolahid'])) ? (int)$post['sekolahid'] : null;

        $post['access_token'] = "";
        $model->load($post, '');
        $save = $model->save();
        if ($save) {
            if($post['role']){
                $this->AssignRole($model->id, $post['role']);
            }
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            // $id = implode(',', array_values($model->getPrimaryKey(true)));
            // $response->getHeaders()->set('Location', Url::toRoute([$this->viewAction, 'id' => $id], true));
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return ($save) ? $model->getList($model->id)->one() : $model;
    }

    private function AssignRole($userid, $rolename){
        $Auth = new \rest\models\RoleModel();
        if($rolename && $userid){
            $role = $Auth->getRole($rolename);
            if(!$role){
                $role = $Auth->createRole('admin');
                $role->description = $form['description'];
                $Auth->add($role);
                $Auth->assign($role, $user->getId());
            }

            $Auth->revokeAll($userid);
            $Auth->assign($role, $userid);
            return $role;
        }
        return false;
    }

    public function actionUpdate($id){
        $model = \rest\models\User::findOne($id);

        $post = Yii::$app->getRequest()->getBodyParams();
        $post['auth_key'] = Yii::$app->getSecurity()->generateRandomString();
        if(isset($post['password_hash']) && !empty($post['password_hash']) 
            &&  $post['password_hash'] !='null')
        {
            $post['password_hash'] = Yii::$app->security->generatePasswordHash($post['password_hash']);
        }else{
            $post['password_hash'] = $model->password_hash;
        }
        $post['pegawai_id'] = (isset($post['pegawai_id'])) ? (int)$post['pegawai_id'] : null;
        $post['sekolahid'] = (isset($post['sekolahid'])) ? (int)$post['sekolahid'] : null;

        // var_dump($post);exit();

        $model->load($post, '');

        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }else{
            if(isset($post['role']) && $post['role']){
                $this->AssignRole($model->id, $post['role']);
            }
        }
        return $model->getList($model->id)->one();
    }

    public function actionChangeprofile(){
        $model = Yii::$app->user->identity;//\rest\models\User::findOne($id);
        $this->response = Yii::$app->getResponse();

        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){

            if(isset($post['password']) && !$model->validatePassword($post['password'])){
                $this->response->setStatusCode(422, 'Data Validation Failed.');
                return [
                    'message' => 'Pasword lama tidak sesuai'
                ];
            }

            $model->password_hash = (isset($post['password_new1'])) ? 
                Yii::$app->security->generatePasswordHash($post['password_new1']) : 
                $model->password_hash;

            $model->username = (isset($post['username'])) ? $post['username'] : $model->username;
            $model->email = (isset($post['email'])) ? $post['email'] : $model->email;

            if ($model->save() === false && !$model->hasErrors()) {
                throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
            }else if($model->hasErrors()){
                return $model->hasErrors();
            }
            return $model->getList($model->id)->one();
        }else{
            $this->response->setStatusCode(422, 'Data Validation Failed.');
            return false;
        }
    }
}