/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-media-query/iron-media-query.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/polymer/lib/elements/custom-style.js";
import "oe-i18n-msg/oe-i18n-msg.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";


/**
 * ### oe-stepper
 * 
 * `<oe-stepper>` is a control for rendering navigation related steps based on Polymer's `iron-selector` control with following additional features.
 * 
 * 1. can support any number of steps within it
 * 2. emits oe-stepper-event which gives the selected step index and the step label
 * 3. support internationalization of labels
 * 4. adds a tick icon if the step is marked as completed.
 * 5. adds a error icon if the step is marked as error.
 * 6. provision to mark a step disabled
 * ```
 * <oe-stepper steps='[{"label":"Financial Details","isDisabled":false,"hasError":true,"isCompleted":false},
 *       {"label":"Demographic Details","isDisabled":true,"hasError":false,"isCompleted":false},
 *       {"label":"Asset Details","isDisabled":true,"hasError":false,"isCompleted":false},
 *       {"label":"Location Details","isDisabled":false,"hasError":false,"isCompleted":false},
 *       {"label":"Location Details","isDisabled":false,"hasError":false,"isCompleted":false},
 *       {"label":"CIF Details","isDisabled":false,"hasError":false,"isCompleted":true}]' value='0'>
 * </oe-stepper>
 * ```
 * ### Styling 
 * 
 * The following custom properties and mixins are available for styling:
 *  
 * | CSS Variable     | Description   | Default    |
 * |----------------  |:-------------:| ----------:|
 * | `--oe-stepper-background-color`     | Background color of stepper and step          | `white`                  |
 * | `--oe-stepper-line-color`           | Color applied to line                         | `#dfdfdf`                |
 * | `--oe-stepper-line-size`            | Height of the line                            | `2px`                    |
 * | `--oe-stepper-circle-size`          | Size of circle and stepper                    | `40px`                   |
 * | `--oe-stepper-filling-color`        | Color applied to line when selected next step | `#2db36f`                |
 * | `--oe-stepper-animate-speed`        | Time for the filling animation                | `0.5s`                   |
 * | `--stepsection-primary-color`       | Color applied to step section                 | `--default-primary-color`|
 * | `--accent-color`                    | Color applied to step number background       | `--primary-color`        |
 * | `--oe-stepper-step-color`           | Color applied to the step number              | `white`                  |
 * | `--oe-stepper-anim-speed`           | The animation speed for the circles and lines | `0.5s`                   |
 * | `--oe-stepper-step-font-size`       | The font-size of steps inside the circle      | `25px`                   |
 * | `--oe-stepper-icon-bg`              | Color applied for the background of icon      | `#2db36f`                |
 * | `--oe-stepper-icon-color`           | Color applied to the icon in the step         | `white`                  |
 * | `--alert-color`                     | Color applied to step containing error        | `--paper-pink-a400`      |
 * | `--oe-stepper-error-fill`           | Color applied for fill icon of error step     | `white`                  |
 * | `--oe-stepper-completed-bg`         | Color applied to background of completed step | `#2db36f`                |
 * | `--oe-stepper-completed-fill`       | Color applied to fill icon of completed step  | `white`                  |
 * | `--oe-stepper-label-width`          | Max width to apply for label truncating       | `100px`                  |
 * | `--dark-disable-color`              | Color applied to disabled step label          | `--dark-accent-color`    |
 * | `--oe-stepper-data`                 | Mixin applied to the step label               | {}                       |
 *
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @demo demo/demo-oe-stepper.html
 * 
 */
class OeStepper extends OECommonMixin(PolymerElement) {
    static get is() {
        return 'oe-stepper';
    }

