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

        $streetControl =  $this->getParam($params, 'street-ctrl');
        if (null == $streetControl) {
            $streetControl=true;
        }

        $mapControl =  $this->getParam($params, 'map-ctrl');
        if (null == $mapControl) {
            $mapControl=true;
        }

        $overviewControl =  $this->getParam($params, 'overview-ctrl');
        if (null == $overviewControl) {
            $overviewControl=false;
        }

        $marker =  $this->getParam($params, 'show-marker');
        if (null == $marker) {
            $marker=true;
        }

        $mouseControl =  $this->getParam($params, 'mouse-ctrl');
        if (null == $mouseControl) {
            $mouseControl=false;
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
            .' data-streetviewcontrol="'.$streetControl.'"'
            .' data-maptypecontrol="'.$mapControl.'"'
            .' data-overviewmapcontrol="'.$overviewControl.'"'
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

        $pinCluster =  $this->getParam($params, 'pin-cluster-link');
        if (null != $pinCluster) {
            $div .= ' data-cluster-pin="'.$pinCluster.'"';
        }

        $showInfo =  $this->getParam($params, 'show-info');
        if (null != $showInfo) {
            $div .= ' data-show-info="'.$showInfo.'"';
        }

        $cluster = $this->getParam($params, 'cluster');
        if (null != $cluster) {
            $div .= ' data-cluster="'.$cluster.'"';
        }

        $clusterWidth = $this->getParam($params, 'cluster-grid-width');
        if (null != $clusterWidth) {
            $div .= ' data-cluster-grid-width="'.$clusterWidth.'"';
        }

        $clusterHeight = $this->getParam($params, 'cluster-grid-height');
        if (null != $clusterHeight) {
            $div .= ' data-cluster-grid-height="'.$clusterHeight.'"';
        }

        $address = $this->getParam($params, 'address');
        if (null != $address) {
            $div .= ' data-address="'.$address.'"';
        }

        $div .= '></div>';


        return $div;
    }
}
