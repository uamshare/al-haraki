<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace rest\modules\api\actions;

use Yii;
use yii\web\ServerErrorHttpException;

/**
 * DeleteAction implements the API endpoint for deleting a model.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class DeleteAction extends \yii\rest\Action
{
    /**
     * Deletes a model.
     * @param mixed $id id of the model to be deleted.
     * @throws ServerErrorHttpException on failure.
     */
    public function run($id)
    {
        $model = $this->findModel($id);

        if ($this->checkAccess) {
            call_user_func($this->checkAccess, $this->id, $model);
        }

        try{
            $model->delete();
            Yii::$app->getResponse()->setStatusCode(200);
            return ['message' => 'data is deleted'];
        } catch(\Exception $e) {
            if($e->errorInfo){
                switch($e->errorInfo[1]){
                    case 1451 :
                        \Yii::$app->getResponse()->setStatusCode(500);
                        return ['message' => 'Sudah ada transaksi yang terhubung dengan data ini, silahkan hubungi administrator', 'errorInfo' => $e->errorInfo];
                        break;
                    default :
                        throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
                        break;
                }
                return $e->errorInfo;
            }else{
                throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
            }
        }
    }
}
