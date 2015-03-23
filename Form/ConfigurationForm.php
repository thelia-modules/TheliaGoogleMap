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

namespace TheliaGoogleMap\Form;

use Thelia\Model\ConfigQuery;
use Thelia\Form\BaseForm;
use Thelia\Core\Translation\Translator;
use TheliaGoogleMap\TheliaGoogleMap;

/**
 * Class ConfigurationForm
 * @package TheliaGoogleMap\Form
 */
class ConfigurationForm extends BaseForm
{

    /**
     *
     * in this function you add all the fields you need for your Form.
     * Form this you have to call add method on $this->formBuilder attribute :
     *
     * $this->formBuilder->add("name", "text")
     *   ->add("email", "email", array(
     *           "attr" => array(
     *               "class" => "field"
     *           ),
     *           "label" => "email",
     *           "constraints" => array(
     *               new \Symfony\Component\Validator\Constraints\NotBlank()
     *           )
     *       )
     *   )
     *   ->add('age', 'integer');
     *
     * @return null
     */
    protected function buildForm()
    {
        $form = $this->formBuilder;

        $form->add(
            "apikey",
            "text",
            array(
                'data' => ConfigQuery::read(TheliaGoogleMap::CONF_API_KEY, ""),
                'label' => Translator::getInstance()->trans("Api Key"),
                'label_attr' => array(
                    'for' => "apikey"
                ),
            )
        );
    }

    /**
     * @return string the name of you form. This name must be unique
     */
    public function getName()
    {
        return "theliagooglemap_create";
    }
}