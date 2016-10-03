<?php
namespace rest\modules\api\controllers;

use Yii;
// use yii\data\ActiveDataProvider;
use yii\web\UploadedFile;

class PegawaiController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\Pegawai';
    private $profile_path = 'profile/pegawai/';

    public function actions()
    {
        $actions = parent::actions();
        // unset($actions['index']);
        unset($actions['view']);
        return $actions;
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        return array_merge($behaviors, 
            [
                'verbFilter' => [
                    'class' => \yii\filters\VerbFilter::className(),
                    'actions' => [
                        'list'  => ['get'],
                    ],
                ],
            ]
        );
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionView($id){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $query = $request->getQueryParam('query', false);
        
        $queryM = $model->find()
                       ->where(['id' => $id])
                       // ->asArray()
                       ->One();
        
        $queryM->avatar = $queryM->avatarPath;
        return $queryM;
    }

    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();

        $query = $model->getList([
            'id' => $request->getQueryParam('id', false),
            'nik' => $request->getQueryParam('nik', false),
            'nuptk' => $request->getQueryParam('nuptk', false),
            'nama_pegawai' => $request->getQueryParam('nama_pegawai', false),
            'nama_panggilan' => $request->getQueryParam('nama_panggilan', false),
            'sekolahid' => $request->getQueryParam('sekolahid', ''),
            'query' => $request->getQueryParam('query', false)
        ]);

        return $this->prepareDataProvider($query);
    }

    public function actionAvatar(){
        $path = Yii::getAlias('@webroot') . \Yii::$app->params['profile_pegawai_path'];
        $pegawai = Yii::$app->user->identity->pegawai;
        $pegawai->scenario = 'avatar';

        $fileupload = UploadedFile::getInstancesByName('photo');
        if (!file_exists( $path )) {
            $a = mkdir( $path , 0777, true);
        } 
        $fileupload = $fileupload[0];
        $saveUpload = $fileupload->saveAs( $path . 'avatar_' . $pegawai->id . '.' . $fileupload->extension);

        if($saveUpload){
            $pegawai->avatar = 'avatar_' . $pegawai->id . '.' . $fileupload->extension;
            if(!$pegawai->save()){
                return $pegawai->errors;
            }
            return [
                'avatar' => $pegawai->avatarPath,
                'filename' => $pegawai->avatar
            ]; //$fileupload;
        }else{
            return $fileupload->error;
        }
    }

}