    static get template() {
        return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
    <style>
        :host {
            font-family: 'Roboto', 'Noto', sans-serif;
        }

        .stepper-background {
            background-color: var(--oe-stepper-background-color, white);
        }

        .card-header-section {
            position: relative;
        }

        :host([vertical]):not([spread-value]) .card-header-section {
            height: 100%;
        }

        :host([spread-value]):not([vertical]) .card-header-section {
            display: inline-block;
        }


        .line {
            background-color:var(--oe-stepper-line-color, #dfdfdf);
            height: var(--oe-stepper-line-size, 2px);
            position: absolute;
            top: calc(var(--oe-stepper-circle-size, 40px)/2);
            left: 30px;
            right: 30px;
        }

        .line-vertical {
            background-color:var(--oe-stepper-line-color, #dfdfdf);
            position: absolute;
            width: var(--oe-stepper-line-size, 2px);;
            top:0;
            left: 50%;
            height: calc(100% - var(--oe-stepper-circle-size, 40px));
        }

        .no-line {
            display: none;
        }

        #filling {
            background-color: var(--oe-stepper-filling-color,#2db36f);
            -webkit-transition: -webkit-transform var(--oe-stepper-animate-speed,0.5s);
            -moz-transition: -moz-transform var(--oe-stepper-animate-speed,0.5s);
            transition: transform var(--oe-stepper-animate-speed,0.5s);
        }

        #filling {
            -webkit-transform: scaleX(0);
            -moz-transform: scaleX(0);
            -ms-transform: scaleX(0);
            -o-transform: scaleX(0);
            transform: scaleX(0);
            -webkit-transform-origin: left center;
            -moz-transform-origin: left center;
            -ms-transform-origin: left center;
            -o-transform-origin: left center;
            transform-origin: left center;
        }

        :host([vertical]) #filling {
            -webkit-transform: scaleY(0);
            -moz-transform: scaleY(0);
            -ms-transform: scaleY(0);
            -o-transform: scaleY(0);
            transform: scaleY(0);
            -webkit-transform-origin: top center;
            -moz-transform-origin: top center;
            -ms-transform-origin: top center;
            -o-transform-origin: top center;
            transform-origin: top center;
        }

        :host([vertical]) iron-selector {
            height: 100%;
        }

        .stepsection {
            position: relative;
            font-size: 13.5px;
            color: var(--stepsection-primary-color, --default-primary-color);
            letter-spacing: 0;
            text-align: center;
        }

        .stepsection.iron-selected {
            font-weight: 1000;
        }

        .step {
            color: var(--oe-stepper-step-color, white);
        }

        span.icon {
            width:  var(--oe-stepper-circle-size,40px);
            height:  var(--oe-stepper-circle-size,40px);
            line-height:  var(--oe-stepper-circle-size,40px);
            display: block;
            text-align: center;
            border-radius: 50%;
            -webkit-transition: background-color var(--oe-stepper-anim-speed,0.5s), border-color var(--oe-stepper-anim-speed,0.5s);;
            -moz-transition: background-color var(--oe-stepper-anim-speed,0.5s), border-color var(--oe-stepper-anim-speed,0.5s);
            transition: background-color var(--oe-stepper-anim-speed,0.5s), border-color var(--oe-stepper-anim-speed,0.5s);
            font-size:var(--oe-stepper-step-font-size,25px);
            border: 1px solid grey;
            margin: 1px;
            background-color: var(--oe-stepper-icon-bg, #2db36f);
        }

        span.icon iron-icon {
            fill: var(--oe-stepper-icon-color, white);
        }

        span.error .icon {
            background-color: var(--alert-color, #EC41E4);
        }

        span.error iron-icon {
            fill: var(--oe-stepper-error-fill, white);
        }

        span.completed .icon {
            background-color: var(--oe-stepper-completed-bg, #2db36f);
        }

        span.completed iron-icon {
            fill: var(--oe-stepper-completed-fill, white);
        }

        .pointer {
            cursor: pointer;
        }

        .step-data {
            cursor: pointer;
            max-width: var(--oe-stepper-label-width, 100px);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            display: inline-block;
            padding: 0 2px;
            @apply --oe-stepper-data;
        }

        .disable {
            pointer-events: none;
            cursor: default;
            color: var(--dark-disable-color, --dark-accent-color);
            opacity: 0.5;
        }
    </style>
    <iron-media-query query="(min-width: 600px)" query-matches="{{stepper}}"></iron-media-query>
    <template is="dom-if" if="[[!__showMenuView(stepper,vertical)]]">
        <div class="card-header-section stepper-background">
            <template is="dom-if" restamp if="[[showProgress]]">    
                <span id="line" class$="[[_showLine(steps, vertical)]]" style$="{{_calculateLineOffset(vertical, labelPosition)}}"></span>
            </template>
            <template is="dom-if" restamp if="[[showProgress]]">  
                <span id="filling" class$="[[_showLine(steps, vertical)]]" style$="{{_calculateFilling(steps, value, vertical, labelPosition)}}"></span>        
            </template>
            <iron-selector class$="[[_getLayoutStyle(vertical,spreadValue)]]" selected="{{value}}">
                <template is="dom-repeat" items="{{steps}}" on-rendered-item-count-changed="_redrawLines">
                    <span class="stepsection stepper-background" style$="[[_getSpreadStyle(vertical,spreadValue,index)]]">
                        <span class$="[[_getDivClass(item.*,labelPosition)]]" on-tap="_handleTap">
                        <template is="dom-if" if="[[_hasIcon(item.*)]]">
                        <span class="layout horizontal center-center icon">
                            <iron-icon icon="{{_getStepIcon(item.*)}}"></iron-icon>
                        </span>
                    </template>
                    <template is="dom-if" if="[[!_hasIcon(item.*)]]">
                        <span class="icon step">[[_displayIndex(index)]]</span>
                    </template>
                            <span class="step-data">
                                <oe-i18n-msg msgid="[[item.label]]"></oe-i18n-msg>
                            </span>
                        </span>
                    </span>
                </template>
            </iron-selector>
        </div>
    </template>
    <template is="dom-if" if="[[__showMenuView(stepper,vertical)]]">
        <span class="flex layout horizontal center">
            <paper-menu-button>
                <paper-icon-button icon="menu" class="dropdown-trigger" slot="dropdown-trigger"></paper-icon-button>
                <paper-listbox id="menu" slot="dropdown-content" class="dropdown-content" selected="{{value}}">
                    <template is="dom-repeat" items="{{steps}}">
                        <paper-item class="pointer" disabled$="[[item.isDisabled]]" on-tap="_handleTap">
                            <span class="stepsection">
                                <span class$="[[_getDivClass(item.*,labelPosition)]]">
                                    <template is="dom-if" if="[[_hasIcon(item.*)]]">
                                        <span class="layout horizontal center-center icon">
                                            <iron-icon icon="{{_getStepIcon(item.*)}}"></iron-icon>
                                        </span>
                                    </template>
                                    <template is="dom-if" if="[[!_hasIcon(item.*)]]">
                                        <span class="icon step">[[_displayIndex(index)]]</span>
                                    </template>
                                    <span class="step-data">
                                        <oe-i18n-msg msgid="[[item.label]]"></oe-i18n-msg>
                                    </span>
                                </span>
                            </span>
                        </paper-item>
                    </template>
                </paper-listbox>
            </paper-menu-button>
            <oe-i18n-msg msgid="[[selectedItem.label]]" class="pointer"></oe-i18n-msg>
        </span>
    </template>
    `;
    }
    static get properties() {
        return {
            /**
             * Array containing the details if the step is enabled or disabled.
             * 
             */
            steps: {
                type: Array,
                value: []
            },

            /**
             * Property reflecting the selected step value.
             * 
             */
            value: {
                type: Number,
                notify: true,
                value: 0,
                observer: '_valueChanged'
            },

            /**
             * Property reflecting the stepper orientation.
             * 
             */
            vertical: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Property reflecting the selected step label.
             * 
             */
            selectedLabel: {
                type: String,
                value: "",
                notify: true
            },

            /**
             * Property reflecting the selected step item.
             * 
             */
            selectedItem: {
                type: Object,
                notify: true
            },

            /**
             * Property reflecting the label position (inline/bottom).
             * 
             */
            labelPosition: {
                type: String,
                value: "inline"
            },

            /**
             * Boolean property reflecting to show error icon.
             * 
             */
            showErrorIcon: {
                type: Boolean,
                value: false
            },

            /**
             * Boolean property reflecting to show completed icon.
             * 
             */
            showCompletedIcon: {
                type: Boolean,
                value: false
            },
            /**
             * Number property that determines the distance between steps.
             * 
             */
            spreadValue: {
                type: Number,
                reflectToAttribute: true,
                value: null
            },
        };
    }
    /**
     * Function that increments the index value by 1 - for the step number
     * @param {number} index .
     * @return {number} incrementing index by one.
     * 
     */
    _displayIndex(index) {
        return index + 1;
    }
    /**
     * Function that sets the layout style of iron-selector in oe-stepper
     * @param {boolean} vertical Boolean which tells whether oe-stepper vertical or horizontal
     * @param {number} spreadValue . 
     * @return {string} List of classes to be added to iron-selector
     * 
     */
    _getLayoutStyle(vertical, spreadValue) {

        var classList = "layout ";
        if (spreadValue) {
            classList += "start ";
        } else {
            classList += "justified ";
        }
        if (vertical) {
            classList += "vertical";
        } else {
            classList += "horizontal";
        }
        return classList;
    }
    /**
     * Function that sets the css of the steps
     * @param {boolean} vertical Boolean which tells whether oe-stepper vertical or horizontal
     * @param {string} labelPosition Property of oe-stepper for placement of label
     * @return {string} Style to be added for offset of line
     * 
     */
    _calculateLineOffset(vertical, labelPosition) {

        if (vertical && labelPosition === "inline") {
            var circleSize = 40;
            var customSize;
                if (ShadyCSS) {
                    customSize = ShadyCSS.getComputedStyleValue(this, '--oe-stepper-circle-size');
                  } else {
                    customSize = getComputedStyle(this).getPropertyValue('--oe-stepper-circle-size');
                  }
                if (customSize && customSize.endsWith('px')) {
                    var n = customSize.slice(0, -2);
                    if (!isNaN(n)) {
                        circleSize = Number.parseInt(n);
                    }
                }
            return ("left: " + circleSize / 2 + "px");
        } else {
            return "";
        }
    }
    /**
     * Function that sets the css of the steps
     * @param {Object} itemChanges Object with changes of current step
     * @param {string} labelPosition Property of oe-stepper for placement of label
     * @return {string} List of classes to be added to current step
     * 
     */
    _getDivClass(itemChanges, labelPosition) {

        var item = itemChanges.base;
        var classList = "flex layout center";
        if (labelPosition === "bottom") {
            classList += " vertical";
        } else {
            classList += " horizontal";
        }

        if (item.isDisabled) {
            classList += " disable";
        } else {
            classList += " pointer";
        }

        if (item.hasError) {
            classList += " error";
        }

        if (item.isCompleted) {
            classList += " completed";
        }
        return classList;
    }
    /**
       * Function that handles the oe-tap event, which in-turn returns the values
       * of the selected step index and the label.
       * Wait added for retrieving the latest values for the selected step index and the label
       * 
       */
    _handleTap() {
        this.async(function () {
            /*wait added to return the current selected step */
            this.fire('oe-stepper-tap', {
                selectedIndex: this.value,
                selectedLabel: this.selectedLabel
            });
        }, 100);

    }
    /**
        * Observer called on change of the selected step value
        * @param {number} newValue .
        * @param {number} oldValue . 
        * 
        */
    _valueChanged(newValue, oldValue) {
        if (this.steps && this.steps.length != 0 && this.steps[newValue]) {
            if (this.steps[newValue].isDisabled) {
                this.set('value', oldValue || 0);
            } else {
                this.set('value', newValue);
                var selectedItem = this.steps[this.value];
                this.set('selectedItem', selectedItem);
                this.set('selectedLabel', selectedItem.label);
            }
        }


    }

    /**
    * Function which enables the user to refresh the steps
    * 
    */
    refreshStepData() {

        var originalsteps = this.get('steps');
        this.set('steps', undefined);
        this.set('steps', originalsteps);

    }

    /**
     * Used to calculate the ratio for line transformation
     *
     * @param {Array} steps List of steps in the stepper
     * @param {number} step Current step number
     * @param {boolean} vertical Boolean which tells whether oe-stepper vertical or horizontal
     * @param {string} labelPosition Property of oe-stepper for placement of label
     * @return {string} style 
     * 
     */
    _calculateFilling(steps, step, vertical, labelPosition) {

        var ratio;
        if (steps.length === undefined || step === 0) {
            ratio = 0;
        } else {
            ratio = (step) / (steps.length - 1);
        }

        var scale;
        if (vertical) {
            scale = "1, " + ratio;
        } else {
            scale = ratio + ", 1";
        }

        var style = "transform: scale(" + scale + ");";
        if (vertical && labelPosition === "inline") {
            var circleSize = 40;
            if (this._styleProperties) {
                var customSize = this._styleProperties['--oe-stepper-circle-size'];
                if (customSize && customSize.endsWith('px')) {
                    var n = customSize.slice(0, -2);
                    if (!isNaN(n)) {
                        circleSize = Number.parseInt(n);
                    }
                }
            }
            style += "left: " + circleSize / 2 + "px;";
        }

        return style;
    }

    constructor(){
        super();
        this.set('showProgress',true);
        this.set('stepper',true);
    }

    __showMenuView(stepper,vertical){
        return !vertical && !stepper;
    }

    /**
     * Used to toggle class for the line.
     * Returns no-line which doesn't display line if only one step.
     *
     * @param {Array} steps List of steps in the stepper
     * @param {boolean} vertical Boolean which tells whether oe-stepper vertical or horizontal
     * @return {string} returns string `line`
     * 
     */
    _showLine(steps, vertical) {

        if (!steps || (steps && steps.length <= 1)) {
            return "no-line";
        }
        if (vertical) {
            return "line-vertical";
        }
        return "line";
    }

    /**
     * Function that sets the icon for a step when change in the steps array
     * @param {Object} itemChanges Object with changes of current step
     * @return {string} iron icon value which has error/completed/custom icon
     * 
     */
    _getStepIcon(itemChanges) {

        var item = itemChanges.base;
        if (item.hasError && this.showErrorIcon) {
            return "icons:report-problem";
        } else if (item.isCompleted && this.showCompletedIcon) {
            return "icons:check";
        } else {
            return item.icon;
        }
    }

    /**
     * Function that checks whether step should show icon or step number
     * @param {Object} itemChanges Object with changes of current step
     * @return {boolean} Return true/false whether to show icon or step number
     * 
     */
    _hasIcon(itemChanges) {

        var item = itemChanges.base;
        if (item.hasError && this.showErrorIcon) {
            return true;
        } else if (item.isCompleted && this.showCompletedIcon) {
            return true;
        } else {
            return item.icon ? true : false;
        }
    }
    _redrawLines() {

        this.set('showProgress', false);
        this.async(function () {
            this.set('showProgress', true);
        }, 200);
    }
    _getSpreadStyle(vertical, spreadValue, index) {

        if (!spreadValue || spreadValue < 0 || index === (this.steps.length - 1)) {
            return "";
        }
        var spreadDistance = spreadValue + "px;";
        return (vertical ? "margin-bottom:" : "margin-right:") + spreadDistance;
    }

}

window.customElements.define(OeStepper.is, OeStepper);
