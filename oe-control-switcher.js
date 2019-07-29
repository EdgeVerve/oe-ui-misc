/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */



import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import 'oe-i18n-msg/oe-i18n-msg.js';
import { OECommonMixin } from "oe-mixins/oe-common-mixin";
import { OEFieldMixin } from "oe-mixins/oe-field-mixin.js";
import '@polymer/iron-selector/iron-selector.js';
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";



/**
 * `oe-control-switcher`
 *  Element which can be used to manage a two elements that can be selected.
 *  Tapping on the item will make the item selected.
 * 
 *  ### Styling
 * 
 * The following custom properties and mixins are available for styling:
 * 
 * CSS Variable | Description | Default
 * ----------------|-------------|----------
 * `--on-value` | styling of the on-value | 100% 
 * `--off-value` | styling of the off-value | 100%
 * `--switch-hover` | hover on two elements | 100%
 * `--on-value-selected` | styling for on-value when its selected | 100%
 * `--control-switch-border` | styling of item | 100%
 * `--off-value-selected` | styling for off-value when its selected | 100%
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @appliesMixin OEFieldMixin
 * @demo demo/demo-oe-control-switcher.html
 */

class OeControlSwitcher extends OECommonMixin(PolymerElement) {
    static get template() {
        return html`
    <style include="iron-flex iron-flex-alignment">
    .on-value {
        padding: 8px;
        padding-right: 20px;
        padding-left: 20px;
        @apply --on-value;
    }
    .off-value {
        padding: 8px;
        padding-right: 20px;
        padding-left: 20px;
        @apply --off-value;
    }
    .on-value:hover {
        border-radius: 25px; 
        background: #e0e0e0;
        @apply --switch-hover;
    }
    .off-value:hover {
        border-radius: 25px; 
        background: #e0e0e0;
        @apply --switch-hover;
    }
    .on-value.iron-selected {
        border-radius: 25px; 
        background: #1565c01f;
        border: 0.5px solid  #0000ff40;
        color: blue;
        @apply --on-value-selected;
    }
    .off-value.iron-selected {
        border-radius: 25px; 
        background: #1565c01f;
        border: 0.5px solid  #0000ff40;
        color: blue;
        @apply --off-value-selected;
    }
    .pointer {
        cursor: pointer;
    }
    .box {
        border-radius: 25px; 
        border: 1px solid  #e0e0e0;
        width: fit-content;
        @apply --control-switch-border;
    }
    </style>
   
    <iron-selector selected="{{_selected}}" required class="layout horizontal box">
    <div class="on-value pointer">
    <oe-i18n-msg msgid="[[config.onLabel]]"></oe-i18n-msg>
    </div>
    <div class="off-value pointer">
    <oe-i18n-msg msgid="[[config.offLabel]]"></oe-i18n-msg>
    </div>
    </iron-selector>
    `;
    }
    static get is() { return 'oe-control-switcher'; }
    static get properties() {
        return {
            /**
             *  Object holding values for switches 
             */
            config: {
                type: Object,
                notify: true,
                value: function () { return {}; }
            },
            /**
             *  0 or 1 based on selected value 
             */
            _selected: {
                type: Number,
                notify: true,
                observer: '_selectorToggle'
            },
            /**
             *  value present in config object 
             */
            value: {
                type: Object,
                notify: true,
                observer: '_valueChanged'
            }
        };
    }
        /**
         * invoked when _selected value changes
         * fires the event
         */
    _selectorToggle() {
        var self = this;
        if (!self._selected) {
            self.set('value', self.config.onValue);
            self.fire('control-onswitch-selected', self.config.onValue);
        }
        else {
            self.set('value', self.config.offValue);
            self.fire('control-offswitch-selected', self.config.offValue);
        }
    }
    /**
     * invoked when the value is set
     * and toggled the selected to that value
     */
    _valueChanged() {
        var self = this;
        if (self.value && (self._selected === undefined)) {
            if (self.value === self.config.onValue) {
                self.set('_selected', 0);
            }
            else if (self.value === self.config.offValue) {
                self.set('_selected', 1);
            }

        }
    }
}
customElements.define(OeControlSwitcher.is, OEFieldMixin(OeControlSwitcher));