var vm = new Vue({
    el: '#app',
    data: {
        width:20,
        height:20,
        padding:4
    },
    methods: {
        drawShape: function () {
            // Check for not allowing user to voilate padding rule
            if (this.padding % 2 !== 0 || this.padding < 4 ||this.padding > 60) {
                alert (`Padding value should be even and greater or equal to 4 and less than or equal 60, ${this.padding} given`)
                return;
            }

            // Check for not allowing user to voilate height rule
            if (this.height % 2 !== 0  || this.height < 20 || this.height > 300) {
                alert(`Height value should be even and greater or equal to 20 and less than or equal 300 ${this.height} given`)
                return;
            }

            // Check for not allowing user to voilate width rule
            if (this.width % 2 !== 0  || this.width < 20 || this.width > 300) {
                alert(`Width value should be even and greater or equal to 20 and less than or equal 300 ${this.width} given`)
                return;
            }

            // this metod gives you the cordinates 2D array
            const pixelArray  = this.makeShape(+this.width, +this.height , +this.padding);

            // we used pre selector for diplaying shapes
            const output = document.querySelector("pre");

            // the final output of shapes goes from this line by looping all rows
            output.textContent = pixelArray.map(row => 
                row.map((item, index) => (index === 0 || index === row.length -1) ? "|" : " -|"[item]).join``).join`\n`;
        },

        // this method is used for not allowing user to do input string and non-numeric values in height, width and padding
        onlyNumber ($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) || keyCode === 46) { // 46 is dot
               $event.preventDefault();
            }
        },

        // recursive method for making shapes row
        makeShape : function (width, height, padding) {
            if (width <= padding || height <= padding) {
                if (width <= 0 || height <= 0) return [];
                if (height < 2) return [Array(width).fill(1)];
                return [
                  Array(width).fill(1),
                  ...Array.from({length: height-2}, () => width < 2 ? [2] : [2, ...Array(width-2).fill(0), 2]),
                  Array(width).fill(1),
                ];
              }
              return [
                Array(width).fill(1),
                ...Array.from({length: padding>>1}, () => [2, ...Array(width-2).fill(0), 2]),
                ...this.makeShape(width - padding - 2, height - padding - 2, padding).map((row,i) =>
                  [2, ...Array(padding>>1).fill(0), ...row, ...Array(padding>>1).fill(0), 2]
                ),
                ...Array.from({length: padding>>1}, () => [2, ...Array(width-2).fill(0), 2]),
                Array(width).fill(1)
              ];
        }
    }
});
