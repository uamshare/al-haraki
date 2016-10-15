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
        // 'cache' => [
        //     'class' => 'yii\caching\FileCache',
        // ],
        'formatter' => [
           'dateFormat' => 'Y-m-d',
           'datetimeFormat' => 'Y-m-d H:i:s',
           'timeFormat' => 'H:i:s',

           'defaultTimeZone' => 'Asia/Jakarta', // time zone
        ],
        'request' => [
            'csrfParam' => '_csrf-rest',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
                // 'application/xml' => 'yii\web\XMLParser',
            ]
        ],
        'user' => [
            'identityClass' => 'rest\models\Auth',
            'enableAutoLogin' => false,
            'enableSession' => false
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
        'response' => [
            'class' => 'yii\web\Response',
            'format' =>  \yii\web\Response::FORMAT_JSON,
            'on beforeSend' => function ($event) {
                $response = $event->sender;

                if(in_array($response->statusCode, [200,201,202,203,204])){
                    $header = $response->getHeaders();
                    if ($response->data !== null && Yii::$app->request->get('rsp_type')) {
                        if(Yii::$app->request->get('rsp_type') == 1){
                            $response->data = [
                                'success' => $response->isSuccessful,   
                                'total' => count($response->data), //$header['x-pagination-total-count'],
                                'rows' => $response->data
                            ];
                        }else if(Yii::$app->request->get('rsp_type') == 2){
                            $response->data = [
                                'success' => $response->isSuccessful,
                                'total_items' => count($response->data), //$header['x-pagination-total-count'],
                                'items' => $response->data
                            ];
                        }
                        
                        // $response->statusCode = 200;
                    }else{
                        $response->data = [
                            'success' => $response->isSuccessful,   
                            'total' => isset($header['x-pagination-total-count']) ? $header['x-pagination-total-count'] : count($response->data),
                            'rows' => $response->data
                        ];
                    }
                }else{
                    $response->data['success'] = false;
                }
            }
        ]
    ],
    'params' => $params,
];
