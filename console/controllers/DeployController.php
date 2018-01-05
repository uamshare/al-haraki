<?php

namespace console\controllers;

use Yii;
use yii\console\Controller;

use yii\console\Exception;
use yii\helpers\Console;

class DeployController extends Controller
{
    public $message;
    public $deploymentPath = "@console/controllers";

    protected $className = 'AppDeploy';

    public function options($actionID)
    {
        return ['migrationPath'];
    }
    
    public function optionAliases()
    {
        return [
            'p' => 'deploymentPath',
        ];
    }
    
    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            $path = Yii::getAlias($this->deploymentPath);
            if (!is_dir($path)) {
                throw new Exception("Deployment failed. Directory specified in deploymentPath doesn't exist: {$this->deploymentPath}");
            }
            $this->deploymentPath = $path;
            $version = Yii::getVersion();
            $this->stdout("APP Deployment Tool (based on Yii v{$version})\n\n");
            return true;
        } else {
            return false;
        }
    }

    public function actionIndex()
    {
        $className = 'console\controllers\\' . $this->className;
        $this->deployUp($className);
    }

    // public function actionUp()
    // {
    //     $className = 'console\controllers\\' . $this->className;
    //     $this->deployUp($className);
    // }

    public function actionDown()
    {
        $className = 'console\controllers\\' . $this->className;
        $this->deployDown($className);
    }

    // public function actionNew()
    // {
    //     $path = Yii::getAlias($this->deploymentPath);
    //     echo $this->deploymentPath;
    // }

    protected function deployUp($className){
        $class = $this->createDeploment($className);
        $this->stdout("*** applying $className\n", Console::FG_YELLOW);
        $start = microtime(true);   

        if ($this->confirm($class->changelog() . PHP_EOL . 'Apply the above deployment ?')) {
            if ($res = $class->up() !== false) {
                $time = microtime(true) - $start;
                $this->stdout("*** applied $className (time: " . sprintf('%.3f', $time) . "s)\n\n", Console::FG_GREEN);

                return true;
            } else {
                $time = microtime(true) - $start;
                $this->stdout("*** failed to apply $className (time: " . sprintf('%.3f', $time) . "s)\n\n", Console::FG_RED);
                return false;
            }
        }
        
    }

    protected function deployDown($className){
        $class = $this->createDeploment($className);
        $this->stdout("*** rollback $className\n", Console::FG_YELLOW);
        $start = microtime(true);   

        if ($this->confirm($class->changelog() . PHP_EOL . 'Rollback the above deployment ?')) {
            if ($class->down() !== false) {
                $time = microtime(true) - $start;
                $this->stdout("*** Rollback $className (time: " . sprintf('%.3f', $time) . "s)\n\n", Console::FG_GREEN);
                return true;
            } else {
                $time = microtime(true) - $start;
                $this->stdout("*** failed to Rollback $className (time: " . sprintf('%.3f', $time) . "s)\n\n", Console::FG_RED);
                return false;
            }
        }
    }

    /**
     * Creates a new migration instance.
     * @param string $class the migration class name
     * @return \yii\db\MigrationInterface the migration instance
     */
    protected function createDeploment($class)
    {
        $file = $this->deploymentPath . DIRECTORY_SEPARATOR . $this->className . '.php';
        require_once($file);
        return new $class();
    }
}