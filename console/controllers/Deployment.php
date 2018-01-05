<?php

namespace console\controllers;

interface Deployment
{
    public function up();

    public function down();

    public function changelog();
}