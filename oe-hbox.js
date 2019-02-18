/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import {html, PolymerElement} from "@polymer/polymer/polymer-element.js";

/**
 * `oe-hbox`
 * `oe-hbox` displays content horizontally. child elements occupy their default width and wrap around when 'oe-hbox' width is not sufficient.
 * ```
 * <oe-hbox>
 *      <paper-input label="First Name"></paper-input>
 *      <paper-input label="Last Name"></paper-input>
 *      <paper-input label="City"></paper-input>
 *      <paper-input label="Zip Code"></paper-input>
 * </oe-hbox>
 * ```
 * for arranging controls in two column, apply additional css class on hbox like below
 * 
 * ### Style
 * ```
 * <style>
 *       .layout-2-col > * {
 *         width: calc(50.00% - 16px);
 *         padding-left: 8px;
 *         padding-right: 8px;
 *      }    
 * </style>
 * ```
 * 
 * ```
 * <oe-hbox class="layout-2-col">
 *      ...
 *      ...
 * </oe-hbox>
 * ```
 * 
 * @customElement
 * @polymer
 * @demo demo/demo-oe-hbox.html
 * 
 */
class OeHbox extends PolymerElement {
  static get is() {
    return 'oe-hbox';
  } 
  static get template() {
    return html`
    <style>
    :host {
      flex-basis: inherit !important;

      @apply --layout-horizontal;
      @apply --layout-left-justified;
      @apply --layout-wrap;
    }
  </style>

  <slot></slot>
    `;
  }
}
window.customElements.define(OeHbox.is, OeHbox);
