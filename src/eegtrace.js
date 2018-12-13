

class EegTrace {

    constructor (holder, opts) {
        if (holder instanceof HTMLElement) {
            this.holder = holder;
        }
        else {
            this.holder = document.getElementById(holder);
        }
        // Some default values for the options
        opts = {...opts};

        this.bufferLen  = opts.bufferLen || 1000;
        this.range      = opts.range || 500.0;
        this.bgcolor    = opts.gbcolor || "#edf9f9";
        this.traceColor = opts.traceColor || "#24a001";
        this.olColor    = opts.olColor || "#ff2a00";
        this.height     = opts.height || 200;
        this.width      = opts.width || 1000;

        // Build the main wrapper
        this.wrapper = document.createElement("div");
        this.holder.appendChild(this.wrapper);
        this.wrapper.style.position = "relative";
        this.wrapper.classList.add("eegtrace");
        this.wrapper.style.display = "block";
        this.wrapper.style.width = this.width;
        this.wrapper.style.height = this.height;

        // Build the time series canvas
        this.graph = document.createElement("canvas");
        this.wrapper.appendChild(this.graph);
        this.graph.height = this.height;
        this.graph.width = this.width;
        this.graph.style.height = this.height;
        this.graph.style.width = this.width;
        this.graph.style.position = "absolute";
        this.graph.style.top = "0px";
        this.graph.style.left = "0px";
        this.graph.style.background = this.bgcolor;
        this.ctx = this.graph.getContext('2d');

        // Build the overlay canvas
        this.overlay = document.createElement("canvas");
        this.wrapper.appendChild(this.overlay);
        this.overlay.height = this.height;
        this.overlay.width = this.width;
        this.overlay.style.height = this.height;
        this.overlay.style.width = this.width;
        this.overlay.style.position = "absolute";
        this.overlay.style.top = "0px";
        this.overlay.style.left = "0px";
        this.olCtx = this.overlay.getContext("2d");

        // Allocate the databuffer
        this.databuffer = new Array(this.bufferLen).fill(0.0);
        // Draw the overlay
        this.drawOl();
    }

    drawOl () {
        this.olCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.olCtx.font = 'x-small "Courier New" sans-serif';
        this.olCtx.strokeStyle = this.olColor;

        // Draw upper text
        this.olCtx.strokeText(this.range.toString() + " uV", 5, 10);

        // Draw zero line
        this.olCtx.strokeText("0 uV", 5, (this.overlay.height / 2) - 5);
        this.olCtx.beginPath();
        this.olCtx.moveTo(0, this.overlay.height / 2);
        this.olCtx.lineTo(this.overlay.width, this.overlay.height / 2);
        this.olCtx.stroke();

        // Draw lower text
        this.olCtx.strokeText("- " + this.range.toString() + " uV", 5, this.overlay.height - 5);
    }

    scale (newscale) {
        if (newscale instanceof Number) {
            this.range = newscale;
            this.drawOl();
        }
    }

    plot () {
        const xStep = this.graph.width / this.databuffer.length;

        this.ctx.clearRect(0, 0, this.graph.width, this.graph.height);
        this.ctx.strokeStyle = this.traceColor;

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.graph.height / 2);

        this.databuffer.forEach((val, idx) => {
            val = (this.graph.height / 2) - val;
            this.ctx.lineTo(idx * xStep, val);
        });

        this.ctx.stroke();
    }

    update (newvals) {
        this.databuffer.splice(0, newvals.length);
        this.databuffer.push(...newvals.map((val) => val * (this.graph.height / 2 / this.range)));
    }

}

export default EegTrace;