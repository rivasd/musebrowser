class EegTrace {

    constructor(canvas, bufferLen) {
        if( canvas instanceof HTMLCanvasElement){
            this.canvas = canvas;
        }
        else{
            this.canvas = document.getElementById(canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.databuffer = new Array(bufferLen).fill(0.0);
    }

    plot(){
        var maxval = Math.max(...this.databuffer.map(val => Math.abs(val)));
        var buffer = this.databuffer.map(val => val *((this.canvas.height /2) / maxval));
        var x_step = this.canvas.width / this.databuffer.length;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "#FF0000";

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);

        buffer.forEach((val, idx) => {

            val = (this.canvas.height /2) - val;
            this.ctx.lineTo((idx * x_step), val);
        });

        this.ctx.stroke();
    }

    update(newvals) {
        this.databuffer.splice(0, newvals.length);
        this.databuffer.push(...newvals);
    }
}

export default EegTrace;