<?php

namespace rest\modules\api;

use yii\web\Response;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use rest\modules\api\auth\HttpHeaderAuth;

class Api extends \yii\base\Module
{
    public $controllerNamespace = 'rest\modules\api\controllers';

    public function behaviors()
	{
		// $actionid = \Yii::$app->controller->id . '.' . \Yii::$app->controller->action->id;
		$behaviors = parent::behaviors();

		// if(in_array($actionid, ['auth.login'])){
		// 	return $behaviors;
		// }

		// $behaviors['authenticator'] = [
		// 	'class' => CompositeAuth::className(),
		// 	'authMethods' => [
		// 		HttpBasicAuth::className(),
		// 		HttpBearerAuth::className(),
		// 		QueryParamAuth::className(),
		// 		HttpHeaderAuth::className()
		// 	]
		// ];
	 //    $behaviors['contentNegotiator']['formats']['text/html'] = Response::FORMAT_HTML;
	 //    $behaviors['corsFilter'] = [
  //           'class' => \yii\filters\Cors::className(),
  //           'cors' => [
  //               'Origin' => ['*'],
  //               'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  //               'Access-Control-Request-Headers' => ['*'],
  //               'Access-Control-Allow-Credentials' => true,
  //               'Access-Control-Max-Age' => 86400,
  //           ],
  //       ];
		return $behaviors;
	}
	
    public function init()
    {
        parent::init();
		\Yii::$app->user->enableSession = false;
    }
    
	public function beforeAction($action)
	{
		if (!parent::beforeAction($action)) {
			return false;
		}

		return true; // or false to not run the action
	}
}
