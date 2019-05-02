class Draggable {

    constructor(el,options){
        options = options || {}
        this.options = {
            disableDrag : options.disableDrag || false,
            dragUnit : options.dragUnit || 100,
            ondragClass : options.ondragClass || "current-dragging",
            dragStartFn:options.dragStartFn || null,
            dragFn:options.dragFn || null,
            dragEndFn:options.dragEndFn || null
        }
        this.dragEl = el;
        this.toggleDrag(!this.options.disableDrag);
    }

    toggleDrag(enableDrag){
        this.enableDrag = enableDrag;
        this.dragEl.removeEventListener('dragstart',this._handleDragStart.bind(this));
        this.dragEl.removeEventListener('drag',this._handleDrag.bind(this));
        this.dragEl.removeEventListener('dragend',this._handleDragEnd.bind(this));
        if(!enableDrag){
            this.dragEl.removeAttribute('draggable');
            return;
        }
        this.dragEl.setAttribute('draggable',true);
        this.dragEl.addEventListener('dragstart',this._handleDragStart.bind(this));
        this.dragEl.addEventListener('drag',this._handleDrag.bind(this));
        this.dragEl.addEventListener('dragend',this._handleDragEnd.bind(this));
    }

    updateOptions(options){
        options = options || {}
        this.options = {
            disableDrag : options.disableDrag || this.options.disableDrag,
            dragUnit : options.dragUnit || this.options.dragUnit,
            ondragClass : options.ondragClass || this.options.ondragClass,
            dragStartFn:options.dragStartFn || this.options.dragStartFn,
            dragFn:options.dragFn || this.options.dragFn,
            dragEndFn:options.dragEndFn || this.options.dragEndFn
        }
    }

    _handleDragStart(event){
        event.stopImmediatePropagation();
       
        this.dragEl.classList.add(this.options.ondragClass);
        this._dragConfig = {
            initScreenX : event.screenX,
            initScreenY : event.screenY,
            element:this.dragEl,
            deltaXUnit : 0,
            deltaYUnit : 0
        }

        this.options.dragStartFn && this.options.dragStartFn(event,this._dragConfig);
    }

    _handleDrag(event){
        event.stopImmediatePropagation();
        var deltaX = event.screenX - this._dragConfig.initScreenX; //left
        var deltaY = event.screenY  - this._dragConfig.initScreenY ; //top
        
        var deltaXUnit = Math.round(deltaX/this.options.dragUnit);
        var deltaYUnit = Math.round(deltaY/this.options.dragUnit);
        
        var prevDeltaX = this._dragConfig.deltaXUnit;
        var prevDeltaY = this._dragConfig.deltaYUnit;

        if(prevDeltaX === deltaXUnit && prevDeltaY === deltaYUnit){
            return;
        }

        if(Math.abs(deltaXUnit - prevDeltaX) > 2 || Math.abs(deltaYUnit - prevDeltaY) > 2){
            return;
        }

        this._dragConfig.deltaXUnit = deltaXUnit;
        this._dragConfig.deltaYUnit = deltaYUnit;

        this.options.dragFn && this.options.dragFn(event,this._dragConfig);

    }

    _handleDragEnd(event){
        event.stopImmediatePropagation();
        
        this.dragEl.classList.remove(this.options.ondragClass);
        this.options.dragEndFn && this.options.dragEndFn(event,this._dragConfig);
    }
}

export default Draggable;