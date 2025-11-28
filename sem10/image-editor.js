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
        //this.#visibleCanvasCtx.drawImage(this.#offscreenCanvas,0,0);
        switch(this.#effect){
            case 'normal':
                this.#normal();
                break;
            case 'grayscale':
                this.#grayscale();
                break;
    }
}
#normal(){
    this.#visibleCanvasCtx.drawImage(this.#offscreenCanvas,0,0);
}
#grayscale(){
    const width=this.#offscreenCanvas.width;
    const height=this.#offscreenCanvas.height;
    const imageData=this.#offscreenCanvasCtx.getImageData(0,0,width,height);
    const data=imageData.data; //Uint8ClampedArray
    for(let i=0;i<data.length;i+=4){
        const r=data[i];
        const g=data[i+1];
        const b=data[i+2];
        
        const gray=0.299*r+0.587*g+0.114*b;
        data[i]=data[i+1]=data[i+2]=gray;
    }
    this.#visibleCanvasCtx.putImageData(imageData,0,0);
}
}