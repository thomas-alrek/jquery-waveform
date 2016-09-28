(function($) {

    function waveform(canvas, options){

        var ctx = canvas.getContext("2d");
        
        var waveObj = this;

        var data = options.data[options.dataIndex];
        var width = canvas.width;
        var height = canvas.height;
        var center = (height / 2);
        var ratio = 0;
        var cursor;
        var playback;
        var audio;

        if(options.softclip){
            var largest = Math.max.apply(Math, data);
            var ratio = 1 - largest;

            if(largest > 1){
                largest = 1;
            }
        }
        function bind(){
            $(window).resize(function(){
                resize(false);
            });
            $(canvas).click(function(event){
                options.onClick(event, options);
            });
            $(canvas).mousemove(function(event){
                mouseMove(event, options.onMouseMove);
            });
            $(canvas).mouseout(function(event){
                cursor = {x: 0, y: 0};
                render();
                if(typeof options.onMouseOut === 'function'){
                    options.onMouseOut(event);
                }
            });
            if(typeof options.audio !== 'undefined'){
                audio = options.audio.get(0);
                audio.ontimeupdate = function(e){
                    playback = {x: this.currentTime * canvas.width / this.duration};
                    render();
                }
            };
        }

        function resize(initial){
            if(!initial){
                options.width = $(canvas).outerWidth();
                options.height = $(canvas).outerHeight();
            }
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

            cursor = {x: e.offsetX, y: e.offsetY};
            render();

            if(typeof callback === 'function'){
                callback(e);
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

        function render(){

            clear();

            if(typeof cursor === 'undefined'){
                cursor = 0;
            }
            
            if(typeof playback === 'undefined'){
                playback = {
                    x: 0.0
                }
            }

            for(var x = 0; x < (width * options.offset); x += options.offset){

                var sample = data[clamp(x, data.length, width)];
                sample += ratio;

                /* Clip the sample */
                if(sample > 1){
                    sample = 1;
                }

                ctx.beginPath();
                ctx.lineWidth = options.lineWidth;
                ctx.moveTo(x, center + center * (sample));
                ctx.lineTo(x, center - center * (sample));

                ctx.strokeStyle = options.color;
                if(options.cursor && cursor.x > 0 && x <= cursor.x){
                    if(options.cursor){
                        if(cursor.x > playback.x){
                            ctx.strokeStyle = options.cursorColor;   
                        }
                    }
                }
                if(typeof audio !== 'undefined'){
                    if (audio.duration > 0 && !audio.paused) {
                        if(playback.x > 0 && x <= playback.x){
                            ctx.strokeStyle = options.indicatorColor;
                        }
                        if(options.cursor){
                            if(x > 0 && cursor.x <= x + options.offset / 2 && cursor.x >= x - options.lineWidth / 2){
                                ctx.strokeStyle = options.scrubColor;                       
                            }
                        }
                    }else{
                        ctx.strokeStyle = options.cursorColor;
                    }
                }else{
                    if(options.cursor){
                        if(x > 0 && cursor.x <= x + options.offset / 2 && cursor.x >= x - options.lineWidth / 2){
                            ctx.strokeStyle = options.scrubColor;                       
                        }
                    }
                }

                ctx.stroke();
            }

        };

        init(true);

    }

    $.fn.waveform = function(options) {

        var settings = $.extend({
            color: "rgba(55,55,55,1)",
            backgroundColor: "transparent",
            scrubColor: "rgba(0,0,0,1)",
            indicatorColor: "rgba(240,80,111,1)",
            cursorColor: "rgba(131,131,131,1)",
            cursor: false,
            width: this.width,
            height: this.height,
            softclip: false,
            lineWidth: 3,
            offset: 4,
            onClick: function(e, waveObj){
                if(typeof options.audio !== 'undefined'){
                    var audio = $(options.audio).get(0);
                    if (audio.duration > 0 && !audio.paused) {
                        var x = e.offsetX;
                        x = (audio.duration / waveObj.width * x);
                        audio.currentTime = x;
                    }else{
                        audio.play();
                    }
                }
            },
            onMouseMove: function(){},
            audio: undefined,
            data: {
                "left": [0]
            },
            dataIndex: "left"
        }, options);

        waveform(this.get(0), settings);
        return this;
    };

}(jQuery));