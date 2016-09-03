<?php
namespace rest\modules\api\controllers;

use Yii;
// use yii\data\ActiveDataProvider;
use yii\web\UploadedFile;

class PegawaiController extends \rest\modules\api\ActiveController //\yii\rest\ActiveController //
{
    public $modelClass = 'rest\models\Pegawai';
    private $profile_path = 'profile/pegawai/';
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

    public function actionList(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        return $this->prepareDataProvider($model->getList([
            'id' => $request->getQueryParam('id', false),
            'nik' => $request->getQueryParam('nik', false),
            'nuptk' => $request->getQueryParam('nuptk', false),
            'nama_pegawai' => $request->getQueryParam('nama_pegawai', false),
            'nama_panggilan' => $request->getQueryParam('nama_panggilan', false),
            'sekolahid' => $request->getQueryParam('sekolahid', ''),
            'query' => $request->getQueryParam('query', false)
        ]));
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

    /**
     * Prepares the data provider that should return the requested collection of the models.
     * @return ActiveDataProvider
     */
    // protected function prepareDataProvider($query)
    // {
    //     $request = Yii::$app->getRequest();
    //     $perpage = $request->getQueryParam('per-page', 20);
    //     $pagination = [
    //         'pageSize' => $perpage
    //     ];

    //     return new ActiveDataProvider([
    //         'query' => $query,
    //         'pagination' => ($perpage > 0) ? $pagination : false
    //     ]);
    // }
}