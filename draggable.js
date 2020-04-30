class Draggable {

    constructor(el, options) {
        options = options || {};
        this.options = {
            preventDrag: options.preventDrag || null,
            disableDrag: options.disableDrag || false,
            dragUnit: options.dragUnit || 100,
            ondragClass: options.ondragClass || "current-dragging",
            dragStartFn: options.dragStartFn || null,
            dragFn: options.dragFn || null,
            dragEndFn: options.dragEndFn || null
        };
        this.dragEl = el;
        this.toggleDrag(!this.options.disableDrag);
    }

    toggleDrag(enableDrag) {
        this.enableDrag = enableDrag;
        this.dragEl.removeEventListener('dragstart', this._handleDragStart.bind(this));
        this.dragEl.removeEventListener('drag', this._handleDrag.bind(this));
        this.dragEl.removeEventListener('dragend', this._handleDragEnd.bind(this));
        if (!enableDrag) {
            this.dragEl.removeAttribute('draggable');
            return;
        }
        
        this.dragEl.addEventListener('mousedown', this.dragMousedown.bind(this));
        this.dragEl.addEventListener('mouseup', this.dragMouseup.bind(this));
        this.dragEl.addEventListener('dragstart', this._handleDragStart.bind(this));
        this.dragEl.addEventListener('drag', this._handleDrag.bind(this));
        this.dragEl.addEventListener('dragend', this._handleDragEnd.bind(this));
        
    }
    dragMousedown(event){
        if(this.options.preventDrag){
            var domRect = this.dragEl.getBoundingClientRect();
            var left = Math.abs(event.x - domRect.left);
            var right = Math.abs(event.x - domRect.right);
            var top = Math.abs(event.y - domRect.top);
            var bottom = Math.abs(event.y - domRect.bottom);
            if(left > this.options.preventDrag && right > this.options.preventDrag && top > this.options.preventDrag && bottom > this.options.preventDrag){
                this.dragEl.setAttribute('draggable', true);
                console.log(left);
                console.log(right);
                console.log(top);
                console.log(bottom);
                
            }
        }
        else{
            this.dragEl.setAttribute('draggable', true);
        }
    }
    dragMouseup(event){
        this.dragEl.removeAttribute('draggable');
    }

    updateOptions(options) {
        options = options || {};
        this.options = {
            preventDrag: options.preventDrag || this.options.preventDrag,
            disableDrag: options.disableDrag || this.options.disableDrag,
            dragUnit: options.dragUnit || this.options.dragUnit,
            ondragClass: options.ondragClass || this.options.ondragClass,
            dragStartFn: options.dragStartFn || this.options.dragStartFn,
            dragFn: options.dragFn || this.options.dragFn,
            dragEndFn: options.dragEndFn || this.options.dragEndFn
        };
    }

    _handleDragStart(event) {
        event.stopImmediatePropagation();
        this.dragEl.classList.add(this.options.ondragClass);
        this._dragConfig = {
            initScreenX: event.screenX,
            initScreenY: event.screenY,
            element: this.dragEl,
            deltaXUnit: 0,
            deltaYUnit: 0
        };
        this.options.dragStartFn && this.options.dragStartFn(event, this._dragConfig);
    }

    _handleDrag(event) {
        if(this._dragConfig){
            event.stopImmediatePropagation();
            var deltaX = event.screenX - this._dragConfig.initScreenX; //left
            var deltaY = event.screenY - this._dragConfig.initScreenY; //top

            var deltaXUnit = Math.round(deltaX / this.options.dragUnit);
            var deltaYUnit = Math.round(deltaY / this.options.dragUnit);

            var prevDeltaX = this._dragConfig.deltaXUnit;
            var prevDeltaY = this._dragConfig.deltaYUnit;

            if (prevDeltaX === deltaXUnit && prevDeltaY === deltaYUnit) {
                return;
            }

            if (Math.abs(deltaXUnit - prevDeltaX) > 2 || Math.abs(deltaYUnit - prevDeltaY) > 2) {
                return;
            }

            this._dragConfig.deltaXUnit = deltaXUnit;
            this._dragConfig.deltaYUnit = deltaYUnit;

            this.options.dragFn && this.options.dragFn(event, this._dragConfig);
        
        }

    }

    _handleDragEnd(event) {
            event.stopImmediatePropagation();
            this.dragEl.classList.remove(this.options.ondragClass);
            this.options.dragEndFn && this.options.dragEndFn(event, this._dragConfig);
            this.dragEl.removeAttribute('draggable');
    }
}

export default Draggable;