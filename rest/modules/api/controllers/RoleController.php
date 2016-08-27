<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class RoleController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\RoleModel';
    public $Auth;

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);
        return $actions;
    }
    
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbs' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'index'    => ['get'],
                        'listpermissions'     => ['get'],
                        'listmenuprivileges'     => ['get'],
                        'list'     => ['get'],
                        'create'   => ['post','put'],
                        // 'remove'   => ['delete']
                    ],
                ],
            ]
        );
    }

    public function init(){
    	parent::init();
    }

    // public function actionAssign(){
    //     return ['success' => true];
    // }

    

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionList(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', '');

        return $Auth->getRoles($rolename);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionListpermissions(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $rolename = $request->getQueryParam('rolename', false);

        if($rolename){
            $permission =  $Auth->getPermissionsByRole($rolename);
        }else{
            $permission =  $Auth->getPermissions();
        }
        $list = [];
        foreach ($this->_listPermissions() as $key => $value) {
            $list[$key] = $value;
            $list[$key]['read'] = isset($permission[$value['name'] . '_view']) ? true : false;
            $list[$key]['create'] = isset($permission[$value['name'] . '_create']) ? true : false;
            $list[$key]['update'] = isset($permission[$value['name'] . '_update']) ? true : false;
            $list[$key]['delete'] = isset($permission[$value['name'] . '_delete']) ? true : false;

        }
        return $list;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionMenuprivileges(){
        $Auth = new $this->modelClass;
        $request = Yii::$app->getRequest();
        $userid = Yii::$app->user->getId();
        $list = [
            'master',

            'keuangan',

            'akuntasi',

            'pengaturan'
        ];

        if($userid){
            $permission =  $Auth->getPermissionsByUser($userid);
            foreach ($permission as $key => $value) {
                $list[$key] = $value;
                // $list[$key]['read'] = isset($permission[$value['name'] . '_view']) ? true : false;
                // $list[$key]['create'] = isset($permission[$value['name'] . '_create']) ? true : false;
                // $list[$key]['update'] = isset($permission[$value['name'] . '_update']) ? true : false;
                // $list[$key]['delete'] = isset($permission[$value['name'] . '_delete']) ? true : false;
                if(preg_match('/_index/', $key)){

                }
                $list[] = $key;

            }
        }

        return $list;
    }

    

    public function actionInit(){
        // $Auth = new $this->modelClass;
        $permissions = $this->_listPermissions();

        foreach($permissions as $pms){
            $this->validAdd($pms['name'] . '_index', $pms['description'] );
            $this->validAdd($pms['name'] . '_view', $pms['description'] . ' View');
            $this->validAdd($pms['name'] . '_create', $pms['description'] . ' Create');
            $this->validAdd($pms['name'] . '_update', $pms['description'] . ' Update');
            $this->validAdd($pms['name'] . '_delete', $pms['description'] . ' Delete');
        }
    }

    private function _listPermissions(){
        /**
        $setPermissions = [
            // 0 => ['name' => 'master_data', 'desc' => 'MASTER DATA', 'order' => 1],
            4 => ['name' => 'siswa', 'desc' => 'Data Siswa', 'leaf' => true, 'parent' => 0, 'order' => 1],
            5 => ['name' => 'pegawai', 'desc' => 'Data Karyawan', 'leaf' => true, 'parent' => 0, 'order' => 2],
            6 => ['name' => 'kelas', 'desc' => 'Data Kelas', 'leaf' => true, 'parent' => 0, 'order' => 3],
            // ['name' => 'master_data_rombel', 'desc' => 'Data Rombel', 'leaf' => true, 'parent' => 0, 'order' => 4],

            // 1 => ['name' => 'keuangan', 'desc' => 'KEUANGAN', 'order' => 2],
            7 => ['name' => 'Tagihaninfoinput', 'desc' => 'Info Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 1],
            8 => ['name' => 'kwitansipembayaran', 'desc' => 'Kwitansi Pembayaran', 'leaf' => true, 'parent' => 1, 'order' => 2],
            9 => ['name' => 'tagihanpembayaran', 'desc' => 'Rekap Pembayaran Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 3],
            10 => ['name' => 'tagihanpembayaran', 'desc' => 'Rekap Outstanding Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 4],
            11 => ['name' => 'kwitansipengeluaran', 'desc' => 'Kwitansi Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 3],
            12 => ['name' => 'kwitansipengeluaran', 'desc' => 'Rekap Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 4],
            12 => ['name' => 'tagihanautodebet', 'desc' => 'Reonsiliasi Autodebet', 'leaf' => true, 'parent' => 1, 'order' => 3],

            // 2 => ['name' => 'akuntansi', 'desc' => 'AKUNTASNI', 'order' => 3],
            13 => ['name' => 'mcoad', 'desc' => 'Master Akun', 'leaf' => true, 'parent' => 1, 'order' => 1],
            14 => ['name' => 'postingmap', 'desc' => 'Pemetaan Posting', 'leaf' => true, 'parent' => 1, 'order' => 2],
            15 => ['name' => 'jurnalharian', 'desc' => 'Jurnal Harian', 'leaf' => true, 'parent' => 1, 'order' => 3],
            16 => ['name' => 'rgl', 'desc' => 'Buku Besar', 'leaf' => true, 'parent' => 1, 'order' => 4],

            // 3 => ['name' => 'pengaturan', 'desc' => 'PENGATURAN', 'order' => 4],
            17 => ['name' => 'user', 'desc' => 'Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 1],
            18 => ['name' => 'usergroup', 'desc' => 'Grup Akses Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 2],
            19 => ['name' => 'setting', 'desc' => 'Sekolah', 'leaf' => true, 'parent' => 1, 'order' => 3],
        ];
        **/

        $setPermissions = [
            ['parent_name' => 'MASTER DATA','name' => 'siswa', 'description' => 'Data Siswa', 'leaf' => true, 'parent' => 0, 'order' => 1],
            ['parent_name' => 'MASTER DATA','name' => 'pegawai', 'description' => 'Data Karyawan', 'leaf' => true, 'parent' => 0, 'order' => 2],
            ['parent_name' => 'MASTER DATA','name' => 'kelas', 'description' => 'Data Kelas', 'leaf' => true, 'parent' => 0, 'order' => 3],

            ['parent_name' => 'KEUANGAN','name' => 'tagihaninfoinput', 'description' => 'Info Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 1],
            ['parent_name' => 'KEUANGAN','name' => 'kwitansipembayaran', 'description' => 'Kwitansi Pembayaran', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'KEUANGAN','name' => 'tagihanpembayaran', 'description' => 'Rekap Pembayaran Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 3],
            ['parent_name' => 'KEUANGAN','name' => 'tagihanpembayaran', 'description' => 'Rekap Outstanding Tagihan', 'leaf' => true, 'parent' => 1, 'order' => 4],
            ['parent_name' => 'KEUANGAN','name' => 'kwitansipengeluaran', 'description' => 'Kwitansi Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 3],
            ['parent_name' => 'KEUANGAN','name' => 'kwitansipengeluaran', 'description' => 'Rekap Pengeluaran', 'leaf' => true, 'parent' => 1, 'order' => 4],
            ['parent_name' => 'KEUANGAN','name' => 'tagihanautodebet', 'description' => 'Reonsiliasi Autodebet', 'leaf' => true, 'parent' => 1, 'order' => 3],

            ['parent_name' => 'AKUNTANSI','name' => 'mcoad', 'description' => 'Master Akun', 'leaf' => true, 'parent' => 1, 'order' => 1],
            ['parent_name' => 'AKUNTANSI','name' => 'postingmap', 'description' => 'Pemetaan Posting', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'AKUNTANSI','name' => 'jurnalharian', 'description' => 'Jurnal Harian', 'leaf' => true, 'parent' => 1, 'order' => 3],
            ['parent_name' => 'AKUNTANSI','name' => 'rgl', 'description' => 'Buku Besar', 'leaf' => true, 'parent' => 1, 'order' => 4],

            ['parent_name' => 'PENGATURAN','name' => 'user', 'description' => 'Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 1],
            ['parent_name' => 'PENGATURAN','name' => 'role', 'description' => 'Grup Akses Pengguna', 'leaf' => true, 'parent' => 1, 'order' => 2],
            ['parent_name' => 'PENGATURAN','name' => 'setting', 'description' => 'Sekolah', 'leaf' => true, 'parent' => 1, 'order' => 3],
        ];

        return  $setPermissions;
    }

    private function validAddChild($role, $name, $desc){
        $Auth = new $this->modelClass;

        $p = $Auth->getPermission($name);
        if(!$p){
            $p = $Auth->createPermission($name);
            $p->description = $desc;
            $Auth->add($permission);
        }
        if(!$Auth->hasChild($role, $p)){
            $Auth->addChild($role, $p);
        }

        return $p;
    }

    private function validRemoveChild($role, $name){
        $Auth = new $this->modelClass;
        $p = $Auth->getPermission($name);
        if($p){
           if($Auth->hasChild($role, $p)){
                $Auth->removeChild($role, $p);
            }
        }
        return $p;
    }

    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            extract($post);
            $Auth = new $this->modelClass;

            // Add / Update Role
            $role = $Auth->getRole($form['name']);
            if(!$role){
                $role = $Auth->createRole('admin');
                $role->description = $form['description'];
                $Auth->add($role);
                $Auth->assign($role, $user->getId());
            }else{
                $role->description = $form['description'];
                $Auth->update($form['name'], $role);
            }

            // Add Permission to role
            foreach($grid as $rows){
                if(isset($rows['read']) && $rows['read']){
                    $this->validAddChild($role, $rows['name'] . '_index', $rows['description'] . ' Index');
                    $this->validAddChild($role, $rows['name'] . '_view', $rows['description'] . ' View');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_index');
                    $this->validRemoveChild($role, $rows['name'] . '_view');
                }

                if(isset($rows['create']) && $rows['create']){
                    $this->validAddChild($role, $rows['name'] . '_create', $rows['description'] . ' Create');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_create');
                }

                if(isset($rows['update']) && $rows['update']){
                    $this->validAddChild($role, $rows['name'] . '_update', $rows['description'] . ' Update');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_update');
                }
                
                if(isset($rows['delete']) && $rows['delete']){
                    $this->validAddChild($role, $rows['name'] . '_delete', $rows['description'] . ' Delete');
                }else{
                    $this->validRemoveChild($role, $rows['name'] . '_delete');
                }
            }
        }
        

        return ['success' => true];
    }

    private function validAdd($name, $desc){
        $Auth = new $this->modelClass;
        $p = $Auth->getPermission($name);
        if(!$p){
            $p = $Auth->createPermission($name);
            $p->description =$desc;
            $Auth->add($p);
        }else{
            $p->description =$desc;
            $Auth->update($name, $p);
        }
        return $p;
    }
}