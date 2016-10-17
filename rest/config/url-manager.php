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
                    // 'controller' => ['api/tagihaninfoinput'],
                    // 'pluralize' => false,
                    'extraPatterns' => [
                        'POST login' => 'login',
                        'OPTIONS login' => 'options',
                        'POST logout' => 'logout',
                        'OPTIONS logout' => 'options',
                        'OPTIONS list' => 'options',
                        'GET list' => 'list',
                        'OPTIONS listbayar' => 'options',
                        'GET listbayar' => 'listbayar',
                        'OPTIONS newnokwitansi' => 'options',
                        'GET newnokwitansi' => 'newnokwitansi',
                        'OPTIONS newnotransaksi' => 'options',
                        'GET newnotransaksi' => 'newnotransaksi',
                        'OPTIONS menuprivileges' => 'options',
                        'GET menuprivileges' => 'menuprivileges',
                        'OPTIONS listpermissions' => 'options',
                        'GET listpermissions' => 'listpermissions',
                        'OPTIONS assign' => 'options',
                        'POST assign' => 'assign',
                        'OPTIONS summaryouts' => 'options',
                        'GET summaryouts' => 'summaryouts',
                        'OPTIONS listinfo' => 'options',
                        'GET listinfo' => 'listinfo',
                        'OPTIONS findbyno' => 'options',
                        'GET findbyno' => 'findbyno',
                        'GET profile' => 'profile',
                        'GET profile/{id}' => 'profile',
                        'POST profile' => 'changeprofile',
                        'PUT profile' => 'changeprofile',
                        'OPTIONS profile' => 'options',
                        'OPTIONS profile/{id}' => 'options',
                        'POST avatar' => 'avatar',
                        'OPTIONS avatar' => 'options',
                    ]
                ],
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
                // 'api/tblcustomer/<action:\w+>' => 'api/tblcustomer/<action>',
                'api/<controller:\w+>/<action:\w+>' => 'api/<controller>/<action>',
                'api/<controller:\w+>/<action: put|delete>/<id>' => 'api/<controller>/<action>',
                // 'api/<controller:\w+>/<action:\w+>/<id:\w+>' => 'api/<controller>/<action>?id=<id>',
                // '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/save'
            ],
        ],
	]
];