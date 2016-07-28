<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-rest',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'rest\controllers',
    'bootstrap' => ['log'],
    'modules' => [
        'api' => [
            'class' => 'rest\modules\api\Api',
        ]
    ],
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-rest',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
                'application/xml' => 'yii\web\XMLParser',
            ]
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => false,
            // 'identityCookie' => ['name' => '_identity-rest', 'httpOnly' => true],
        ],
        'authManager'  => [
            'class'        => 'yii\rbac\DbManager',
            //            'defaultRoles' => ['guest'],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'urlManager' => [
            'showScriptName' => false, // Disable index.php
            'enablePrettyUrl' => true, // Disable r= routes
            'enableStrictParsing' => true,
            'rules' => [
                [
                    'class' => 'yii\rest\UrlRule', 
                    'controller' => [
                        'api/user',
                        'api/auth',
                        'api/tblcustomer',
                        'api/gintabbingmap',
                        'api/site',
                    ],
                    // 'extraPatterns' => [
                    //     'POST save' => 'save',
                    //     'POST upload' => 'upload',
                    // ]
                ],
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
                // 'api/tblcustomer/<action:\w+>' => 'api/tblcustomer/<action>',
                'api/<controller:\w+>/<action:\w+>' => 'api/<controller>/<action>',
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/save'
            ],
        ],
        'response' => [
            'class' => 'yii\web\Response',
            'format' =>  \yii\web\Response::FORMAT_JSON,
        ]
    ],
    'params' => $params,
];
