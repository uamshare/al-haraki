AL - Haraki Project
===============================

Step Install
-------------------

```
1. create database `alharaki`
2. set db config on common/config/main-loacl.php
        'components' => [
          'db' => [
              'class' => 'yii\db\Connection',
              'dsn' => 'mysql:host=localhost;dbname=alharaki',
              'username' => 'user_db',
              'password' => 'pass_db',
              'charset' => 'utf8',
          ],
      ],
3. run db migrate on console :
    yii migrate
    yii migrate --migrationPath=@yii/rbac/migrations/

```
