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

namespace TheliaGoogleMap\Smarty\Plugins;

use TheliaSmarty\Template\AbstractSmartyPlugin;
use TheliaSmarty\Template\SmartyPluginDescriptor;

/**
 * Class GoogleMap
 * @package TheliaGoogleMap\Smarty\Plugin
 */
class GoogleMap extends AbstractSmartyPlugin
{

    /**
     * @return an array of SmartyPluginDescriptor
     */
    public function getPluginDescriptors()
    {
        return [
            new SmartyPluginDescriptor("function", "google_map", $this, "getMap"),
        ];
    }

    /**
     * Generate div for thelia-googlemap.js plugin
     * @param $params
     * @param null $template
     * @return string
     */

    public function getMap($params, $template = null)
    {
        $class= $this->getParam($params, 'class');

        if (null == $class) {
            $class="theliagooglemap";
        }

        $id = $this->getParam($params, 'id');

        if (null == $id) {
            throw new \InvalidArgumentException(
                $this->translator->trans("Missing 'id' parameter in map arguments")
            );
        }

        $zoom = $this->getParam($params, 'zoom');

        if (null == $zoom) {
            $zoom=0;
        }



        $control =  $this->getParam($params, 'control');
        if (null == $control) {
            $control="false";
        }

        $zoomControl =  $this->getParam($params, 'zoom-ctrl');
        if (null == $zoomControl) {
            $zoomControl=true;
        }

        $panControl =  $this->getParam($params, 'pan-ctrl');
        if (null == $panControl) {
            $panControl=true;
        }

        $scaleControl =  $this->getParam($params, 'scale-ctrl');
        if (null == $scaleControl) {
            $scaleControl=true;
        }

        $marker =  $this->getParam($params, 'show-marker');
        if (null == $marker) {
            $marker=true;
        }

        $mouseControl =  $this->getParam($params, 'mouse-ctrl');
        if (null == $mouseControl) {
            $mouseControl="false";
        }

        $templateName =  $this->getParam($params, 'template-name');
        if (null == $templateName) {
            $templateName="base";
        }




        $div = '<div class="'.$class.'"'
            .' id="'.$id.'"'
            .' data-element="thelia-google-map"'
            .' data-zoom="'.$zoom.'"'
            .' data-control="'.$control.'"'
            .' data-zoomcontrol="'.$zoomControl.'"'
            .' data-pancontrol="'.$panControl.'"'
            .' data-scalecontrol="'.$scaleControl.'"'
            .' data-mousecontrol="'.$mouseControl.'"'
            .' data-template="'.$templateName.'"'
            .' data-marker="'.$marker.'"';

        $markerSrc =  $this->getParam($params, 'marker-src');
        if (null != $markerSrc) {
            $div .= ' data-src="'.$markerSrc.'"';
        }

        $centerLat =  $this->getParam($params, 'center-lat');
        $centerLon =  $this->getParam($params, 'center-lon');
        if (null != $centerLon && null != $centerLat) {
            $div .=' data-center="'.$centerLat.','.$centerLon.'"';
        }

        $pin =  $this->getParam($params, 'pin-link');
        if (null != $pin) {
            $div .= ' data-pin="'.$pin.'"';
        }

        $div .= '></div>';


        return $div;
    }
}
