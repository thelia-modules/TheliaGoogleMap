<?php
/*************************************************************************************/
/*      This file is part of the Thelia package.                                     */
/*                                                                                   */
/*      Copyright (c) OpenStudio                                                     */
/*      email : dev@thelia.net                                                       */
/*      web : http://www.thelia.net                                                  */
/*                                                                                   */
/*      For the full copyright and license information, please view the LICENSE.txt  */
/*      file that was distributed with this source code.                             */
/*************************************************************************************/
/*************************************************************************************/
namespace TheliaGoogleMap\Controller;

use Symfony\Component\HttpFoundation\Request;
use Thelia\Core\Translation\Translator;
use Thelia\Model\ModuleConfigQuery;
use TheliaGoogleMap\TheliaGoogleMap;
use Thelia\Controller\Admin\BaseAdminController;
use Thelia\Core\Security\AccessManager;
use Thelia\Core\Security\Resource\AdminResources;
use Thelia\Model\ConfigQuery;
use Symfony\Component\HttpFoundation\JsonResponse;
use TheliaGoogleMap\Form\ConfigurationForm;

/**
 * Class Configuration
 */
class ConfigurationController extends BaseAdminController
{

    /**
     * Methode used to save API Key for google map in Config
     * @return mixed|null|\Symfony\Component\HttpFoundation\Response|static
     */
    public function saveAction(Request $request)
    {
        if (null !== $response = $this->checkAuth(array(AdminResources::MODULE), array('theliagooglemap'),
                AccessManager::UPDATE)
        ) {
            return $response;
        }

        $form = $this->createForm(ConfigurationForm::getName());
        $resp = array(
            "message" => ""
        );
        $code = 200;

        try {
            $vform = $this->validateForm($form);
            $data = $vform->getData();

            TheliaGoogleMap::setConfigValue(TheliaGoogleMap::CONF_API_KEY, $data["apikey"]);
            $resp["message"] = Translator::getInstance()->trans("API Key saved", [], TheliaGoogleMap::MESSAGE_DOMAIN);
        } catch (\Exception $e) {
            $resp["message"] = $e->getMessage();
            $code = 500;
        }

        return new JsonResponse($resp, $code);
    }

    /**
     * Toggle configuration variable to insert script in Hook
     */
    public function toggleHookShowAction()
    {
        if (null !== $response = $this->checkAuth(array(AdminResources::MODULE), array('theliagooglemap'),
                AccessManager::UPDATE)
        ) {
            return $response;
        }

        $resp = array(
            "message" => ""
        );
        $code = 200;
        try {
            TheliaGoogleMap::setConfigValue("thelia-google-map-hook-all-page", !TheliaGoogleMap::getConfigValue("thelia-google-map-hook-all-page"));
            ConfigQuery::write("thelia-google-map-hook-all-page", !ConfigQuery::read("thelia-google-map-hook-all-page"));
            $resp["message"] = Translator::getInstance()->trans("Config toggle succes", [], TheliaGoogleMap::MESSAGE_DOMAIN);
        } catch (\Exception $e) {
            $resp["message"] = $e->getMessage();
            $code = 500;
        }

        return new JsonResponse($resp, $code);
    }
}
