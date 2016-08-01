AL - Haraki Project
===============================

Step Install
-------------------

```
1. composer global require "fxp/composer-asset-plugin:~1.1.1"
   composer update
2. php init
3. create database `alharaki`
4. set db config on common/config/main-loacl.php
        'components' => [
          'db' => [
              'class' => 'yii\db\Connection',
              'dsn' => 'mysql:host=localhost;dbname=alharaki',
              'username' => 'user_db',
              'password' => 'pass_db',
              'charset' => 'utf8',
          ],
      ],
5. run db migrate on console :
    yii migrate
    yii migrate --migrationPath=@yii/rbac/migrations/

```
