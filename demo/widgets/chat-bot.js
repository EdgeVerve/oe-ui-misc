/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */


import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toolbar/paper-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-scroll-header-panel/paper-scroll-header-panel.js';
/**
 * `chat-bot`
 *  Chat Element.
 *
 * @customElement
 * @polymer
 * 
 */
class ChatBot extends PolymerElement {
  static get is() {
    return 'chat-bot';
  }
  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment"></style>
    <style>
      :host {
        display: block;
        position: relative;
      }

      input {
        height: 40px;
        border-radius: 2px;
      }

      paper-toolbar {
        background: var(--primary-color);
        color: #fff;
      }

      .input-container {
        background: var(--primary-color);
        height: 52px;
        padding: 0 16px;
        color: #fff;
      }

      iron-autogrow-textarea {
        height: 36px;
        font-size: 14px;
        border-radius: 4px;
        border: none;
        background: #fff;
        color: var(--primary-text-color);
        --iron-autogrow-textarea: {
          padding: 4px 16px;
          box-sizing: border-box;
          outline: none;
        }

        @apply --chat-bot-input;
      }

      .messages-container {
        min-height: 320px;
        height: calc(100% - 115px);
        overflow-x: hidden;
        overflow-y: auto;
        padding: 16px;
        box-sizing: border-box;
        background: #efefef;

        @apply --chat-bot-container;
      }

      .message {
        padding: 12px;
        margin: 12px 0;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
        word-break: break-word;
      }

      .user {
        @apply --layout-end-justified;
      }

      .robot .message {
        background: #fff;
        border-radius: 4px 4px 4px 0;
      }

      .robot .message::before {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 0;
        border-color: #fff transparent transparent;
        position: absolute;
        bottom: -10px;
        left: 0;
      }

      .user .message {
        border-radius: 4px 4px 0;
        background: var(--light-primary-color);
      }

      .user .message::before {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 10px 10px 0;
        border-color: transparent var(--light-primary-color) transparent transparent;
        position: absolute;
        bottom: -10px;
        right: 0;
      }

    </style>
    <paper-toolbar>
      <div class="title" slot="top">[[title]]</div>
    </paper-toolbar>
    <paper-scroll-header-panel id="scrollContainer" main fixed class="messages-container">
      <div>
        <template is="dom-repeat" items="{{messages}}">
          <!-- inner-h-t-m-l is the trick to allow safe html injection -->
          <div class$="message-box flex layout horizontal {{item.user}}"><span class="message" inner-h-t-m-l=[[_getMessage(item.message)]]></span></div>
        </template>
      </div>
    </paper-scroll-header-panel>
    <div class="input-container layout horizontal center">
      <iron-autogrow-textarea max-rows=2 class="flex" on-keydown="onEnter" bind-value="{{userMessage}}" placeholder="Type here.."
        id="input"></iron-autogrow-textarea>
      <paper-icon-button icon="icons:send" on-tap="sendMessage" class="send-btn"></paper-icon-button>
    </div>
    `;
  }
  static get properties() {
    return {
      messages: {
        type: Array,
        value: function () {
          return [];
        }
      },

      /**
           Title of the ChatBot 
           */
      title: {
        type: String,
        value: 'Chat Bot'
      },

      /**
           Initial greet message
           */
      initialMessage: {
        type: String,
        value: 'Hi, How can I help you?'
      },

      /**
           Url to post/fetch the messages 
           */
      url: {
        type: String
      }
    };
  }
  /**
  * Fuction invoked in connected callback.
  */
  /*global someFunction attachedFun:true*/
  /*eslint no-undef: "error"*/
  attachedFun() {
    if (this.initialMessage && this.initialMessage.trim() != '') {
      this.push('messages', {
        'user': 'robot',
        'message': this.initialMessage
      });
    } else {
      this.push('messages', {
        'user': 'robot',
        'message': 'Hi, How can I help you?'
      });
    }
  }
  /**
  * Connected callback to handle templating if custom template is present.
  */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', e => attachedFun());
  }
  onEnter(event) {
    if (event.which == 13 || event.keyCode == 13) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  _getMessage(msg) {
    if (msg.indexOf('http://') >= 0) {
      var splits = msg.split(' ');
      splits = splits.map(function (part) {
        if (part.startsWith('http://')) {
          part = '<a href="' + part + '" target="_blank">Results</a>';
        }
        return part;
      });
      msg = splits.join(' ');
    }
    return msg;
  }
  sendMessage() {
    if (!this.url) return;
    if (!this.userMessage || this.userMessage.trim() == '') return;
    this.push('messages', {
      'user': 'user',
      'message': this.userMessage
    });
    var message = this.userMessage;
    this.$.input.selectionStart = 0;
    this.$.input.selectionEnd = 0;
    this.set('userMessage', '');
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var message = xhr.responseText;
        self.push('messages', {
          'user': 'robot',
          'message': message
        });
        Polymer.dom.flush();
        //self.$.messageList.scrollTop  = self.$.messageList.scrollHeight;
        self.$.scrollContainer.scroll(self.$.scrollContainer.scroller.scrollHeight, true);
      }
    };
    xhr.open('POST', this.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=encoding');
    var body = {
      'message': message
    };
    xhr.send(JSON.stringify(body));
  }
}

window.customElements.define(ChatBot.is, ChatBot);
