import { extend } from './extend';
import { TimeSeries } from './TimeSeries';

export interface SmoothieOptions {

    // Bug?
    maxValue?: number;
    minValue?: number;

    timestampFormatter?: (dateTime: Date) => string;
    yRangeFunction?: (range: { min: number; max: number }) => { min: number; max: number }


    millisPerPixel: number;
    enableDpiScaling: boolean;
    yMinFormatter: (min: number, precision: number) => string;
    yMaxFormatter: (min: number, precision: number) => string;
    maxValueScale: number;
    minValueScale: number;
    interpolation: 'bezier' | 'line' | 'linear' | 'step';
    scaleSmoothing: number;
    maxDataSetLength: number;
    scrollBackwards: boolean;
    grid: {
        fillStyle: string;
        strokeStyle: string;
        lineWidth: number;
        sharpLines: boolean;
        millisPerLine: number;
        verticalSections: number;
        borderVisible: boolean;
    };
    labels: {
        fillStyle: string;
        disabled: boolean;
        fontSize: number;
        fontFamily: 'monospace';
        precision: number;
    };
    horizontalLines: any[];
}

const defaultChartOptions: SmoothieOptions = {
    millisPerPixel: 20,
    enableDpiScaling: true,
    yMinFormatter: function (min: number, precision: number) {
        return parseFloat(`${min}`).toFixed(precision);
    },
    yMaxFormatter: function (max: number, precision) {
        return parseFloat(`${max}`).toFixed(precision);
    },
    maxValueScale: 1,
    minValueScale: 1,
    interpolation: 'bezier',
    scaleSmoothing: 0.125,
    maxDataSetLength: 2,
    scrollBackwards: false,
    grid: {
        fillStyle: '#000000',
        strokeStyle: '#777777',
        lineWidth: 1,
        sharpLines: false,
        millisPerLine: 1000,
        verticalSections: 2,
        borderVisible: true
    },
    labels: {
        fillStyle: '#ffffff',
        disabled: false,
        fontSize: 10,
        fontFamily: 'monospace',
        precision: 2
    },
    horizontalLines: []
};

interface SeriesPresentationOptions {
    fillStyle?: string;
    lineWidth: number;
    strokeStyle: string;
}

interface Series {
    timeSeries: TimeSeries;
    options: SeriesPresentationOptions;
}

const defaultSeriesPresentationOptions: SeriesPresentationOptions = {
    lineWidth: 1,
    strokeStyle: '#ffffff'
};

// Based on http://inspirit.github.com/jsfeat/js/compatibility.js
const AnimateCompatibility = (function () {
    var requestAnimationFrame = function (callback: () => void, element?: any): number {
        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window['mozRequestAnimationFrame'] ||
            window['oRequestAnimationFrame'] ||
            window['msRequestAnimationFrame'] ||
            function (callback) {
                return window.setTimeout(function () {
                    callback(new Date().getTime());
                }, 16);
            };
        return requestAnimationFrame.call(window, callback, element);
    },
        cancelAnimationFrame = function (id: number) {
            var cancelAnimationFrame =
                window.cancelAnimationFrame ||
                function (id: number) {
                    window.clearTimeout(id);
                };
            return cancelAnimationFrame.call(window, id);
        };

    return {
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame
    };
})();


export class SmoothieChart {
    canvas: HTMLCanvasElement;
    delay: number;
    options: SmoothieOptions;
    seriesSet: Series[];
    currentValueRange: number;
    currentVisMinValue: number;
    lastRenderTimeMillis: number;
    originalWidth: number;
    originalHeight: number;
    frame: number;
    valueRange: { min: number; max: number };
    isAnimatingScale: boolean;

