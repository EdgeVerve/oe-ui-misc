/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-media-query/iron-media-query.js";
import "jquery/dist/jquery.js";
import Draggable from "./draggable.js";


/**
 * `oe-widget-container`
 *  
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

     
      #container{
        position:relative;
        width:100%;
      }

      #container ::slotted(*){
        position:absolute;
        display:inline-block;
        box-sizing:border-box;
      }

      #container ::slotted(*:hover) {
        outline: 1px dotted #c0c0c0;
        outline-offset:-1px;
      }

      :host(.is-dragging) ::slotted(*){
        opacity:0.7;
        transition: all 100ms linear;
      }

      :host(.is-resizing) ::slotted(*){
        opacity:0.7;
        transition: all 100ms linear;
      }

      :host(.is-dragging) ::slotted(.current-dragging){
        opacity:1;
      }

      :host(.is-resizing) ::slotted(.current-resizing){
        opacity:1;
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
      <div id="thegridster" class="gridster" style$="height:[[_computedHeight]]px">
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
                value: function () {
                    return {
                        columns: 4,
                        widgetQuery: '*',
                        minHeight: 1,
                        minWidth: 1
                    }
                },
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
             * Boolean flag to enable dragging of widgets.
             */
            enableResizing: {
                type: Boolean,
                value: false,
                observer: '_enableResizingChanged'
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

        this.isRendering = false;
        this.addEventListener('dragover', function (event) {
            event.preventDefault();
        });
    }
    /**
   * Connected callback to handle templating if custom template is present.
   */
    connectedCallback() {
        super.connectedCallback();
        this.getWidgetConfigFromDom();
        this.renderWidgets();

    }
    getWidgetConfigFromDom() {
        var selectionQuery = this._widgetQuery;
        var widgetElements = [].filter.call(this.children, function (el) {
            return el.matches(selectionQuery);
        });
        var widConf = [];
        var prevwidConf = this.widgetConfigs || [];
        this._gridUnit = this.clientWidth / this._maxColumns;
        widgetElements.forEach(function (el) {
            var widgetConf = prevwidConf.find(function (conf) {
                return conf.el === el;
            })

            if (!widgetConf) {
                widgetConf = {
                    row: isNaN(el.dataset.row) ? 0 : Number.parseInt(el.dataset.row),
                    column: isNaN(el.dataset.column) ? 0 : Number.parseInt(el.dataset.column),
                    width: isNaN(el.dataset.width) ? 1 : Number.parseInt(el.dataset.width),
                    height: isNaN(el.dataset.height) ? 1 : Number.parseInt(el.dataset.height),
                    el: el
                }
            }

            this.__attachDragEvents(widgetConf);
            this.__attachResizeEvents(widgetConf);

            widConf.push(widgetConf);
        }.bind(this));
        this.set("widgetConfigs", widConf);
        this._enableResizingChanged();
    }
    /**
      * Handle resize of widgets
      * 
      */
    _enableResizingChanged() {
        if (this.widgetConfigs) {
            this.widgetConfigs.forEach(function (config) {
                var enableResize = this.enableResizing && !config.disableResize;

                if (enableResize !== config._resizable.enableDrag) {
                    config._resizable.toggleDrag(enableResize);
                    if (enableResize) {
                        config.el.addEventListener('mouseenter', this.resizeMouseEnter);
                        config.el.addEventListener('mouseleave', this.resizeMouseLeave);
                    } else {
                        config.el.removeEventListener('mouseenter', this.resizeMouseEnter);
                        config.el.removeEventListener('mouseleave', this.resizeMouseLeave);
                    }
                }
            }.bind(this));
        }

    }

    renderWidgets(widgetConfigs) {

        widgetConfigs = widgetConfigs || this.widgetConfigs;

        this._gridConfig = {
            gridMap: this._generateGridMap(this._maxColumns),
            lastRowFilled: 0
        }

        widgetConfigs.forEach(function (config, index) {
            if (config.width > this._maxColumns) {
                return;
            }

            var customConf = config;

            if (this.autoArrange && !config.el.classList.contains('current-dragging')) {
                // customConf = Object.assign({},config,{
                //   row:0,
                //   column:0
                // }); 
                customConf.row = 0;
                customConf.column = 0;
            }

            this._placeValid(customConf);
            this.setStyles(customConf.el, customConf);
            var stringableConf = Object.assign({}, customConf, {
                el: undefined,
                _draggable: undefined,
                _resizable: undefined,
                index: index
            });
            customConf.el.setAttribute('drag-conf', JSON.stringify(stringableConf));
        }.bind(this));

        this.set('_computedHeight', (this._gridConfig.lastRowFilled) * this._gridUnit);
    }
    setStyles(el, config) {
        var unit = this._gridUnit;
        el.setAttribute('data-row', config.row);
        el.setAttribute('data-column', config.column);
        el.setAttribute('data-width', config.width);
        el.setAttribute('data-height', config.height);
        el.style.top = (config.row * unit) + this._widgetMargin + "px";
        el.style.left = (config.column * unit) + this._widgetMargin + "px";
        el.style.width = (config.width * unit) - (2 * this._widgetMargin) + "px";
        el.style.height = (config.height * unit) - (2 * this._widgetMargin) + "px";
    }
    /**
      * Grid creation
      * 
      */

    _generateGridMap(size) {
        var grid = [];
        for (var i = 0; i < size; i++) {
            grid[i] = (new Array(size)).fill(false);
        }
        return grid;
    }
    _placeValid(config) {
        var grid = this._gridConfig.gridMap;
        var maxColumns = this._maxColumns;
        var row = config.row;
        var column = config.column;

        while (!this.__isValidPlacement(row, column, config.width, config.height)) {
            column++;
            if (column >= maxColumns) {
                column = 0;
                row++;
            }
            if (!Array.isArray(grid[row])) {
                grid[row] = (new Array(maxColumns)).fill(false);
            }
        }
        config.row = row;
        config.column = column;
        this.__fillGrid(row, column, config.width, config.height);
        var elEndRow = row + config.height;
        var lastRowFilled = this._gridConfig.lastRowFilled;
        this._gridConfig.lastRowFilled = lastRowFilled < elEndRow ? elEndRow : lastRowFilled;
    }

    __fillGrid(row, col, width, height) {
        var grid = this._gridConfig.gridMap;
        for (var i = row; i < row + height; i++) {
            for (var j = col; j < col + width; j++) {
                grid[i][j] = true;
            }
        }
    }

    __isValidPlacement(row, col, width, height) {
        var grid = this._gridConfig.gridMap;
        var maxColumns = this._maxColumns;
        if (col + width > maxColumns) {
            return false;
        }
        for (var i = row; i < row + height; i++) {
            if (!Array.isArray(grid[i])) {
                grid[i] = (new Array(maxColumns)).fill(false);
            }
            for (var j = col; j < col + width; j++) {
                if (grid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    __attachDragEvents(config) {
        if (config._draggable instanceof Draggable) {
            config._draggable.updateOptions({
                dragUnit: this._gridUnit
            });
        } else {
            config._draggable = new Draggable(config.el, {
                disableDrag: !this.enableDragging,
                dragUnit: this._gridUnit,
                dragStartFn: this.handleDragStart.bind(this),
                dragFn: this.handleDrag.bind(this),
                dragEndFn: this.handleDragEnd.bind(this)
            });
        }

    }
    __attachResizeEvents(config) {
        var resizeHandler = config.el.querySelector('.resize-handler');
        if (!resizeHandler) {
            resizeHandler = this.__createResizeHandler();
            config.el.appendChild(resizeHandler);
            config.el.__resizeHandler = resizeHandler;
            resizeHandler.__hostWidget = config.el;
        }

        if (config._resizable instanceof Draggable) {
            config._resizable.updateOptions({
                dragUnit: this._gridUnit
            });
        } else {
            config._resizable = new Draggable(resizeHandler, {
                ondragClass: 'current-resizing',
                dragUnit: this._gridUnit,
                dragStartFn: this.resizeDragStart.bind(this),
                dragFn: this.resizeDrag.bind(this),
                dragEndFn: this.resizeDragEnd.bind(this)
            });
        }

        if (this.enableResizing && !config.disableResize) {
            config.el.addEventListener('mouseenter', this.resizeMouseEnter.bind(this));
            config.el.addEventListener('mouseleave', this.resizeMouseLeave.bind(this));
        }
    }
    __createResizeHandler() {
        var handler = document.createElement('div');
        handler.classList.add('resize-handler');
        handler.style.width = "5px";
        handler.style.height = "5px";
        handler.style.position = "absolute";
        handler.style.borderRight = "2px solid rgba(0, 0, 0, 0.3)";
        handler.style.borderBottom = "2px solid rgba(0, 0, 0, 0.3)";
        handler.style.right = "5px";
        handler.style.bottom = "5px";
        handler.style.cursor = "nwse-resize";
        handler.hidden = true;
        return handler;
    }
    resizeDragStart(event, dragConfig) {
        this.classList.add('is-resizing');
        this.isRendering = true;

        var config = this.widgetConfigs.find(function (c) {
            return c.el === dragConfig.element.__hostWidget;
        });

        var index = this.widgetConfigs.indexOf(config);
        //var oldIndex = this.__moveToFirst(this.widgetConfigs, config);

        this._resizeConfig = {
            config: config,
            widgets: this.widgetConfigs,
            width: config.width,
            height: config.height,
            resizeElIndex: index
        }
        return true;
    }
    resizeDrag(event, dragConfig) {
        var minHeight = this._resizeConfig.config.minHeight || this.minHeight || 1;
        var minWidth = this._resizeConfig.config.minWidth || this.minWidth || 1;
        var newHeight = this._resizeConfig.height + dragConfig.deltaYUnit;
        newHeight = (newHeight < minHeight) ? minHeight : newHeight;

        var newWidth = this._resizeConfig.width + dragConfig.deltaXUnit;
        var elCol = this._resizeConfig.config.column;
        newWidth = (newWidth < minWidth) ? minWidth : newWidth;
        newWidth = ((newWidth + elCol) > this._maxColumns) ? (this._maxColumns - elCol) : newWidth;

        var widgets = this._resizeConfig.widgets.map(function (conf) {
            return Object.assign({}, conf);
        });



        widgets[this._resizeConfig.resizeElIndex].height = newHeight;
        widgets[this._resizeConfig.resizeElIndex].width = newWidth;
        this.widgetConfigs = widgets;
        this.renderWidgets(widgets);
    }
    resizeDragEnd(event) {
        console.log('resize ending');
        event.stopPropagation();
        this.isRendering = false;
        this.classList.remove('is-resizing');
        // var oldIndex = this._resizeConfig.resizeElIndex;
        // var conf = this.widgetConfigs.splice(0, 1)[0];
        // this.widgetConfigs.splice(oldIndex, 0, conf);
        // this.renderWidgets();
    }

    resizeMouseEnter(event) {
        var resizeHandler = event.target.__resizeHandler;
        resizeHandler.hidden = false;
    }

    resizeMouseLeave(event) {
        var resizeHandler = event.target.__resizeHandler;
        resizeHandler.hidden = true;
    }


    __moveToFirst(arr, obj) {
        var index = arr.indexOf(obj);
        arr.unshift(arr.splice(index, 1)[0]);
        return index;
    }
    handleDrag(event, dragConfig) {
        var newRow = this._dragConfig.row + dragConfig.deltaYUnit;
        newRow = (newRow < 0) ? 0 : newRow;

        var newCol = this._dragConfig.column + dragConfig.deltaXUnit;
        var elWidth = this._dragConfig.config.width;
        newCol = (newCol < 0) ? 0 : newCol;
        newCol = ((newCol + elWidth) > this._maxColumns) ? (this._maxColumns - elWidth) : newCol;

        var widgets = this._dragConfig.widgets.map(function (conf) {
            return Object.assign({}, conf);
        });
        console.log('new row : ', newRow, ' new col : ', newCol);
        widgets[0].row = newRow;
        widgets[0].column = newCol;
        this.widgetConfigs = widgets;
        this.renderWidgets(widgets);
    }
    handleDragEnd(event, dragConfig) {
        console.log('dragging ending');
        event.stopPropagation();
        this.isRendering = false;
        this.classList.remove('is-dragging');
        // var oldIndex = this._dragConfig.dragElIndex;
        // var conf = this.widgetConfigs.splice(0, 1)[0];
        // this.widgetConfigs.splice(oldIndex,0,conf);
        this.widgetConfigs.sort(function (a, b) {
            if (a.row > b.row) {
                return 1;
            } else if (a.row < b.row) {
                return -1;
            } else if (a.column > b.column) {
                return 1;
            } else if (a.column < b.column) {
                return -1;
            } else {
                return 0;
            }
        });

        this.renderWidgets();
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
        if (oldVal === newVal || !newVal) {
            return;
        }

        this._maxColumns = this.config.columns || this.columns;
        this._maxColumns = this._maxColumns > 0 ? this._maxColumns : 1;

        this._widgetMargin = this.config.widgetMargin || 6;
        this._widgetQuery = this.config.widgetQuery || '*';

        this.getWidgetConfigFromDom();
        this.renderWidgets();
    }

    /**
   * handle Drag n Drop of widgets
   * 
   */

    _enableDraggingChanged() {
        if (this.widgetConfigs) {
            this.widgetConfigs.forEach(function (config) {
                var enableDrag = this.enableDragging && !config.disableDragging;
                if (enableDrag !== config._draggable.enableDrag) {
                    config._draggable.toggleDrag(enableDrag);
                }

            }.bind(this));
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


    handleDragStart(event, dragConfig) {
        this.classList.add('is-dragging');
        this.isRendering = true;

        var config = this.widgetConfigs.find(function (c) {
            return c.el === dragConfig.element;
        });
        var oldIndex = this.__moveToFirst(this.widgetConfigs, config);

        this._dragConfig = {
            config: config,
            row: config.row,
            widgets: this.widgetConfigs,
            column: config.column,
            dragElIndex: oldIndex
        }
        return true;
    }
}

window.customElements.define(OeWidgetContainer.is, OeWidgetContainer);