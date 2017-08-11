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
        unset($actions['index']);
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
            '`nama_pegawai`' => SORT_ASC, 
            '`nik`' => SORT_ASC
        ]);
        
        if($scenario){

        }

        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
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
        
        if(!$pegawai){
            $id = \Yii::$app->getRequest()->post('id', \Yii::$app->getRequest()->get('id', false));
            if(!$id) throw new \yii\web\ServerErrorHttpException('Id siswa must be set.');
            $model = $this->modelClass;
            $pegawai = $model::findOne($id);
        }

        if(!$pegawai) throw new \yii\web\ServerErrorHttpException('Failed to find data.');

        $fileupload = UploadedFile::getInstancesByName('photo');

        if(count($fileupload) <= 0) throw new \yii\web\ServerErrorHttpException('File name must be "photo".');
        
        if (!file_exists( $path )) {
            $a = mkdir( $path , 0777, true);
        } 
        $fileupload = $fileupload[0];
        $saveUpload = $fileupload->saveAs( $path . 'avatar_' . $pegawai->id . '.' . $fileupload->extension);

        if($saveUpload){
            $pegawai->scenario = 'avatar';
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