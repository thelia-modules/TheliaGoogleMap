# Thelia Google Map

author : Penalver Antony <apenalver@openstudio.fr>

This module allow to integrate a google map with somes options.


## 1. Installation

### Manually

* Copy the module into ```<thelia_root>/local/modules/``` directory and be sure that the name of the module is TheliaGoogleMap.
* Activate it in your thelia administration panel

Warning : You need to configure your google api keys for google maps in configuration form before to use it.<br>
To get api key follow these instructions : https://developers.google.com/maps/documentation/javascript/tutorial

### Composer

Add it in your main thelia composer.json file

```
composer require thelia/thelia-googlemap-module:~1.0
```


## 2. Usage

Use smarty function to integrate it in you template :
{google_map id="YOUR_ID"}{/google_map}

Somes options are availables:  

|Options        |Type           | Description                                                               | Default
|---            |---            |---                                                                        |---
|class          | String        | Allow to change css class                                                 | theliagooglemap
|zoom           | Integer       | Allow to change base map zoom                                             | 0
|centerlat      | Float         | Used to set the latitude for base center map ( need centerLon to be set ) | 0
|centerlon      | Float         | Used to set the longitude for base center map ( need centerLat to be set )| 0
|address        | String        | Used to set the center point for map                                      | null
|control        | Boolean       | Used to disable default control UI                                        | false
|zoom-ctrl      | Boolean       | Used to enable zoom control UI                                            | true
|pan-ctrl       | Boolean       | Used to enable pan control UI                                             | true
|scale-ctrl     | Boolean       | Used to enable scale control UI                                           | true
|map-ctrl       | Boolean       | Used to enable map type control UI                                        | true
|street-ctrl    | Boolean       | Used to enable street view control UI                                     | true
|overview-ctrl  | Boolean       | Used to enable overview control UI                                        | false
|mouse-ctrl     | Boolean       | Used to enable mouse control                                              | false
|show-marker    | Boolean       | Used to enable showing markers                                            | true
|marker-src     | URL           | Used to set an url source to show mutiples markers                        | null
|marker-src-refresh | Boolean   | Used to refresh marker on map zoom or move                         	    | false
|marker-src-refresh-ttl | Integer | Time in ms before triggering the URL to refresh markers                 | 100
|template-name  | String        | Used to set a template on map                                             | base
|pin-link       | URL           | Used to set a custom pin                                                  | null
|show-info      | Boolean       | Used to enable info window in map                                         | true
|cluster        | Boolean       | Used to enable clustering for markers                                     | false
|cluster-options-callback | String | Set a callback function to define custom configuration for clustering  | {}
|geocoder-error-callback | String | Used to set a callback function error handler for geocoder error        | console log

Deprecated options in favor of `cluster-options-callback` (since version 1.7) :

|Options        |Type           | Description                                                               | Default
|---            |---            |---                                                                        |---
|cluster-grid-width  | Integer  | Width size grid for cluster element                                       | 10
|cluster-grid-height | Integer  | Height size grid for cluster element                                      | 10
|pin-cluster-link    | URL      | Used to set a custom pin for cluster marker                               | null


## 3. Marker Source

To use marker source you need to respect a format.<br>
 
Json format :<br> 
```json
{
    title : "TITLE MARKER",
    loc : [ "LATITUDE" ,"LONGITUDE" ],
    description : "DESCRIPTION",
    info : "SOME INFORMATIONS,
    link : "URL TO BIND BUTTON",
    link-label : "LABEL FOR BUTTOM"
}
```   


## 4. Templating

### Template list

Some template are integrate by default :

| Name | Description | Key
|---    |---    |---
|Red | Demo template describe in google map documentation : https://developers.google.com/maps/documentation/javascript/examples/maptype-styled-simple | red
|Black | Template black and white for classy map | black

### Create your own template

* 1. Create a js file 
* 2. Get theliaGoogleMapTemplate variable
* 3. Insert your template like this:
```
    "red": {
        "featureOpts": [
            {
                stylers: [
                    {hue: '#890000'},
                    {visibility: 'simplified'},
                    {gamma: 0.5},
                    {weight: 0.5}
                ]
            },
            {
                elementType: 'labels',
                stylers: [
                    {visibility: 'off'}
                ]
            },
            {
                featureType: 'water',
                stylers: [
                    {color: '#890000'}
                ]
            }
        ],
        "styledMapOptions": {
            name: "Red Template"
        }
    },
```
* 4. Insert your js file in ```main.after-javascript-include``` hook


## 5. Info Window

To customise info window you have to modify following css classes :

* thelia-google-map-info-window
* thelia-google-map-info
* thelia-google-map-title
* thelia-google-map-descp
* thelia-google-map-link


## 6. Options

### 6.1 Insert Google map js

You can limitate Google Map API include to a particular Hook in module configuration.
You just have to toggle configuration key and Google Map include script change binding from "main.after-javascript-include"
to "theliagooglemap.front.insertjs".
To insert the script in one page add the hook before main include javascript.`

Hook to add :

```smarty
{hook name="theliagooglemap.front.insertjs" modulecode="TheliaGoogleMap"}
```


### 6.2 Example for geocoder-error-callback

```smarty
{google_map id="test-address" zoom=17 address="sdklgjodfh" geocoder-error-callback="callBackGeo"}
<script>
function callBackGeo(status){
  alert(status);
}
</script>
```

### 6.3 Example for cluster-options-callback

To use custom cluster options, you have to use the `cluster-options-callback` like this :

```smarty
{google_map id="test-address" zoom=14 address="sdklgjodfh" cluster="1" cluster-options-callback="clusterOptions"}
<script>
function clusterOptions(status){
  var clusterOptions = {
    gridSize: 60,
    styles: [
      {
        url: "http:///mysite.com/frontOffice/default/assets/img/cluster-1.png",
        height: 46,
        width: 36,
        anchor: [10, 0],
        textColor: '#ffffff',
        textSize: 11
      },
      {
        url: 'http://mysite.com/frontOffice/default/assets/img/cluster2.png',
        height: 46,
        width: 36,
        anchor: [0, 0],
        textColor: '#ff0000',
        textSize: 15
      }
    ]
  };

  return clusterOptions;
}
</script>
```

