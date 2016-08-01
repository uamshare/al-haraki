<?php
namespace rest\modules\api;

class UrlRule extends \yii\rest\UrlRule
{
	public $exception_controller = null;
	/**
     * @inheritdoc
     */
    public function init()
    {	
    	if(is_array($this->exception_controller)){
    		$this->exception_controller = array_unique( array_merge(['api/default'],$this->exception_controller) );
    	}else{
    		$this->exception_controller = ['api/default'];
    	}
		$this->controller = $this->setAllController();
        parent::init();
    }

    private function setAllController(){
  		$controller = [];
		$dir    = \Yii::getAlias('@rest') . '/modules/api/controllers';
		foreach (glob("$dir/*.php") as $filename) {
		    $ctlname = strtolower(str_replace('Controller.php', '', basename($filename)));
		    if(!in_array('api/' .$ctlname, $this->exception_controller)){
		    	$controller[] = 'api/' . strtolower(str_replace('Controller.php', '', basename($filename)));
		    }
		}
		if(is_array($this->controller)){
			$controller = array_unique( array_merge($this->controller,$controller) );
		}
    	return $controller;
    }
}