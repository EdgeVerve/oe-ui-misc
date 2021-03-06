/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */


import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

/**
 * `oe-carousel`
 *  Caraousel Control based on neon-animations
 *
 * @customElement
 * @polymer
 */
class OeCarousel extends PolymerElement {
  static get is() {
    return 'oe-carousel';
  }
  static get template() {
    return html`
    <style>
    #carousel {
      width: 100%;
      height: 100%;
      position: relative;

      @apply --layout-flex;
      @apply --layout-vertical;
      @apply --layout-start;
      @apply --layout-center;
    }

    #carousel-container {
      display: block;
      position: relative;
      width: 100%;
      height: calc(100% - 32px);

      @apply --carousel-container-mixin;
    }

    .carousel-element-container {
      height: 100%;
      overflow: hidden;

      @apply --carousel-element-container-mixin;
    }

    neon-animated-pages {
      height: 100%;
      width: 100%;
    }

    #carousel-dots-container {
      position: relative;
      height: 32px;

      @apply --dots-container-mixin;
    }

    .dot {
      border-radius: 5px;
      margin: 5px;
      height: 8px;
      width: 8px;
      cursor: pointer;
      background-color: rgba(100, 100, 100, 0.5);

      @apply --dots-mixin;
    }

    .dot.iron-selected {
      background-color: var(--active-dot-background-color, #444);
    }

    .carousel-arrow-container {
      position: absolute;
      cursor: pointer;
      top: 50%;
      z-index: 1;

      @apply --carousel-arrow-container-mixin;
    }

    .carousel-arrow-container .arrow-icon {
      @apply --carousel-arrow-mixin;
    }

    .left-arrow {
      left: 0;
    }

    .right-arrow {
      right: 0;
    }

    .carousel-arrow-container[disabled] {
      pointer-events: none;
    }

  </style>
  <div id="carousel">
    <div id="carousel-container">
      <template is="dom-if" if="{{showArrows}}">
        <div class="carousel-arrow-container left-arrow" on-tap="_handlePrevArrowClicked">
          <paper-fab mini class='arrow-icon' icon="icons:chevron-left"></paper-fab>
        </div>
      </template>
      <div class="carousel-element-container">
        <neon-animated-pages class="layout horizontal center" id="pages" selected="{{selectedIndex}}" on-track="_swipeChange">
          <slot></slot>
        </neon-animated-pages>
      </div>
      <template is="dom-if" if="{{showArrows}}">
        <div class="carousel-arrow-container right-arrow" on-tap="_handleNextArrowClicked">
          <paper-fab mini class='arrow-icon' icon="icons:chevron-right"></paper-fab>
        </div>
      </template>
    </div>
    <template is="dom-if" if="{{showDots}}">
      <iron-selector selected="{{selectedIndex}}" class="layout horizontal center" id="carousel-dots-container">
        <template is="dom-repeat" items="[[items]]">
          <div class="dot" on-tap="_carouselDotClicked"></div>
        </template>
      </iron-selector>
    </template>
  </div>
    `;
  }
  static get properties() {
    return {
      /*show scroll arrows*/
      showArrows: {
        type: Boolean,
        value: false
      },

      /*show dots to choose items*/
      showDots: {
        type: Boolean,
        value: false
      },

      /*Timeout in milliseconds before items are auto-scrolled to next*/
      timeout: {
        type: Number,
        value: 5000
      },
      selectedIndex: {
        type: Number,
        notify: true,
        value: 0
      },
      items: {
        type: Array,
        value: function () {
          return [];
        }
      }

    };
  }
  /**
  * Fuction invoked in connected callback.
  */
  /*global someFunction pushAttachedFun:true*/
  /*eslint no-undef: "error"*/
  pushAttachedFun() {
    var items = [];
    [].map.call(this.$.pages.children, function (obj) {
      if (obj.nodeType == Node.ELEMENT_NODE) {
        items.push(items.length);
      }
    });
    this.set('items', items);
    this.set('selectedIndex', 0);
    this._resetTimer();
  }
  /**
   * Connected callback to handle templating if custom template is present.
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', e => pushAttachedFun());
  }
 
  /**
   * Disconnected callback to remove the event listener.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timeoutHandle);
    this.removeEventListener('change',e => this.pushAttachedFun());
  }
  _resetTimer() {
    if (this.timeout > 0) {
      clearTimeout(this._timeoutHandle);
      this._timeoutHandle = setTimeout((function () {
        this.showNext();
        this._resetTimer();
      }).bind(this), this.timeout);
    }
  }
  _carouselDotClicked(event) {
    var index = event.model.index;
    if (index > this.selectedIndex) {
      this.$.pages.set('entryAnimation', 'slide-from-right-animation');
      this.$.pages.set('exitAnimation', 'slide-left-animation');
    } else {
      this.$.pages.set('entryAnimation', 'slide-from-left-animation');
      this.$.pages.set('exitAnimation', 'slide-right-animation');
    }
    this._resetTimer();
  }
  _handlePrevArrowClicked(e) { // eslint-disable-line no-unused-vars
    this._resetTimer();
    this.$.pages.set('entryAnimation', 'slide-from-left-animation');
    this.$.pages.set('exitAnimation', 'slide-right-animation');
    this.selectedIndex = this.selectedIndex === 0 ? (this.items.length - 1) : (this.selectedIndex - 1);
  }
  _handleNextArrowClicked(e) { // eslint-disable-line no-unused-vars
    this._resetTimer();
    this.showNext();
  }
  showNext() {
    this.$.pages.set('entryAnimation', 'slide-from-right-animation');
    this.$.pages.set('exitAnimation', 'slide-left-animation');
    this.selectedIndex = this.selectedIndex === (this.items.length - 1) ? 0 : (this.selectedIndex + 1);
  }
  _swipeChange(e) {
    if (e.detail.dx > 0) {
      this.debounce('previousItem', function () {
        this._handlePrevArrowClicked(e);
      }, 300);
    } else if (e.detail.dx < 0) {
      this.debounce('previousItem', function () {
        this._handleNextArrowClicked(e);
      }, 300);
    }
  }

}

window.customElements.define(OeCarousel.is, OeCarousel);
