<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class RoleController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\RoleModel';
    public $Auth;

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);
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
                        'index'    => ['get'],
                        'list'     => ['get'],
                        'assign'   => ['post','put'],
                        // 'remove'   => ['delete']
                    ],
                ],
            ]
        );
    }

    public function init(){
    	parent::init();
    }

    public function actionAssign(){
        $post = Yii::$app->getRequest()->getBodyParams();

        if($post ){
            $Auth = new $this->modelClass;
            $user = Yii::$app->user;

            $role = $Auth->getRole($post['rolename']);
            if(!$role){
                $role = $Auth->createRole('admin');
                $Auth->add($role);
                $Auth->assign($role, $user->getId());
            }

            foreach($post['permissions'] as $pms){
                // add permission
                $permission = $Auth->getPermission($pms['name']);
                if(!$permission){
                    $permission = $Auth->createPermission($pms['name']);
                    $permission->description = $pms['desc'];
                    $Auth->add($permission);
                }
                if(!$Auth->hasChild($role, $permission)){
                    $Auth->addChild($role, $permission);
                }
            }
        }
        

        return ['success' => true];
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $Auth = new $this->modelClass;
        return $Auth->getRoles();
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListpermissions(){
        $Auth = new $this->modelClass;
        return $Auth->getPermissions();
    }
}