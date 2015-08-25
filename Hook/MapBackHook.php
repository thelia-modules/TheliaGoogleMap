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

use Thelia\Core\Event\Hook\HookRenderEvent;
use Thelia\Core\Hook\BaseHook;

/**
 * Class MapBackHook
 * @package TheliaGoogleMap\Hook
 */
class MapBackHook extends BaseHook
{
        public function onModuleConfig(HookRenderEvent $event)
        {
            $event->add($this->render("module_configuration.html"));
        }

    public function onModuleConfigInsertJS(HookRenderEvent $event)
    {
        $event->add($this->render("module-config-js.html"));
    }
}
