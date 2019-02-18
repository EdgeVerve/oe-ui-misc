/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * `oe-vbox` displays content stacked vertically. The child elements occupy 100% width.
 * 
 * ```
 * <oe-vbox>
 *      <paper-input label="First Name"></paper-input>
 *      <paper-input label="Last Name"></paper-input>
 *      <paper-input label="City"></paper-input>
 *      <paper-input label="Zip Code"></paper-input>
 * </oe-vbox>
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/demo-oe-vbox.html
 * 
 */
class OeVbox extends PolymerElement {
  static get is() {
    return 'oe-vbox';
  }
  static get template() {
    return html`
    <style>
    :host {
    @apply --layout-vertical;
    }

  </style>
  <slot></slot>
    `;
  }
}

window.customElements.define(OeVbox.is, OeVbox);
