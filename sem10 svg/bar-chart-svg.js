export class BarChart {
    #svgns="http://www.w3.org/2000/svg"
    #svg

    /**
     * Creates a bar chart inside the given DOM element.
     * @param {HTMLElement} domElement 
     */
    constructor(domElement){
        this.#svg=document.createElementNS(this.#svgns,"svg");//svg este un standard precum HTML, iar metoda createElementNS creeaza elemente din standarde diferite de HTML
        
        this.#svg.style.border="1px solid black";
        this.#svg.style.backgroundColor="whitesmoke";
        this.#svg.style.width="600px";
        this.#svg.style.height="400px";

        domElement.appendChild(this.#svg);
    }
    /**
     * Displays the bar chart for the given data.
     * @param {Array<Object>} data 
     */
    draw(data){
        this.#svg.replaceChildren();//sterge continutul anterior al svg-ului

        //draw the new content
        const width=this.#svg.clientWidth;
        const height=this.#svg.clientHeight;

        const barWidth=width/data.length;
        const maxDataValue=Math.max(...data.map(item=>item.value));
        const f=height/maxDataValue;

        
        for(let i=0;i<data.length;i++){

            const barHeight=data[i].value*f*0.9;

            const barX=i*barWidth;
            const barY=height-barHeight;

            const bar=document.createElementNS(this.#svgns,"rect");
            bar.setAttribute("x",barX+(barWidth/4)
            );
            bar.setAttribute("y",barY);
            bar.setAttribute("width",barWidth/2);
            bar.setAttribute("height",barHeight);
            //bar.setAttribute("fill","STEELBLUE");
            bar.classList.add("bar");

            bar.addEventListener("click", () => {
    alert(data[i].label + " : " + data[i].value);
});

            

            

            this.#svg.appendChild(bar);
            const text=document.createElementNS(this.#svgns,"text");
            text.textContent=data[i].label;
            text.setAttribute("x",barX+(barWidth/2));
            text.setAttribute("y",this.#svg.clientHeight-5);
            text.setAttribute("text-anchor","middle");
            
            this.#svg.appendChild(text);

        }
    }
}