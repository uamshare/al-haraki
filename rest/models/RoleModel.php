<?php
namespace rest\models;
use Yii;

class RoleModel extends \yii\rbac\DbManager
{
	/**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
    }

    public function getRoles($rolename = ''){
    	return (empty($rolename)) ? $this->getItems(1) : $this->getRole($rolename);
    }

    public function getPermissions(){
    	return $this->getItems(2);
    }
}