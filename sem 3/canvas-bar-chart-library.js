export class BarChart {

    /** 
     * The canvas on which the histogram will be drawn
     */
    #canvas // # = atribut privat

    /**
     * Creates a new instance of the BarChart class
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas){
        this.#canvas = canvas;
    }

    /**
     * Draws the bar chart
     * @param {Array<Number>} values 
     */
    draw(values){
        const context = this.#canvas.getContext('2d')
        // context.fillStyle = 'grey';
        //context.fillStyle = '#DEDEDE'
        context.fillStyle = 'rgb(222, 222, 222)' //rgba(222, 222, 222, 0.5)
        context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

        context.fillStyle = 'red';
        const barWidth = this.#canvas.width / values.length;
        const maxValue = Math.max(...values);
        const f = this.#canvas.height / maxValue;

        context.strokeStyle = 'darkred';

        //context.textAlign = 'center';
       

        for (let i = 0; i < values.length; i++){
            const barX = i * barWidth;
            const barHeight = values[i] * f * 0.9;
            const barY = this.#canvas.height - barHeight;
            const text = values[i].toString();
            const textWidth = context.measureText(text).width;

            context.fillStyle = 'red';
            context.fillRect(barX + barWidth /4, barY, barWidth / 2, barHeight);
            context.strokeRect(barX + barWidth /4, barY, barWidth / 2, barHeight);

            context.fillStyle = 'black';
            //context.fillText(values[i], barX + barWidth /2, this.#canvas.height - 10);
            //context.fillText(values[i], barX + , this.#canvas.height - 10);
            context.fillText(text, barX + (barWidth - textWidth) / 2, this.#canvas.height - 10);

        }
    }
}