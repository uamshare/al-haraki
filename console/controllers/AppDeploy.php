<?php
namespace console\controllers;

use yii\helpers\Console;

class AppDeploy implements Deployment
{
    public function up(){
    	shell_exec("git pull origin dev");
    	shell_exec("./yii migrate --migrationPath=@console/migrations/change_request --interactive=0");
    	// Console::stdout(PHP_EOL, Console::FG_GREEN);
    	// Console::stdout("changelog : " . PHP_EOL, Console::FG_GREEN);
    	// Console::stdout("- Update Simultan tahunajaran" . PHP_EOL, Console::FG_GREEN);
    	return true;
    }

    public function down(){
    	$out = shell_exec("./yii migrate/down --migrationPath=@console/migrations/change_request --interactive=0");
    	// Console::stdout(PHP_EOL, Console::FG_GREEN);
    	// Console::stdout("changelog : " . PHP_EOL, Console::FG_GREEN);
    	// Console::stdout($this->changelog() . PHP_EOL, Console::FG_GREEN);
    	return true;
    }

    public function changelog(){
    	return "CHANGELOG : " . PHP_EOL . "- Adding Simultan tahunajaran";
    }
}