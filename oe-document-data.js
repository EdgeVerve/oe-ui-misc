/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { OEAjaxMixin } from "oe-mixins/oe-ajax-mixin.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";


/**
 * `oe-document-data`
 *
 * @customElement
 * @polymer
 * @appliesMixin OEAjaxMixin
 * @appliesMixin OECommonMixin
 * 
 */
class OeDocumentData extends OECommonMixin(OEAjaxMixin(PolymerElement)) {
  static get is() {
    return 'oe-document-data';
  }
  static get template() {
    return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
    <style>
    /* CSS rules for your element */
    .no-display {
        display: none;
    }

    </style>

    <div class="flex layout center horizontal">
        <template is="dom-if" if="[[showInput]]">
            <paper-input label=[[label]] id="input" value={{document.documentName}}></paper-input>
        </template>
        <template is="dom-if" if="[[!showInput]]">
            <span on-tap="download">{{document.documentName}}</span>
            <a id="downloadDocument" class="no-display" download="{{document.documentName}}" target="_new"></a>
        </template>
        <paper-button raised on-tap="openFile">BROWSE</paper-button>
        <input id="fileBrowse" class="no-display" type="file" on-change="getFile">
    </div>
    `;
  }
  static get properties() {
    return {
      /**
       * Object which contains documentName and documentData property.
       */
      document: {
        type: Object,
        notify: true
      },
      /**
       * Property of type string and has a documentSet as an observer.
       */
      documentId: {
        type: String,
        observer: documentSet
      },
      /**
       * URL used in makeAjaxcall.
       */
      documentPostUrl: {
        type: String
      },
      /**
       * Name of relation.
       */
      relationName: {
        type: String
      },
      /**
       * property of type string.
       */
      documentParentAttribute: {
        type: String
      },
      /**
       * It is parameter for documentSet method.
       */
      parentId: {
        type: String
      }
    };
  }
  /*global someFunction documentSet:true*/
  /*eslint no-undef: "error"*/
  documentSet(parentId) {
    var self = this;
    this.set('showInput', false);
    // call to get documentName
    
    if (self.documentPostUrl) {
      if (self.domHost && self.domHost[self.documentParentAttribute]) {
        parentId = self.domHost[self.documentParentAttribute]["id"];
        var filter = {};
        filter = {
          "include": {
            "relation": self.relationName
          },
          "scope": {
            "fields": ["documentName"]
          }
        };
        self.makeAjaxCall(this.documentPostUrl, 'get', null, "no-cache", { "filter": filter }, 'json',
          function (err, response) {
            if (err) {
              self.fire("oe-show-error", "Error getting file data");
            }
            else {
              var res = response;
              var documentName = res[self.relationName]["documentName"];
              if (!self.document) {
                self.document = {};
              }
              self.set("document.documentName", documentName);
            }
          });
        // ajax.addEventListener('error', function (err) {
        //   console.log(err);
        //   
        // });
        // ajax.generateRequest();
      }
      else {
        return;
      }
    }
  }
  openFile(event) {
    this.$.fileBrowse.value = "";
    this.querySelector("#fileBrowse").click();
  }
  getFile(event) {
    var self = this;
    var document = {};
    this.file = event.target.files[0];
    document.documentName = this.file.name;
    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = function (e) {
      document.documentData = reader.result;
      self.set('document', document);
    };
    reader.onerror = function (error) {
      self.fire("oe-show-error", "Error reading file");
      console.log('Error: ', error);
    };
  }
  download(parentId) {
    // TODO 
    // call to get documentData
    var self = this;
    // call to get documentName
    if (self.documentPostUrl) {
      // need to get id of decision table element
      parentId = self.domHost[self.documentParentAttribute]["id"];
      var filter = {};
      filter = {
        "include": {
          "relation": self.relationName
        },
        "scope": {
          "fields": ["documentName"]
        }
      };
      self.makeAjaxCall(this.documentPostUrl, 'get', null, "no-cache", { "filter": filter }, null,
        function (err, response) {
          if (err) {
            self.fire("oe-show-error", "Error getting file data");
          }
          else {
            var res = response;
            var documentData = res[self.relationName]["documentData"];
            self.set("document.documentData", documentData);
            self.querySelector("#downloadDocument").setAttribute("href", documentData);
            self.querySelector("#downloadDocument").click();
          }
        });
      // ajax.addEventListener('error', function (err) {
      //   console.log(err);
      //  
      // });
      // ajax.generateRequest();
    }
  }
  showInput() {
    var ret = true;
    if (this.documentId) {
      ret = false;
    }
    
    return ret;
  }
  // showLink() {
  //   var ret = false;
  //   if (this.documentId) {
  //     ret = true;
  //   }
  //   return ret;
  // }
}
window.customElements.define(OeDocumentData.is, OeDocumentData);
