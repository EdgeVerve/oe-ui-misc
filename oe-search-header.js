/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import {html, PolymerElement} from "@polymer/polymer/polymer-element.js";

/**
 * `oe-search-header`
 * 
 *
 * @customElement
 * @polymer
 * 
 */
class OeSearchHeader extends PolymerElement {
  static get is() {
    return 'oe-search-header';
  }
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: relative;
    }
    /*Heading search style start */

    .heading {
      height: 48px;
      padding: 0px 16px;
      font-family: Roboto !important;
      font-size: 14px;
      font-weight: 400;
      position: relative;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .heading .close-icon {
      cursor: pointer;
    }

    #search {
      display: none;
      width: calc(100% - 25px);
    }

    #search #input {
      border: none;
      border-bottom: 2px solid var(--default-text-color);
      font-size: 14px;
      outline: none;
      width: 0px;
      background: inherit;
      padding: 5px 0px;
      margin: 0px;
      color: var(--default-text-color);
    }

    .heading.search-active .heading-title {
      display: none;
    }

    .heading.search-active #search input {
      padding: 10px;
      width: calc(100% - 23px) !important;
      transition: all 0.30s ease-in-out;
    }

    .search-active #search {
      display: inline-block;
    }

    #searchIcon.active-icon {
      color: var(--default-primary-color);
    }

    iron-icon {
      --iron-icon-width: 18px;
      --iron-icon-height: 18px;
    }
    /*Heading search style end*/
  </style>
  <template>
    <div class="heading flex layout horizontal justified center" id="searchableHeader">
      <div class="heading-title flex center layout horizontal justified">
        <slot></slot>
      </div>
      <div id="search">
        <input type="search" id="input" on-blur="disableSearch" bind-value="{{filterVal}}" autocomplete="off" is="iron-input">
        <iron-icon icon="icons:clear" on-tap="clearSearch" class="close-icon"></iron-icon>
      </div>
      <div>
        <iron-icon icon="icons:search" on-tap="toggleSearch" id="searchIcon"></iron-icon>
      </div>
    </div>
    `;
  }
  static get properties() {
    return {
      filterVal: {
        type: String,
        notify: true
      }
    };
  }
  toggleSearch() {
    var isSearchActive = this.$.searchableHeader.classList.contains('search-active');
    if (isSearchActive) {
      this.disableSearch();
    } else {
      this.$.searchableHeader.classList.add('search-active');
      this.$.input.focus();
    }
  }
  disableSearch() {
    if (this.$.input.value.length > 0) {
      this.$.searchIcon.classList.add('active-icon');
    } else {
      this.$.searchIcon.classList.remove('active-icon');
      this.$.searchableHeader.classList.remove('search-active');
    }
  }
  clearSearch() {
    this.set('filterVal', '');
    this.disableSearch();
  }
}

window.customElements.define(OeSearchHeader.is, OeSearchHeader);
