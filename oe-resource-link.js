/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";


/**
 * `oe-resource-link` loads a server resource like app-theme or css.
 *  Usage is similar to a html link tag, but possible need of authentication on `UIResource` record warranted special implementation.
 * (https://developer.mozilla.org/en/docs/Web/HTML/Element/link)
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * 
 */


class OeResourceLink extends OECommonMixin(PolymerElement) {
  static get is() {
    return 'oe-resource-link';
  }

  static get properties() {
    return {
      /**
       * names a relationship of the linked document to the current document.
       * (https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)
       * 
       */
      rel: {
        type: String
      },

      /**
       * define the type of the content linked to.
       * 
       */
      type: {
        type: String
      },

      /**
       * set this attribute to trigger a theme refresh after resource is loaded.
       *  
       */
      isTheme: {
        type: Boolean
      },

      /**
       * specifies the absolute or relative URL of the linked resource
       * 
       */
      href: {
        type: String
      }
    };
  }
  /**
   * Fuction invoked in connected callback.
   *
   */
  linkFun() {
    var OEUtils = OEUtils || {};
    var linkElement = document.createElement('link');
    this.rel && linkElement.setAttribute('rel', this.rel);
    this.type && linkElement.setAttribute('type', this.type);

    if (this.href) {
      var fullUrl = (window.OEUtils && window.OEUtils.geturl) ? window.OEUtils.geturl(this.href) : this.href;

      if (sessionStorage.auth_token) {
        var bindingChar = fullUrl.indexOf('?') >= 0 ? '&' : '?';
        fullUrl = fullUrl + bindingChar + 'access_token=' + sessionStorage.auth_token;
      }
      linkElement.setAttribute('href', fullUrl);
    }


    //Simply loading app-theme wouldn't work.
    //we need to call, Polymer.updateStyles();
    //https://github.com/PolymerElements/paper-styles/issues/93#issuecomment-177136969

    if (this.isTheme) {
      linkElement.addEventListener('load', function Listener(evt) { // eslint-disable-line no-unused-vars
        //linkElement.removeEventListener('load', Listener);
        Polymer.updateStyles();
      });
    }


    //I expect <oe-resource-link> element to be used in head section 
    // similar to <link> tags.
    // So this.parentNode should mean <head>. But it seems Polymer elements 
    // are automatically moved into body section. and this.parentNode is body
    // So we end-up having <link>s in body section.

    // this doesn't seem to be a problem. However, I'd rather keep it clean and
    // insert into 'head' explicitly.

    //this.parentNode.insertBefore(linkElement, this);
    this._element = linkElement;
    document.head.appendChild(linkElement);
    this.fire('oe-resource-link-loaded');
  }
  /**
   * Connected callback to handle templating if custom template is present.
   * 
   */
  connectedCallback() {
    super.connectedCallback();
    this.linkFun();
  }
  
  /**
   * Disconnected callback to remove the event listner.
   * 
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._element && document.head.removeChild(this._element);
  }
}

window.customElements.define(OeResourceLink.is, OeResourceLink);



