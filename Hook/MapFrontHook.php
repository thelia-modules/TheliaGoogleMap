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

namespace TheliaGoogleMap\Hook;

use TheliaGoogleMap\TheliaGoogleMap;
use Thelia\Core\Event\Hook\HookRenderEvent;
use Thelia\Core\Hook\BaseHook;
use Thelia\Log\Tlog;
use Thelia\Model\ConfigQuery;

/**
 * Class MapFrontHook
 * @package DealerGoogleMap\Hook
 */
class MapFrontHook extends BaseHook
{

    /**
     * @param HookRenderEvent $event
     */
    public function onMainStyleSheet(HookRenderEvent $event)
    {
        $event->add($this->addCSS("/assets/css/thelia-google-map.css"));
    }


    /**
     * @param HookRenderEvent $event
     */
    public function onMainAfterJVSIncludes(HookRenderEvent $event)
    {
        if (TheliaGoogleMap::getConfigValue("thelia-google-map-hook-all-page")) {
            $event->add($this->render("googleJS.html"));
            $event->add($this->addJS("/assets/js/thelia-googlemap-template.js"));
            $event->add($this->addJS("/assets/js/thelia-googlemap.js"));
        }
    }

    /**
     * @param HookRenderEvent $event
     */
    public function onTheliaGoogleMapinsertJS(HookRenderEvent $event)
    {
        if (!TheliaGoogleMap::getConfigValue("thelia-google-map-hook-all-page")) {
            $event->add($this->render("googleJS.html"));
            $event->add($this->addJS("/assets/js/thelia-googlemap-template.js"));
            $event->add($this->addJS("/assets/js/thelia-googlemap.js"));

        }
    }
}
