<?php

use yii\db\Migration;

/**
 * Handles the creation for table `opt_months`.
 */
class m161129_153906_create_opt_months_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (!in_array('opt_months', $tables))  { 
            if ($dbType == "mysql") {
                $this->createTable('opt_months', [
                    'month' => $this->integer(),
                    'order' => $this->integer(),
                ]);

                // Insert Default Data
                $this->execute('SET foreign_key_checks = 0');
                $this->insert('{{opt_months}}',['month'=>7,'order'=>1]);
                $this->insert('{{opt_months}}',['month'=>8,'order'=>2]);
                $this->insert('{{opt_months}}',['month'=>9,'order'=>3]);
                $this->insert('{{opt_months}}',['month'=>10,'order'=>4]);
                $this->insert('{{opt_months}}',['month'=>11,'order'=>5]);
                $this->insert('{{opt_months}}',['month'=>12,'order'=>6]);
                $this->insert('{{opt_months}}',['month'=>1,'order'=>7]);
                $this->insert('{{opt_months}}',['month'=>2,'order'=>8]);
                $this->insert('{{opt_months}}',['month'=>3,'order'=>9]);
                $this->insert('{{opt_months}}',['month'=>4,'order'=>10]);
                $this->insert('{{opt_months}}',['month'=>5,'order'=>11]);
                $this->insert('{{opt_months}}',['month'=>6,'order'=>12]);
                $this->execute('SET foreign_key_checks = 1;');
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (in_array('opt_months', $tables))  { 
            if ($dbType == "mysql") {
                $this->dropTable('opt_months');
            }
        }
    }
}
