(function($) {

    function waveform(canvas, options){

        var ctx = canvas.getContext("2d");

        var data = options.data;
        var width = canvas.width;
        var height = canvas.height;
        var center = (height / 2);
        var ratio = 0;

        if(options.softclip){
            var largest = Math.max.apply(Math, data);
            var ratio = 1 - largest;

            if(largest > 1){
                largest = 1;
            }
        }
        function bind(){
            $(window).resize(resize);
            $(canvas).click(options.onClick);
            $(canvas).mousemove(function(event){
                mouseMove(event, options.onMouseMove);
            });
            $(canvas).mouseout(function(event){
                render({x: 0});
            });
        }

        function resize(){
            console.log("Resize triggered");
            canvas.width = options.width;
            canvas.height = options.height;
            canvas.setAttribute("width", options.width.toString());
            canvas.setAttribute("height", options.height.toString());
            width = canvas.width;
            height = canvas.height;
            center = (height / 2);
            render();
        }

        function init(){
            bind();
            resize();
            render();
        };

        function mouseMove(e, callback){

            render({x: e.pageX, y: e.pageY});

            if(typeof callback === 'function'){
                callback();
            }
        }

        function clear(){
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = options.color;
        }

        function clamp(val, source, max){
            var ratio = max / source;
            return Math.floor(val / ratio);
        }

        function render(cursor){

            clear();

            if(typeof cursor === 'undefined'){
                cursor = 0;
            }

            for(var x = 0; x < (width * options.offset); x += options.offset){

                var sample = data[clamp(x, data.length, width)];
                sample += ratio;

                /* Clip the sample */
                if(sample > 0.99){
                    sample = 0.99;
                }

                ctx.beginPath();
                ctx.lineWidth = options.lineWidth;
                ctx.moveTo(x, center + center * (sample));
                ctx.lineTo(x, center - center * (sample));
                if(options.cursor && cursor.x > 0 && x <= cursor.x){
                    ctx.strokeStyle = options.cursorColor;
                }else{
                    ctx.strokeStyle = options.color;
                }
                ctx.stroke();
            }

        };

        init();

    }

    $.fn.waveform = function(options) {

        var settings = $.extend({
            color: "#fff",
            backgroundColor: "#000",
            width: this.width,
            height: this.height,
            lineWidth: 4,
            offset: 10,
            onClick: function(){},
            onMouseMove: function(){}
        }, options);

        waveform(this.get(0), settings);
        return this;
    };

}(jQuery));