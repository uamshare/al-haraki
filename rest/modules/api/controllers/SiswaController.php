<?php
namespace rest\modules\api\controllers;

use Yii;
use yii\web\UploadedFile;

class SiswaController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\Siswa';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        // unset($actions['update']);
        // unset($actions['delete']);
        unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', false);
        $scenario = $request->getQueryParam('scenario', false);

        $query = $model->find()
                       ->where('1=1')
                       ->asArray();
        if($sekolahid){
            $query->andWhere(['sekolahid' => $sekolahid]);
        }

        $query->orderBy([
            '`sekolahid`' => SORT_ASC,
            '`nama_siswa`' => SORT_ASC, 
            '`nis`' => SORT_ASC
        ]);
        
        if($scenario){

        }

        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
    }

    /**
     * Displays a model.
     * @param string $id the primary key of the model.
     * @return \yii\db\ActiveRecordInterface the model being displayed
     */
    public function actionView($id)
    {
        $model = $this->modelClass;
        $model = $model::findOne($id);

        if(!$model) throw new \yii\web\NotFoundHttpException('Data not found.');
        $scenario = \Yii::$app->request->getQueryParam('scenario', false);
        if($scenario){

        }
        $model->avatar = $model->avatarPath;
        return $model;
    }

    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        $scenario = \Yii::$app->getRequest()->getQueryParam('scenario', false);
        if(!$scenario){
        	$scenario = isset($post['scenario']) ? $post['scenario'] : false;
        }

        if($scenario && $scenario == '1'){
        	return $this->createBatch($post);
        }else{
        	return $this->create($post);
        }
    }

    /**
     * Creates a new model.
     * @return \yii\db\ActiveRecordInterface the model newly created
     * @throws ServerErrorHttpException if there is any error when creating the model
     */
    private function create($post)
    {
        $model = new $this->modelClass();

        $model->load($post, '');

        if ($model->save()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return $model;
    }

    private function createBatch($post)
    {
    	$this->response = Yii::$app->getResponse();
        $attrvalue = [];
        $date = date('Y-m-d H:i:s');
        extract($post);
    	foreach($grid as $k => $rows){
            $attrvalue[$k] = [
            	// 'id'					=> (isset($rows['id']) && !empty($rows['id'])) ? $rows['id'] : null,
            	'nis'					=> (isset($rows['nis']) && !empty($rows['nis'])) ? $rows['nis'] : null,
            	'nisn'					=> (isset($rows['nisn']) && !empty($rows['nisn'])) ? $rows['nisn'] : null,
				'nama_siswa'            => isset($rows['nama_siswa']) ? $rows['nama_siswa'] : null,
				'nama_panggilan'        => isset($rows['nama_panggilan']) ? $rows['nama_panggilan'] : null,
				'jk'                    => isset($rows['jk']) ? $rows['jk'] : null,
				'asal_sekolah'          => isset($rows['asal_sekolah']) ? $rows['asal_sekolah'] : null,
				'tempat_lahir'          => isset($rows['tempat_lahir']) ? $rows['tempat_lahir'] : null,
				'tanggal_lahir'         => isset($rows['tanggal_lahir']) ? $rows['tanggal_lahir'] : null,
				'anak_ke'               => isset($rows['anak_ke']) ? $rows['anak_ke'] : null,
				'jml_saudara'           => isset($rows['jml_saudara']) ? $rows['jml_saudara'] : null,
				'berat'                 => isset($rows['berat']) ? $rows['berat'] : null,
				'tinggi'                => isset($rows['tinggi']) ? $rows['tinggi'] : null,
				'gol_darah'             => isset($rows['gol_darah']) ? $rows['gol_darah'] : null,
				'riwayat_kesehatan'     => isset($rows['riwayat_kesehatan']) ? $rows['riwayat_kesehatan'] : null,
				'alamat'                => isset($rows['alamat']) ? $rows['alamat'] : null,
				'kelurahan'             => isset($rows['kelurahan']) ? $rows['kelurahan'] : null,
				'kecamatan'             => isset($rows['kecamatan']) ? $rows['kecamatan'] : null,
				'kota'                  => isset($rows['kota']) ? $rows['kota'] : null,
				'kodepos'               => isset($rows['kodepos']) ? $rows['kodepos'] : null,
				'tlp_rumah'             => isset($rows['tlp_rumah']) ? $rows['tlp_rumah'] : null,
				'nama_ayah'             => isset($rows['nama_ayah']) ? $rows['nama_ayah'] : null,
				'hp_ayah'               => isset($rows['hp_ayah']) ? $rows['hp_ayah'] : null,
				'pekerjaan_ayah'        => isset($rows['pekerjaan_ayah']) ? $rows['pekerjaan_ayah'] : null,
				'tempat_kerja_ayah'     => isset($rows['tempat_kerja_ayah']) ? $rows['tempat_kerja_ayah'] : null,
				'jabatan_ayah'          => isset($rows['jabatan_ayah']) ? $rows['jabatan_ayah'] : null,
				'pendidikan_ayah'       => isset($rows['pendidikan_ayah']) ? $rows['pendidikan_ayah'] : null,
				'email_ayah'            => isset($rows['email_ayah']) ? $rows['email_ayah'] : null,
				'nama_ibu'              => isset($rows['nama_ibu']) ? $rows['nama_ibu'] : null,
				'hp_ibu'                => isset($rows['hp_ibu']) ? $rows['hp_ibu'] : null,
				'pekerjaan_ibu'         => isset($rows['pekerjaan_ibu']) ? $rows['pekerjaan_ibu'] : null,
				'tempat_kerja_ibu'      => isset($rows['tempat_kerja_ibu']) ? $rows['tempat_kerja_ibu'] : null,
				'jabatan_ibu'           => isset($rows['jabatan_ibu']) ? $rows['jabatan_ibu'] : null,
				'pendidikan_ibu'        => isset($rows['pendidikan_ibu']) ? $rows['pendidikan_ibu'] : null,
				'email_ibu'             => isset($rows['email_ibu']) ? $rows['email_ibu'] : null,
				'jenis_tempat_tinggal'  => isset($rows['jenis_tempat_tinggal']) ? $rows['jenis_tempat_tinggal'] : null,
				'jarak_ke_sekolah'      => isset($rows['jarak_ke_sekolah']) ? $rows['jarak_ke_sekolah'] : null,
				'sarana_transportasi'   => isset($rows['sarana_transportasi']) ? $rows['sarana_transportasi'] : null,
				'keterangan'			=> isset($rows['keterangan']) ? $rows['keterangan'] : null,
				'sekolahid'				=> isset($sekolahid) ? $sekolahid : null,
                'created_at'            => isset($rows['created_at']) ? $rows['created_at'] : $date,   
                'updated_at'            => $date
            ];
        }

        $model = new $this->modelClass;
        $result = $model->saveBatch([
            'rowDetail' => $attrvalue,
            'created_at' => $date,
            'sekolahid' => $sekolahid
        ]);
        
        if($result !== true){
            $this->response->setStatusCode(422, 'Data Validation Failed.');
        }else{
            $this->response->setStatusCode(201, 'Created.');
        }
        return $result;
    }

    public function actionAvatar(){
        $model = $this->modelClass;
        $path = Yii::getAlias('@webroot') . \Yii::$app->params['profile_siswa_path'];
        $id = \Yii::$app->getRequest()->post('id', \Yii::$app->getRequest()->get('id', false));
        $siswa = $model::findOne($id);

        if(!$id) throw new \yii\web\ServerErrorHttpException('Id siswa must be set.');
        if(!$siswa) throw new \yii\web\ServerErrorHttpException('Failed to find siswa.');

        $fileupload = UploadedFile::getInstancesByName('photo');

        if(count($fileupload) <= 0) throw new \yii\web\ServerErrorHttpException('File name must be "photo".');

        if (!file_exists( $path )) {
            $a = mkdir( $path , 0777, true);
        } 
        $fileupload = $fileupload[0];
        $saveUpload = $fileupload->saveAs( $path . 'avatar_' . $siswa->id . '.' . $fileupload->extension);

        if($saveUpload){
            $siswa->scenario = 'avatar';
            $siswa->avatar = 'avatar_' . $siswa->id . '.' . $fileupload->extension;
            if(!$siswa->save()){
                return $siswa->errors;
            }
            return [
                'avatar' => $siswa->avatarPath,
                'filename' => $siswa->avatar
            ]; //$fileupload;
        }else{
            return $fileupload->error;
        }
    }
}