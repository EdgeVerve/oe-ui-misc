import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-menu-button/paper-menu-button.js";


/**
 * `oe-breadcrumb` component can be used as a navigation aid in user interfaces and it has been categorised in 2 ways:
 * 
 * 1.  Basic Breadcrumb navigation: When list has less than 4 elements, then the list is shown in a linear fashion way separated by '/'.
 *     e.g. Home / Sub Level 1 / Sub Level 2 
 * 2.  Collapse Breadcrumb navigation: When list has more than 3 elements, then between the first and last element menu icon appears.
 *     On click of menu icon, a dropdown with all the middle element appears. e.g. Home / ... / Sub Level 5
 *      
 * ### Styling

 * The following custom properties and mixins are available for styling:

 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--oe-breadcrumb-bcg-color` | Background color for breadcrumb list | `#ffffff` |
 * `--oe-breadcrumb-hover-color` | Hover color for item selected | `rgb(0, 107, 255,0.3)` |
 * `--oe-breadcrumb-lastData-color` | Last item color | `#808080` |
 * `--oe-breadcrumb-hover-text-color` | Text color on hovering the selected item | `rgb(0, 107, 255,1)` |
 *
 * @customElement
 * @polymer
 * @demo demo/demo-oe-breadcrumbs.html
 */
class OeBreadcrumb extends OECommonMixin(PolymerElement) {

  /**
   * Fired when an item from the breadcrumb is clicked
   * @event oe-breadcrumb-selected
   * @param {object} data object with values of label, path and full path on selection 
   */


  static get template() {
    return html`
      <style>
        .breadcrumb {
          padding: 10px 16px;
          list-style: none;
          background-color: var(--oe-breadcrumb-bcg-color, #ffffff);
          @apply --oe-breadcrumb;
        }
        .breadcrumb li {
          display: inline;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
          @apply --breadcrumb-item;
        }
        .breadcrumb li:hover {
          color: var(--oe-breadcrumb-hover-text-color, rgb(0, 107, 255,1));
          background-color: var(--oe-breadcrumb-hover-color, rgb(0, 107, 255,0.3));
          @apply --breadcrumb-item-hover;
        }
        .breadcrumb paper-item:hover {
          cursor: pointer;
          color: var(--oe-breadcrumb-hover-text-color, rgb(0, 107, 255,1));
          background-color: var(--oe-breadcrumb-hover-color, rgb(0, 107, 255,0.3));
          @apply --breadcrumb-paper-item-hover;
        }
        #last-data {
          color: var(--oe-breadcrumb-lastData-color,#808080);
          @apply --breadcrumb-item;
        }
        #last-data:hover{
          color: var(--oe-breadcrumb-hover-text-color, rgb(0, 107, 255,1));
          background-color:var(--oe-breadcrumb-hover-color, rgb(0, 107, 255,0.3));
          @apply --breadcrumb-item-hover;
        }
        .breadcrumb iron-icon {
          height: 16px;
          width: 16px;
          position: relative;
          top: 3px;
        }
        .breadcrumb paper-item {
          font-size: 14px;
        }
      </style>

      <ul class="breadcrumb">
      <template is="dom-if" if="{{_evaluateFirstItem}}">
        <li on-tap="_tapActionFirstItem">[[_firstItem.label]]</li> / 
      </template>
          <template is="dom-if" if="{{_isOverflow}}">
          <li>
          <paper-menu-button>
            <iron-icon icon="more-horiz" slot="dropdown-trigger"></iron-icon>
            <paper-listbox slot="dropdown-content">
              <template is="dom-repeat" id="middleElementList" items="{{_middleItems}}">
                <div class="OverflowSection">
                  <paper-item on-tap="_tapActionOnOverflow" raised>{{item.label}}</paper-item>
                </div>
              </template>
            </paper-listbox>
          </paper-menu-button>
          </li> / 
        </template>
        <template is="dom-if" if="{{_evaluateMidItem}}">
        <li on-tap="_tapActionMidItem">[[_midItem.label]]</li> /
        </template>
        <li id="last-data" on-tap="_tapActionLastItem">[[_lastItem.label]]</li>
      </ul>
    `;
  }

  static get properties() {
    return {

      /*Array of navigation objects with label and path strings*/
      list: {
        type: Array,
        value: function () {
          return [];
        },
        observer: '_computeList'
      }
    };
  }

  /**
   * Function that checks the lengthlengthlength of list and finds first, midle and last elemnts from a list
   */
  _computeList() {

    if (typeof this.list !== 'undefined' && this.list) {
      var bList = this.list;
      var arrayLength = bList.length;
      var _firstItem = '';
      var _lastItem = '';
      var _midItem = '';

      this.set("arrayLength", arrayLength);

      if (bList.length > 1)
        this.set("_evaluateFirstItem", true);
      if (bList.length > 3) this.set("_isOverflow", true);
      if (bList.length === 3) this.set("_evaluateMidItem", true);

      if (typeof bList[0] !== 'undefined' && bList[0] != null)
        _firstItem = bList[0];
      this.set("_firstItem", _firstItem);

      if (typeof bList[bList.length - 1] !== 'undefined' && bList[bList.length - 1] != null)
        _lastItem = bList[bList.length - 1];
      this.set("_lastItem", _lastItem);

      if (typeof bList[bList.length - 2] !== 'undefined' && bList[bList.length - 2] != null)
        _midItem = bList[bList.length - 2];
      this.set("_midItem", _midItem);

      var _middleItems = bList.slice(1, -1);
      this.set("_middleItems", _middleItems);
    }
  }


  /**
   * Fires oe-breadcrumb-selected event on selection of any item from the dropdown menu
   * 
   *  
   */
  _tapActionOnOverflow(e) {

    var index = e.model.index + 1;
    var fullPath = "";
    var label = e.model.item.label;
    var path = e.model.item.path;
    for (var i = 0; i <= index; i++) {
      fullPath += this.list[i].path;
    }
    this.fire("oe-breadcrumb-selected", {
      label: label,
      path: path,
      fullPath: fullPath
    });
  }

  /**
   * Fires oe-breadcrumb-selected event on selection of first item
   */
  _tapActionFirstItem() {

    var label = this._firstItem.label;
    var path = this._firstItem.path;
    var fullPath = "";
    this.fire("oe-breadcrumb-selected", {
      label: label,
      path: path,
      fullPath: path
    });
  }

  /**
   * Fires oe-breadcrumb-selected event on selection of middle item
   */
  _tapActionMidItem(e) {

    var index = this.arrayLength - 2;
    var label = this._midItem.label;
    var path = this._midItem.path;
    var fullPath = "";
    for (var i = 0; i <= index; i++) {
      fullPath += this.list[i].path;
    }
    this.fire("oe-breadcrumb-selected", {
      label: label,
      path: path,
      fullPath: fullPath
    });
  }

  /**
   *  Fires oe-breadcrumb-selected event on selection of last item
   * 
   */
  _tapActionLastItem() {
    
    var index = this.arrayLength - 1;
    var fullPath = "";
    var label = this._lastItem.label;
    var path = this._lastItem.path;
    for (var i = 0; i <= index; i++) {
      fullPath += this.list[i].path;
    }
    this.fire("oe-breadcrumb-selected", {
      label: label,
      path: path,
      fullPath: fullPath
    });
  }
}

window.customElements.define("oe-breadcrumb", OeBreadcrumb);
