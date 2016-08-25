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

    public function getRoles(){
    	return $this->getItems(1);
    }

    public function getPermissions(){
    	return $this->getItems(2);
    }
}