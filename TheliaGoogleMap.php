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
    public function postActivation(ConnectionInterface $con = null)
    {
        if (!ConfigQuery::read("thelia-google-map-hook-all-page")) {
            ConfigQuery::write("thelia-google-map-hook-all-page", false);
        }
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
