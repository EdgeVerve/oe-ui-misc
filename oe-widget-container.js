/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";

import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-media-query/iron-media-query.js";

import "jquery/dist/jquery.js";
import "jquery.gridster/dist/jquery.gridster.js";

/**
 * `oe-widget-container`
 *  Uses Jquery.gridster to align widgets based on config.
 * 
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @demo demo/demo-oe-widget-container.html 
 */
class OeWidgetContainer extends mixinBehaviors([IronResizableBehavior], OECommonMixin(PolymerElement)) {

    static get is() { return 'oe-widget-container'; }

    static get template() {
        return html`
    <style include="iron-flex">
    
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
      }

      .container {
        position: relative;
        display: block;
      }

      .gridster {
        width: 100%;
        height: 100%;
      }

      .widget-element-dropdown {
        padding: 16px;
      }

      .widget-manager-options {
        position: absolute;
        right: 0;
        top: 0;
        color: var(--primary-color);
        z-index: 100;
      }

      .widget-manager-options paper-menu-button {
        padding: 0;
        visibility: hidden;
      }

      .widget-manager-options:hover paper-menu-button {
        visibility: visible;
      }

      .gridster ::slotted(*){
        position:absolute;
        z-index:2;
        transition: all 100ms linear;
      }

      .gridster ::slotted(li.preview-holder){
        display: inline;
      }

      .gridster ::slotted(*:hover) {
        outline: 1px dotted #c0c0c0;
        outline-offset:-1px;
      }



      .gridster ::slotted(.hide-widget-element)  {
        display: none;
      }

      .gridster .hide-widget-element {
        display: none;
      }

    </style>
    <div class="container" id="container">
      <div class="widget-manager-options">
        <paper-menu-button no-overlap horizontal-align="right" id="settings">
          <paper-icon-button icon="settings" slot="dropdown-trigger" class="dropdown-trigger"></paper-icon-button>
          <div class="dropdown-content" slot="dropdown-content">
            <div class="widget-element-dropdown">
              <div class="widget-element-list">
                <template is="dom-repeat" items="{{widgets}}">
                  <paper-item>
                    <paper-checkbox checked="{{!item.conf.hidden}}">[[item.node.tagName]]</paper-checkbox>
                  </paper-item>
                </template>
              </div>
              <paper-button on-tap="_saveConfig" id="saveConfig">SAVE CONFIG</paper-button>
            </div>
          </div>
        </paper-menu-button>
      </div>
      <template is="dom-repeat" items={{config.media}}>
        <iron-media-query query="[[item.query]]" query-matches="{{item.matches}}"></iron-media-query>
      </template>
      <div id="thegridster" class="gridster">
        <slot id="contentElement"></slot>
      </div>
    </div>
    `;
    }

    static get properties() {
        return {
            /**
             * Widget Configuration
             */
            config: {
                type: Object,
                observer: '_configChanged'
            },

            /**
             * The number of columns to create.
             */
            columns: {
                type: Number,
                value: 4
            },

            /**
             * Resizing mode 
             * 'all' enables resizing for all widgets, 
             * 'none' disables resizing for all widgets
             * 'explicit' enables resizing only for widgets having data-enable-resizing attribute
             */
            resize: {
                type: String,
                value: 'all'
            },

            /**
             * Boolean flag to enable dragging of widgets.
             */
            enableDragging: {
                type: Boolean,
                value: false,
                observer: '_enableDraggingChanged'
            },

            /**
             * Margin between the widgets
             */
            widgetMargin: {
                type: Number,
                value: 6
            },

            /**
             * Auto arrange the rows and cols based on available space
             */
            autoArrange: {
                type: Boolean,
                value: false
            },

            _configFromDom: {
                type: Object
            }

            /**
             * Fired when render is completed.
             * @event grid-render-complete
             */

            /**
             * Fired on drag start of a widget
             * @event widget-drag-start
             */

            /**
             * Fired when a widget is being dragged
             * @event widget-drag
             */

            /**
             * Fired on drag end of a widget
             * @event widget-drag-stop
             */

            /**
             * Fired on resize start of a widget
             * @event widget-resize-start
             */

            /**
             * Fired when a widget is being resized
             * @event widget-resize
             */

            /**
             * Fired on resize end of a widget
             * @event widget-resize-stop
             */

        };
    }

