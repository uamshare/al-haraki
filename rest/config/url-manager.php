<?php
return [
	'components' => [
		'urlManager' => [
            'showScriptName' => false, // Disable index.php
            'enablePrettyUrl' => true, // Disable r= routes
            'enableStrictParsing' => true,
            'rules' => [
                [
                    'class' => 'rest\modules\api\UrlRule', //'yii\rest\UrlRule', 
                    // 'exception_controller' => ['api/mcoah'],
                    'controller' => ['api/tagihaninfoinput'],
                    // 'extraPatterns' => [
                    //     'POST save' => 'save',
                    //     'POST upload' => 'upload',
                    // ]
                ],
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
                // 'api/tblcustomer/<action:\w+>' => 'api/tblcustomer/<action>',
                'api/<controller:\w+>/<action:\w+>' => 'api/<controller>/<action>',
                // 'api/<controller:\w+>/<action:\w+>/<id:\w+>' => 'api/<controller>/<action>/<id>',
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/save'
            ],
        ],
	]
];