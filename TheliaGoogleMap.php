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

namespace TheliaGoogleMap;

use Propel\Runtime\Connection\ConnectionInterface;
use Symfony\Component\DependencyInjection\Loader\Configurator\ServicesConfigurator;
use Thelia\Core\Template\TemplateDefinition;
use Thelia\Model\ConfigQuery;
use Thelia\Module\BaseModule;

class TheliaGoogleMap extends BaseModule
{
    const MESSAGE_DOMAIN = "theliagooglemap";
    const ROUTER = "router.theliagooglemap";
    const CONF_API_KEY = "theliagooglemap_api_key";

    /**
     * This method is called just after the module was successfully activated.
     *
     * @param ConnectionInterface $con
     */
    public function postActivation(ConnectionInterface $con = null): void
    {
        if (ConfigQuery::read("thelia-google-map-hook-all-page")) {
            TheliaGoogleMap::setConfigValue("thelia-google-map-hook-all-page", ConfigQuery::read("thelia-google-map-hook-all-page"));
        } elseif (!TheliaGoogleMap::getConfigValue("thelia-google-map-hook-all-page")) {
            TheliaGoogleMap::setConfigValue("thelia-google-map-hook-all-page", false);
        }
        if (ConfigQuery::read(TheliaGoogleMap::CONF_API_KEY)) {
            TheliaGoogleMap::setConfigValue(TheliaGoogleMap::CONF_API_KEY, ConfigQuery::read(TheliaGoogleMap::CONF_API_KEY));
        }
    }

    /**
     * Defines how services are loaded in your modules.
     */
    public static function configureServices(ServicesConfigurator $servicesConfigurator): void
    {
        $servicesConfigurator->load(self::getModuleCode().'\\', __DIR__)
            ->exclude([THELIA_MODULE_DIR.ucfirst(self::getModuleCode()).'/I18n/*'])
            ->autowire(true)
            ->autoconfigure(true);
    }

    public function getHooks()
    {
        return [
            [
                'type' => TemplateDefinition::FRONT_OFFICE,
                'code' => 'theliagooglemap.front.insertjs',
                'title' => 'Hook to insert google api js',
                'active' => true,
                'block' => false,
                'module' => true
            ],
        ];
    }
}