    static get observers() {
        return ['_mediaChanged(config.media.*)'];
    }

    /**
     * Attaches event listener to render on resize of the panel
     * @constructor
     */
    constructor() {
        super();
        this.addEventListener('iron-resize', this.render.bind(this));
    }
    /**
   * Connected callback to handle templating if custom template is present.
   */
    connectedCallback() {
        super.connectedCallback();
        var self = this;
        this.async(function () {
            self._observer = new FlattenedNodesObserver(this.$.contentElement, (info) => {
                /* Extract configuration from distributed DOM */
                var domConfig = self._extractDomConfig();
                self.set('_configFromDom', domConfig);
                self.set('widgets', self._getMergedWidgets([]));
                self._refreshWidgets();
            });
        }, 1);
    }

    /**
     * Extracts the configuration for position and dimension of nodes from their attributes,
     * and saves them as a configuration.
     * @return {Object} configuration object with node properties
     */
    _extractDomConfig() {
        var self = this;
        var domConfig = {
            widgets: [],
            columns: this.columns,
            resize: this.resize,
            widgetMargin: this.widgetMargin
        };
        var widgetNodes = self.$.contentElement.assignedNodes();
        [].forEach.call(widgetNodes, function (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.widget-element')) {
                domConfig.widgets.push({
                    node: node,
                    conf: {
                        hidden: (node.getAttribute('hidden') || node.classList.contains('hide-widget-element')),

                        row: self.__getIntAttrValue(node, 'data-row'),
                        col: self.__getIntAttrValue(node, 'data-col'),
                        sizeX: self.__getIntAttrValue(node, 'data-sizex'),
                        sizeY: self.__getIntAttrValue(node, 'data-sizey'),

                        minSizeX: self.__getIntAttrValue(node, 'data-min-sizex'),
                        minSizeY: self.__getIntAttrValue(node, 'data-min-sizey'),
                        maxSizeX: self.__getIntAttrValue(node, 'data-max-sizex'),
                        maxSizeY: self.__getIntAttrValue(node, 'data-max-sizey'),

                        enableResize: node.hasAttribute('data-enable-resize')
                    }
                });
            }
        });
        return domConfig;
    }

    /**
     * Gets the numerical value of a attribute in a node.
     * @param {HTMLElement} node Element with the attribute
     * @param {string} attr attribute name
     * @return {number} attribute value parsed as a integer.
     */
    __getIntAttrValue(node, attr) {
        if (!node || !attr || !node.hasAttribute(attr)) {
            return;
        }
        var attrVal = node.getAttribute(attr);
        if (!isNaN(attrVal)) {
            return Number.parseInt(attrVal);
        }
    }

    /**
     * Merges the default configuration with media based configuration to provide a new configuration.
     * @param {Object} widgetsConfig Widget configuration to be applied
     * @return {Object} Merged configuration to be applied on gridster.
     */
    _getMergedWidgets(widgetsConfig) {
        var self = this;
        var retWidgets = [];
        if(self._configFromDom && Array.isArray(self._configFromDom.widgets)){
            retWidgets = self._configFromDom.widgets.slice();
        }

        var allWidgetNodes = self.$.contentElement.assignedNodes();

        /* Override the config values on dom-config-clone for each found node */
        widgetsConfig && widgetsConfig.forEach(function (wConf) {
            if (wConf && wConf.selector) {
                var widgetNodes = [].filter.call(allWidgetNodes, function (n) {
                    return (n.nodeType === Node.ELEMENT_NODE) && n.matches(wConf.selector);
                });

                [].forEach.call(widgetNodes, function (node) {
                    var item = retWidgets.find(function (i) {
                        return i.node === node;
                    });

                    if (item) {
                        item.conf = Object.assign(item.conf, wConf);
                        item.conf.selector = undefined;
                    } else {
                        item = {
                            node: node,
                            conf: Object.assign({}, wConf)
                        };
                        item.conf.selector = undefined;
                        retWidgets.push(item);
                    }
                });
            }
        });
        return retWidgets;
    }

    /**
     * Refreshes the widgets
     */
    _refreshWidgets() {
        this._setAttributesOnNodes();
        this.render();
    }

    /**
     * Sets the necessary attributes on the nodes from config , so gridster can act upon it.
     * If autoArrange is enabled , modifies the node attributes to avoid overlap.
     */
    _setAttributesOnNodes() {
        var self = this;
        var widgetConfig = self.widgets;
        var width = self.offsetWidth;

        /* 
            ||<-----------------width----------------->||
            ||m1|widget1|m1|m2|widget2|m2|m3|widget3|m3||

            totalMarginWidth = 2*column*marginWidth;
            widgetWidth = (totalwidth - totalMarginWidth)/noOfColumns
        */

        self.set('baseWidgetSize', Math.floor(
            (width - (self.columns * (2 * self.widgetMargin))) / self.columns
        ));

        //Set attributes from widget config
        widgetConfig && widgetConfig.forEach(function (item) {
            var node = item.node;
            var wConf = item.conf;

            var sizeX = wConf.sizeX || 1;
            var sizeY = wConf.sizeY;
            if (!sizeY && (wConf._sizeYBaseSize !== self.baseWidgetSize)) {
                var height = node.offsetHeight;
                console.log(self.columns, self.offsetWidth, height, self.baseWidgetSize, self.widgetMargin);
                if (height > ((self.baseWidgetSize) + (2 * self.widgetMargin))) {
                    sizeY = Math.ceil(height / self.baseWidgetSize);
                    wConf.minSizeY = sizeY;
                    wConf._sizeYBaseSize = self.baseWidgetSize;
                }
            }

            /* Make sure it is within specified bounds */
            if (wConf.minSizeX && sizeX < wConf.minSizeX) {
                sizeX = wConf.minSizeX;
            }
            if (wConf.maxSizeX && sizeX > wConf.maxSizeX) {
                sizeX = wConf.maxSizeX;
            }
            if (wConf.minSizeY && sizeY < wConf.minSizeY) {
                sizeY = wConf.minSizeY;
            }
            if (wConf.maxSizeY && sizeY < wConf.maxSizeY) {
                sizeY = wConf.maxSizeY;
            }
            if (sizeX > self.columns) {
                sizeX = self.columns;
            }

            /* Store the calculated sizes */
            wConf._sizeX = sizeX;
            wConf._sizeY = sizeY;

            node.setAttribute('data-sizex', sizeX);
            node.setAttribute('data-sizey', sizeY);
            wConf.row && node.setAttribute('data-row', wConf.row);
            wConf.col && node.setAttribute('data-col', wConf.col);

            wConf.minSizeX ?
                node.setAttribute('data-min-sizex', wConf.minSizeX) : node.removeAttribute('data-min-sizex');
            wConf.minSizeY ?
                node.setAttribute('data-min-sizey', wConf.minSizeY) : node.removeAttribute('data-min-sizey');
            wConf.maxSizeX ?
                node.setAttribute('data-max-sizex', wConf.maxSizeX) : node.removeAttribute('data-max-sizex');
            wConf.maxSizeY ?
                node.setAttribute('data-max-sizey', wConf.maxSizeY) : node.removeAttribute('data-max-sizey');

            if (self.resize === 'explicit' && !wConf.enableResize) {
                node.setAttribute('data-min-sizex', sizeX);
                node.setAttribute('data-min-sizey', sizeY);
                node.setAttribute('data-max-sizex', sizeX);
                node.setAttribute('data-max-sizey', sizeY);
            }
            if (wConf.hidden) {
                node.classList.add('hide-widget-element');
            } else {
                node.classList.remove('hide-widget-element');
            }
        });

        //Auto arrange to fill the grids
        if (widgetConfig && self.autoArrange) {
            widgetConfig.sort(function (item1, item2) {
                if (item2.conf.hidden) {
                    return -1;
                } else if (item1.conf.hidden && !item2.conf.hidden) {
                    return 1;
                } else {
                    if (item1.conf.row && !item2.conf.row) {
                        return -1;
                    } else if (!item1.conf.row && item2.conf.row) {
                        return 1;
                    } else if (item1.conf.row !== item2.conf.row) {
                        return (item1.conf.row - item2.conf.row);
                    } else {
                        return (item1.conf.col - item2.conf.col);
                    }
                }
            });

            var matrix = [];

            widgetConfig.forEach(function (item) {
                var done = false;
                var sR = 0;
                var sC = 0;

                /* Move forward the filled space */
                while (matrix[sR] && matrix[sR][sC] === true) {
                    sC++;
                    if (sC >= self.columns) {
                        sC = 0;
                        sR++;
                    }
                }

                while (!done) {
                    /* If Required: extend the matrix by adding more rows */
                    for (var i = 0; i < sR + item.conf._sizeY; i++) {
                        if (!matrix[i]) {
                            matrix[i] = new Array(self.columns);
                        }
                    }

                    /* does it fit at sR,sC ?*/
                    var fits = true;
                    var ir,ic;
                    for (ir = 0; fits && ir < item.conf._sizeY; ir++) {
                        for (ic = 0; fits && ic < item.conf._sizeX; ic++) {
                            fits = (sC + ic < self.columns) && (matrix[sR + ir][sC + ic] === undefined);
                        }
                    }

                    if (fits) {
                        for (ir = 0; ir < item.conf._sizeY; ir++) {
                            for (ic = 0; ic < item.conf._sizeX; ic++) {
                                matrix[sR + ir][sC + ic] = true;
                            }
                        }
                        item.node.setAttribute('data-row', sR + 1);
                        item.node.setAttribute('data-col', sC + 1);
                        done = true;
                    } else {
                        /* does not fit at sR,sC */
                        sC++;
                        if (sC >= self.columns) {
                            sC = 0;
                            sR++;
                        }
                    }
                }
            });
        }

    }

    /**
     * Renders the widgets using gridster and the configuration.
     */
    render() {
        var self = this;
        this.debounce('configure-widget-container', function () {
            var width = self.offsetWidth;
            self.set('baseWidgetSize', Math.floor(
                (width - (self.columns * (2 * self.widgetMargin))) / self.columns
            ));

            var gridsterConfig = {
                widget_selector: '.widget-element:not(.hide-widget-element)',
                widget_margins: [self.widgetMargin, self.widgetMargin],
                min_cols: 1,
                max_cols: self.columns,
                widget_base_dimensions: [self.baseWidgetSize, self.baseWidgetSize],
                resize: {
                    enabled: (self.resize !== 'none'),
                    start: self._handleResizeStart.bind(self),
                    resize: self._handleResize.bind(self),
                    stop: self._handleResizeStop.bind(self)
                },
                draggable: {
                    start: self._handleDragStart.bind(self),
                    drag: self._handleDrag.bind(self),
                    stop: self._handleDragStop.bind(self),
                    max_size_x: false
                }
            };
            var gridster = $(self); // eslint-disable-line no-undef

            gridster.removeData('gridster');
            self.__gridsterConfig = gridsterConfig;
            self.gridster = gridster.gridster(gridsterConfig).data('gridster');

            if (self.enableDragging) {
                self.gridster.enable();
            } else {
                self.gridster.disable();
            }
            self.fire('grid-render-complete');
        });
    }

    /**
     * Saves the grid configuration after widgets are modified.
     */
    _saveConfig() {
        var self = this;
        this.$.settings.opened = false;
        self.widgets.forEach(function (obj) {
            var elem = obj.node;
            if (obj.conf.hidden) {
                elem.classList.add('hide-widget-element');
            } else {
                elem.classList.remove('hide-widget-element');
            }
        });
        this.render();
    }

    /**
     * Observes changes to config property to re-render the widgets.
     * @param {Object} newVal new value for configuration
     * @param {Object} oldVal .
     */
    _configChanged(newVal, oldVal) {
        var self = this;
        this.async(function () {
            if (newVal) {
                self.set('columns', newVal.columns || self.columns);
                self.set('widgetMargin', newVal.widgetMargin || self.widgetMargin);
                self.set('resize', newVal.resize || self.resize);
                self.set('widgets', self._getMergedWidgets(newVal.widgets || []));
            } else {
                self.set('widgets', self._getMergedWidgets([]));
            }

            self._setAttributesOnNodes();
            self.render();
        });
    }

    /**
     * Observes enableDragging property to enable/disable dragging.
     * @param {boolean} newVal new value for configuration
     * @param {Object} oldVal .
     */
    _enableDraggingChanged(newVal, oldVal) {
        if (this.gridster) {
            if (newVal) {
                this.gridster.enable();
            } else {
                this.gridster.disable();
            }
        }
    }

    /**
     * Checks if a media query is matched and sets the matched configuration.
     * @param {Object} data change data of 'config.match' property
     */
    _mediaChanged(data) {
        var path = data.path.split('.');
        if (path.pop() === 'matches') {
            if (!this._origConfig) {
                this._origConfig = this.config;
            }
            var newConfig = JSON.parse(JSON.stringify(this._origConfig));
            newConfig.media = this._origConfig.media;

            if (data.value === true) {
                var matchingMedia = this.get(path.join('.'));
                Object.assign(newConfig, matchingMedia.config);
            }
            this.set('config', newConfig);
        }
    }

    __getWidgetElement(event){
        var cur = event.target;
        while(cur && cur != this && !cur.matches(this.gridster.options.widget_selector)){
            cur = cur.parentElement;
        }
        return cur;
    }

    _handleDragStart(event, ui) {
        this.debounce('widget-drag-start', function () {
            this.fire('widget-drag-start', {
                target: this,
                ui: ui
            });
        });
    }
    _handleDrag(event, ui) {
        this.debounce('widget-drag', function () {
            this.fire('widget-drag', {
                target: this,
                ui: ui
            });
        });
    }
    _handleDragStop(event, ui) {

        var widgetEl = this.__getWidgetElement(event);
        /* Extract the new position of widget and update the config in this.widgets */
        var item = this.widgets.find(function (i) {
            return i.node === widgetEl;
        });

        if (item && item.conf) {
            item.conf.row = this.__getIntAttrValue(item.node, 'data-row');
            item.conf.col = this.__getIntAttrValue(item.node, 'data-col');
        }

        this.debounce('widget-drag-stop', function () {
            if (this.autoArrange) {
                this._refreshWidgets(true);
            }
            this.fire('widget-drag-stop', {
                target: this,
                ui: ui
            });
        }, 200);
    }
    _handleResizeStart(event, ui, widget) {
        this.debounce('widget-resize-start', function () {
            this.fire('widget-resize-start', {
                target: this,
                ui: ui,
                widget: widget
            });
        });
    }
    _handleResize(event, ui, widget) {
        this.debounce('widget-resize', function () {
            this.fire('widget-resize', {
                target: this,
                ui: ui,
                widget: widget
            });
        });
    }
    _handleResizeStop(event, ui, widget) {

        /* Extract the new size of widget and update the config in this.widgets array */
        var item = this.widgets.find(function (i) {
            return i.node === widget[0];
        });

        if (item && item.conf) {
            item.conf.sizeX = this.__getIntAttrValue(item.node, 'data-sizex');
            item.conf.sizeY = this.__getIntAttrValue(item.node, 'data-sizey');
        }
        this.debounce('widget-resize-stop', function () {
            if (this.autoArrange) {
                this._refreshWidgets();
            }
            this.fire('widget-resize-stop', {
                target: this,
                ui: ui,
                widget: widget
            });
        }, 200);
    }
}

window.customElements.define(OeWidgetContainer.is, OeWidgetContainer);