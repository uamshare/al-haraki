<?php

use yii\db\Migration;

class m170819_024737_update_tahun_ajaran extends Migration
{
    public function safeUp()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (in_array('tahun_ajaran', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("set foreign_key_checks = 0;
                                    truncate table tahun_ajaran;
                                    alter table tahun_ajaran
                                        add primary key(id);
                                    insert into tahun_ajaran values
                                        (201617, '2016 / 2017',2016, 2017,'0'),
                                        (201718, '2017 / 2018',2017, 2018,'1'),
                                        (201819, '2018 / 2019',2018, 2019,'0'),
                                        (201920, '2019 / 2020',2019, 2020,'0'),
                                        (202021, '2020 / 2021',2020, 2021,'0'),
                                        (202122, '2021 / 2022',2021, 2022,'0'),
                                        (202223, '2022 / 2023',2022, 2023,'0');
                                    set foreign_key_checks = 1;");
            }
        }
    }

    public function safeDown()
    {
        echo "no change to rollback";

    }
}