    /**
     * Initialises a new <code>SmoothieChart</code>.
     *
     * Options are optional, and should be of the form below. Just specify the values you
     * need and the rest will be given sensible defaults as shown:
     *
     * <pre>
     * {
     *   minValue: undefined,                      // specify to clamp the lower y-axis to a given value
     *   maxValue: undefined,                      // specify to clamp the upper y-axis to a given value
     *   maxValueScale: 1,                         // allows proportional padding to be added above the chart. for 10% padding, specify 1.1.
     *   minValueScale: 1,                         // allows proportional padding to be added below the chart. for 10% padding, specify 1.1.
     *   yRangeFunction: undefined,                // function({min: , max: }) { return {min: , max: }; }
     *   scaleSmoothing: 0.125,                    // controls the rate at which y-value zoom animation occurs
     *   millisPerPixel: 20,                       // sets the speed at which the chart pans by
     *   enableDpiScaling: true,                   // support rendering at different DPI depending on the device
     *   yMinFormatter: function(min, precision) { // callback function that formats the min y value label
     *     return parseFloat(min).toFixed(precision);
     *   },
     *   yMaxFormatter: function(max, precision) { // callback function that formats the max y value label
     *     return parseFloat(max).toFixed(precision);
     *   },
     *   maxDataSetLength: 2,
     *   interpolation: 'bezier'                   // one of 'bezier', 'linear', or 'step'
     *   timestampFormatter: null,                 // optional function to format time stamps for bottom of chart
     *                                             // you may use SmoothieChart.timeFormatter, or your own: function(date) { return ''; }
     *   scrollBackwards: false,                   // reverse the scroll direction of the chart
     *   horizontalLines: [],                      // [ { value: 0, color: '#ffffff', lineWidth: 1 } ]
     *   grid:
     *   {
     *     fillStyle: '#000000',                   // the background colour of the chart
     *     lineWidth: 1,                           // the pixel width of grid lines
     *     strokeStyle: '#777777',                 // colour of grid lines
     *     millisPerLine: 1000,                    // distance between vertical grid lines
     *     sharpLines: false,                      // controls whether grid lines are 1px sharp, or softened
     *     verticalSections: 2,                    // number of vertical sections marked out by horizontal grid lines
     *     borderVisible: true                     // whether the grid lines trace the border of the chart or not
     *   },
     *   labels
     *   {
     *     disabled: false,                        // enables/disables labels showing the min/max values
     *     fillStyle: '#ffffff',                   // colour for text of labels,
     *     fontSize: 15,
     *     fontFamily: 'sans-serif',
     *     precision: 2
     *   }
     * }
     * </pre>
     *
     * @constructor
     */
    constructor(options: { maxValue: number; minValue: number }) {
        this.options = extend({}, defaultChartOptions, options);
        this.seriesSet = [];
        this.currentValueRange = 1;
        this.currentVisMinValue = 0;
        this.lastRenderTimeMillis = 0;
    }

    /**
     * Adds a <code>TimeSeries</code> to this chart, with optional presentation options.
     *
     * Presentation options should be of the form (defaults shown):
     *
     * <pre>
     * {
     *   lineWidth: 1,
     *   strokeStyle: '#ffffff',
     *   fillStyle: undefined
     * }
     * </pre>
     */
    addTimeSeries(timeSeries: TimeSeries, options?: SeriesPresentationOptions) {
        this.seriesSet.push({ timeSeries: timeSeries, options: extend({}, defaultSeriesPresentationOptions, options) });
        if (timeSeries.options.resetBounds && timeSeries.options.resetBoundsInterval > 0) {
            timeSeries.resetBoundsTimerId = window.setInterval(
                function () {
                    timeSeries.resetBounds();
                },
                timeSeries.options.resetBoundsInterval
            );
        }
    }

