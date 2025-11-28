export class ImageEditor{
    #visibleCanvas
    #visibleCanvasCtx
    #offscreenCanvas
    #offscreenCanvasCtx
    #effect
    /**
     * Creates a new image editor.
     * @param {HTMLCanvasElement} visibleCanvas 
     */
    constructor(visibleCanvas){
        this.#visibleCanvas=visibleCanvas;
        this.#visibleCanvasCtx=this.#visibleCanvas.getContext('2d');
        this.#offscreenCanvas=document.createElement('canvas');
        this.#offscreenCanvasCtx=this.#offscreenCanvas.getContext('2d');

    }
    /**
     * 
     * @param {HTMLImageElement} img 
     */
    changeImage(img){
        //resize the two canvases to match the dimension of the image
        this.#visibleCanvas.width=this.#offscreenCanvas.width=img.naturalWidth;
        this.#visibleCanvas.height=this.#offscreenCanvas.height=img.naturalHeight;

        //draw the image on the offscreenCanvas
        this.#offscreenCanvasCtx.drawImage(img,0,0);

        //temporar
        this.#effect='normal';
        this.#drawImage();
        

    }
    /**
     * 
     * @param {string} effect 
     */
    changeEffect(effect){
        if(effect!=this.#effect){
            this.#effect=effect;
            this.#drawImage();
        }
    }

    #drawImage(){
        this.#visibleCanvasCtx.drawImage(this.#offscreenCanvas,0,0);
    }
}