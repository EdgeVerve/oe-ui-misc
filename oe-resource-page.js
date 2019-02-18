/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OEAjaxMixin } from "oe-mixins/oe-ajax-mixin.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import "oe-ajax/oe-ajax.js";
window.OEUtils = window.OEUtils || {};
var OEUtils = window.OEUtils;

/**
 * `oe-resource-page` loads a server resource and displays as a child. It is useful for displaying page-partials specially when stored as `UIResource` model. 
 * 
 *
 * @customElement
 * @polymer
 * @appliesMixin OEAjaxMixin
 * @appliesMixin OECommonMixin
 * 
 */
class OeResourcePage extends OECommonMixin(OEAjaxMixin(PolymerElement)) {
  static get is() {
    return 'oe-resource-page';
  }
 
  static get properties() {
    return {
      /**
       * specifies the absolute or relative URL of the resource to be loaded.
       * 
       */
        resourceUrl: {
          type: String
        },
    };
  }
   /**
    * Connected callback to handle templating if custom template is present.
    * 
    */
  connectedCallback() {
    super.connectedCallback();
    var self = this; 
    
    if (self.resourceUrl) {
      
      var fullUrl = OEUtils.geturl(self.resourceUrl);
      
      //oe-ajax would take care of adding access-token
      //var bindingChar = fullUrl.indexOf('?') >= 0 ? '&' : '?';
      //fullUrl = fullUrl + bindingChar + "access_token=" + sessionStorage.auth_token;

      // var ajax = document.createElement('oe-ajax');
      // ajax.contentType = 'text/html';
      // ajax.handleAs = 'text';
      // ajax.url = fullUrl;
      // ajax.method = 'get';
      self.makeAjaxCall(fullUrl, 'get', null, null, null,{ handleAs :'text' },
      function (err, response) {
        if(err){
          self.fire("Error getting the data");
        }
        else{
        self.innerHTML = (response);
        self.fire('oe-resource-page-loaded'); 
      }
      });
    }
  }
}

window.customElements.define(OeResourcePage.is, OeResourcePage);