    /**
     * Removes the specified <code>TimeSeries</code> from the chart.
     */
    removeTimeSeries(timeSeries: TimeSeries) {
        // Find the correct timeseries to remove, and remove it
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                this.seriesSet.splice(i, 1);
                break;
            }
        }
        // If a timer was operating for that timeseries, remove it
        if (timeSeries.resetBoundsTimerId) {
            // Stop resetting the bounds, if we were
            clearInterval(timeSeries.resetBoundsTimerId);
        }
    }

    /**
     * Gets render options for the specified <code>TimeSeries</code>.
     *
     * As you may use a single <code>TimeSeries</code> in multiple charts with different formatting in each usage,
     * these settings are stored in the chart.
     */
    getTimeSeriesOptions(timeSeries: TimeSeries): SeriesPresentationOptions {
        // Find the correct timeseries to remove, and remove it
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                return this.seriesSet[i].options;
            }
        }
    }

    /**
     * Brings the specified <code>TimeSeries</code> to the top of the chart. It will be rendered last.
     */
    bringToFront(timeSeries: TimeSeries) {
        // Find the correct timeseries to remove, and remove it
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                var set = this.seriesSet.splice(i, 1);
                this.seriesSet.push(set[0]);
                break;
            }
        }
    }

    /**
     * Instructs the <code>SmoothieChart</code> to start rendering to the provided canvas, with specified delay.
     *
     * @param canvas the target canvas element
     * @param delayMillis an amount of time to wait before a data point is shown. This can prevent the end of the series
     * from appearing on screen, with new values flashing into view, at the expense of some latency.
     */
    streamTo(canvas: HTMLCanvasElement, delayMillis: number) {
        this.canvas = canvas;
        this.delay = delayMillis;
        this.start();
    }

    /**
     * Make sure the canvas has the optimal resolution for the device's pixel ratio.
     */
    resize() {
        // TODO this function doesn't handle the value of enableDpiScaling changing during execution
        if (!this.options.enableDpiScaling || !window || window.devicePixelRatio === 1)
            return;

        var dpr = window.devicePixelRatio;
        var width = parseInt(this.canvas.getAttribute('width'));
        var height = parseInt(this.canvas.getAttribute('height'));

        if (!this.originalWidth || (Math.floor(this.originalWidth * dpr) !== width)) {
            this.originalWidth = width;
            this.canvas.setAttribute('width', (Math.floor(width * dpr)).toString());
            this.canvas.style.width = width + 'px';
            this.canvas.getContext('2d').scale(dpr, dpr);
        }

        if (!this.originalHeight || (Math.floor(this.originalHeight * dpr) !== height)) {
            this.originalHeight = height;
            this.canvas.setAttribute('height', (Math.floor(height * dpr)).toString());
            this.canvas.style.height = height + 'px';
            this.canvas.getContext('2d').scale(dpr, dpr);
        }
    }

    /**
     * Starts the animation of this chart.
     */
    start() {
        if (this.frame) {
            // We're already running, so just return
            return;
        }

        // Renders a frame, and queues the next frame for later rendering
        var animate = function () {
            this.frame = AnimateCompatibility.requestAnimationFrame(function () {
                this.render();
                animate();
            }.bind(this));
        }.bind(this);

        animate();
    };

    /**
     * Stops the animation of this chart.
     */
    stop() {
        if (this.frame) {
            AnimateCompatibility.cancelAnimationFrame(this.frame);
            delete this.frame;
        }
    }

    updateValueRange() {
        // Calculate the current scale of the chart, from all time series.
        var chartOptions = this.options,
            chartMaxValue = Number.NaN,
            chartMinValue = Number.NaN;

        for (var d = 0; d < this.seriesSet.length; d++) {
            // TODO(ndunn): We could calculate / track these values as they stream in.
            var timeSeries = this.seriesSet[d].timeSeries;
            if (!isNaN(timeSeries.maxValue)) {
                chartMaxValue = !isNaN(chartMaxValue) ? Math.max(chartMaxValue, timeSeries.maxValue) : timeSeries.maxValue;
            }

            if (!isNaN(timeSeries.minValue)) {
                chartMinValue = !isNaN(chartMinValue) ? Math.min(chartMinValue, timeSeries.minValue) : timeSeries.minValue;
            }
        }

        // Scale the chartMaxValue to add padding at the top if required
        if (chartOptions.maxValue != null) {
            chartMaxValue = chartOptions.maxValue;
        } else {
            chartMaxValue *= chartOptions.maxValueScale;
        }

        // Set the minimum if we've specified one
        if (chartOptions.minValue != null) {
            chartMinValue = chartOptions.minValue;
        } else {
            chartMinValue -= Math.abs(chartMinValue * chartOptions.minValueScale - chartMinValue);
        }

        // If a custom range function is set, call it
        if (this.options.yRangeFunction) {
            var range = this.options.yRangeFunction({ min: chartMinValue, max: chartMaxValue });
            chartMinValue = range.min;
            chartMaxValue = range.max;
        }

        if (!isNaN(chartMaxValue) && !isNaN(chartMinValue)) {
            var targetValueRange = chartMaxValue - chartMinValue;
            var valueRangeDiff = (targetValueRange - this.currentValueRange);
            var minValueDiff = (chartMinValue - this.currentVisMinValue);
            this.isAnimatingScale = Math.abs(valueRangeDiff) > 0.1 || Math.abs(minValueDiff) > 0.1;
            this.currentValueRange += chartOptions.scaleSmoothing * valueRangeDiff;
            this.currentVisMinValue += chartOptions.scaleSmoothing * minValueDiff;
        }

        this.valueRange = { min: chartMinValue, max: chartMaxValue };
    }

    render(canvas: HTMLCanvasElement, time: number): void {
        var nowMillis = new Date().getTime();

        if (!this.isAnimatingScale) {
            // We're not animating. We can use the last render time and the scroll speed to work out whether
            // we actually need to paint anything yet. If not, we can return immediately.

            // Render at least every 1/6th of a second. The canvas may be resized, which there is
            // no reliable way to detect.
            var maxIdleMillis = Math.min(1000 / 6, this.options.millisPerPixel);

            if (nowMillis - this.lastRenderTimeMillis < maxIdleMillis) {
                return;
            }
        }

        this.resize();

        this.lastRenderTimeMillis = nowMillis;

        canvas = canvas || this.canvas;
        time = time || nowMillis - (this.delay || 0);

        // Round time down to pixel granularity, so motion appears smoother.
        time -= time % this.options.millisPerPixel;

        var context = canvas.getContext('2d'),
            chartOptions = this.options,
            dimensions = { top: 0, left: 0, width: canvas.clientWidth, height: canvas.clientHeight },
            // Calculate the threshold time for the oldest data points.
            oldestValidTime = time - (dimensions.width * chartOptions.millisPerPixel),
            valueToYPixel = function (value) {
                var offset = value - this.currentVisMinValue;
                return this.currentValueRange === 0
                    ? dimensions.height
                    : dimensions.height - (Math.round((offset / this.currentValueRange) * dimensions.height));
            }.bind(this),
            timeToXPixel = function (t) {
                if (chartOptions.scrollBackwards) {
                    return Math.round((time - t) / chartOptions.millisPerPixel);
                }
                return Math.round(dimensions.width - ((time - t) / chartOptions.millisPerPixel));
            };

        this.updateValueRange();

        context.font = chartOptions.labels.fontSize + 'px ' + chartOptions.labels.fontFamily;

        // Save the state of the canvas context, any transformations applied in this method
        // will get removed from the stack at the end of this method when .restore() is called.
        context.save();

        // Move the origin.
        context.translate(dimensions.left, dimensions.top);

        // Create a clipped rectangle - anything we draw will be constrained to this rectangle.
        // This prevents the occasional pixels from curves near the edges overrunning and creating
        // screen cheese (that phrase should need no explanation).
        context.beginPath();
        context.rect(0, 0, dimensions.width, dimensions.height);
        context.clip();

        // Clear the working area.
        context.save();
        context.fillStyle = chartOptions.grid.fillStyle;
        context.clearRect(0, 0, dimensions.width, dimensions.height);
        context.fillRect(0, 0, dimensions.width, dimensions.height);
        context.restore();

        // Grid lines...
        context.save();
        context.lineWidth = chartOptions.grid.lineWidth;
        context.strokeStyle = chartOptions.grid.strokeStyle;
        // Vertical (time) dividers.
        if (chartOptions.grid.millisPerLine > 0) {
            context.beginPath();
            for (var t = time - (time % chartOptions.grid.millisPerLine);
                t >= oldestValidTime;
                t -= chartOptions.grid.millisPerLine) {
                var gx = timeToXPixel(t);
                if (chartOptions.grid.sharpLines) {
                    gx -= 0.5;
                }
                context.moveTo(gx, 0);
                context.lineTo(gx, dimensions.height);
            }
            context.stroke();
            context.closePath();
        }

        // Horizontal (value) dividers.
        for (var v = 1; v < chartOptions.grid.verticalSections; v++) {
            var gy = Math.round(v * dimensions.height / chartOptions.grid.verticalSections);
            if (chartOptions.grid.sharpLines) {
                gy -= 0.5;
            }
            context.beginPath();
            context.moveTo(0, gy);
            context.lineTo(dimensions.width, gy);
            context.stroke();
            context.closePath();
        }
        // Bounding rectangle.
        if (chartOptions.grid.borderVisible) {
            context.beginPath();
            context.strokeRect(0, 0, dimensions.width, dimensions.height);
            context.closePath();
        }
        context.restore();

        // Draw any horizontal lines...
        if (chartOptions.horizontalLines && chartOptions.horizontalLines.length) {
            for (var hl = 0; hl < chartOptions.horizontalLines.length; hl++) {
                var line = chartOptions.horizontalLines[hl],
                    hly = Math.round(valueToYPixel(line.value)) - 0.5;
                context.strokeStyle = line.color || '#ffffff';
                context.lineWidth = line.lineWidth || 1;
                context.beginPath();
                context.moveTo(0, hly);
                context.lineTo(dimensions.width, hly);
                context.stroke();
                context.closePath();
            }
        }

        // For each data set...
        for (var d = 0; d < this.seriesSet.length; d++) {
            context.save();
            var timeSeries = this.seriesSet[d].timeSeries,
                dataSet = timeSeries.data,
                seriesOptions = this.seriesSet[d].options;

            // Delete old data that's moved off the left of the chart.
            timeSeries.dropOldData(oldestValidTime, chartOptions.maxDataSetLength);

            // Set style for this dataSet.
            context.lineWidth = seriesOptions.lineWidth;
            context.strokeStyle = seriesOptions.strokeStyle;
            // Draw the line...
            context.beginPath();
            // Retain lastX, lastY for calculating the control points of bezier curves.
            var firstX = 0, lastX = 0, lastY = 0;
            for (var i = 0; i < dataSet.length && dataSet.length !== 1; i++) {
                var x = timeToXPixel(dataSet[i][0]),
                    y = valueToYPixel(dataSet[i][1]);

                if (i === 0) {
                    firstX = x;
                    context.moveTo(x, y);
                } else {
                    switch (chartOptions.interpolation) {
                        case "linear":
                        case "line": {
                            context.lineTo(x, y);
                            break;
                        }
                        case "bezier":
                        default: {
                            // Great explanation of Bezier curves: http://en.wikipedia.org/wiki/Bezier_curve#Quadratic_curves
                            //
                            // Assuming A was the last point in the line plotted and B is the new point,
                            // we draw a curve with control points P and Q as below.
                            //
                            // A---P
                            //     |
                            //     |
                            //     |
                            //     Q---B
                            //
                            // Importantly, A and P are at the same y coordinate, as are B and Q. This is
                            // so adjacent curves appear to flow as one.
                            //
                            context.bezierCurveTo( // startPoint (A) is implicit from last iteration of loop
                                Math.round((lastX + x) / 2), lastY, // controlPoint1 (P)
                                Math.round((lastX + x)) / 2, y, // controlPoint2 (Q)
                                x, y); // endPoint (B)
                            break;
                        }
                        case "step": {
                            context.lineTo(x, lastY);
                            context.lineTo(x, y);
                            break;
                        }
                    }
                }

                lastX = x; lastY = y;
            }

            if (dataSet.length > 1) {
                if (seriesOptions.fillStyle) {
                    // Close up the fill region.
                    context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, lastY);
                    context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, dimensions.height + seriesOptions.lineWidth + 1);
                    context.lineTo(firstX, dimensions.height + seriesOptions.lineWidth);
                    context.fillStyle = seriesOptions.fillStyle;
                    context.fill();
                }

                if (seriesOptions.strokeStyle && seriesOptions.strokeStyle !== 'none') {
                    context.stroke();
                }
                context.closePath();
            }
            context.restore();
        }

        // Draw the axis values on the chart.
        if (!chartOptions.labels.disabled && !isNaN(this.valueRange.min) && !isNaN(this.valueRange.max)) {
            var maxValueString = chartOptions.yMaxFormatter(this.valueRange.max, chartOptions.labels.precision),
                minValueString = chartOptions.yMinFormatter(this.valueRange.min, chartOptions.labels.precision),
                labelPos = chartOptions.scrollBackwards ? 0 : dimensions.width - context.measureText(maxValueString).width - 2;
            context.fillStyle = chartOptions.labels.fillStyle;
            context.fillText(maxValueString, labelPos, chartOptions.labels.fontSize);
            context.fillText(minValueString, labelPos, dimensions.height - 2);
        }

        // Display timestamps along x-axis at the bottom of the chart.
        if (chartOptions.timestampFormatter && chartOptions.grid.millisPerLine > 0) {
            var textUntilX = chartOptions.scrollBackwards
                ? context.measureText(minValueString).width
                : dimensions.width - context.measureText(minValueString).width + 4;
            for (var t = time - (time % chartOptions.grid.millisPerLine);
                t >= oldestValidTime;
                t -= chartOptions.grid.millisPerLine) {
                var gx = timeToXPixel(t);
                // Only draw the timestamp if it won't overlap with the previously drawn one.
                if ((!chartOptions.scrollBackwards && gx < textUntilX) || (chartOptions.scrollBackwards && gx > textUntilX)) {
                    // Formats the timestamp based on user specified formatting function
                    // SmoothieChart.timeFormatter function above is one such formatting option
                    var tx = new Date(t),
                        ts = chartOptions.timestampFormatter(tx),
                        tsWidth = context.measureText(ts).width;

                    textUntilX = chartOptions.scrollBackwards
                        ? gx + tsWidth + 2
                        : gx - tsWidth - 2;

                    context.fillStyle = chartOptions.labels.fillStyle;
                    if (chartOptions.scrollBackwards) {
                        context.fillText(ts, gx, dimensions.height - 2);
                    } else {
                        context.fillText(ts, gx - tsWidth, dimensions.height - 2);
                    }
                }
            }
        }

        context.restore(); // See .save() above.
    }

    // Sample timestamp formatting function
    /*
    timeFormatter = function(date) {
      function pad2(number) { return (number < 10 ? '0' : '') + number }
      return pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
    }
    */
}
