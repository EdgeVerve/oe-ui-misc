/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
* `OeSessionMixins` provides prebuilt methods to make Ajax calls with oe-ajax component
* 
*  
* @polymer
* @mixinFunction
*/
const SessionMixins = function (BaseClass) {
  /**
   * @polymer
   * @mixinClass
   */
  return class extends OECommonMixin(BaseClass) {
    static get properties() {
      return {
        session: {
          type: Object,
          value: function () {
            return sessionStorage;
          }
        }
      };
    }

  };
  
};
export const OeSessionMixins = dedupingMixin(SessionMixins);
