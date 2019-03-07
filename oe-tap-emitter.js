/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import {html, PolymerElement} from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
/**
 * `oe-tap-emitter` is a non-visual wrapper that emits the specified event when `content` element is tapped.
 * 
 *
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * 
 */
class OeTapEmitter extends OECommonMixin(PolymerElement) {
  static get is() {
    return 'oe-tap-emitter';
  }
  static get template() {
    return html`
    <slot></slot>
    `;
  }
  static get properties() {
    return {
     /**
      * event to be fired when underlying `content` element is tapped.
      * 
      */
      event: {
        type: String,
        value: 'oe-tap-event'
      },
  
    /**
     * data to be passed as event-detail.
     * 
     */
      details: {
        type: Object,
        value: function () {
          return {};
        }
      }
    };
  }
  /**
   * Connected callback to handle templating if custom template is present.
   * 
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tap',this.fireEvent.bind(this));
  }
   /**
    * Fires the specified event.
    * 
    */
    fireEvent() {
      this.fire(this.event, this.details);
    }

}

window.customElements.define(OeTapEmitter.is, OeTapEmitter);
