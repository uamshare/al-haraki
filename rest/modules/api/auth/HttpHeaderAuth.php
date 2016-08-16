<?php
namespace rest\modules\api\auth;

/**
 * QueryParamAuth is an action filter that supports the authentication based on the access token passed through a query parameter.
 *
 */
class HttpHeaderAuth extends \yii\filters\auth\AuthMethod
{
    /**
     * @var string the parameter name for passing the access token
     */
    public $tokenParam = 'access-token';


    /**
     * @inheritdoc
     */
    public function authenticate($user, $request, $response)
    {
        $headers = $request->getHeaders();
        $accessToken = $headers[$this->tokenParam];
        if (is_string($accessToken)) {
            $identity = $user->loginByAccessToken($accessToken, get_class($this));
            if ($identity !== null) {
                return $identity;
            }
        }
        if ($accessToken !== null) {
            $this->handleFailure($response);
        }

        return null;
    }
}
