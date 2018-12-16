// MIT License:
//
// Copyright (c) 2010-2013, Joe Walnes
//               2013-2014, Drew Noakes
//               2018-2019, David Holmes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import { extend } from './extend';

export interface TimeSeriesOptions {
    resetBounds: boolean;
    resetBoundsInterval: number;
}

const defaultOptions = {
    resetBoundsInterval: 3000,
    resetBounds: true
};

export class TimeSeries {
    options: TimeSeriesOptions;
    data: number[][];
    maxValue: number;
    minValue: number;
    resetBoundsTimerId: number;
    /**
  * Initialises a new <code>TimeSeries</code> with optional data options.
  *
  * Options are of the form (defaults shown):
  *
  * <pre>
  * {
  *   resetBounds: true,        // enables/disables automatic scaling of the y-axis
  *   resetBoundsInterval: 3000 // the period between scaling calculations, in millis
  * }
  * </pre>
  *
  * Presentation options for TimeSeries are specified as an argument to <code>SmoothieChart.addTimeSeries</code>.
  *
  * @constructor
  */
    constructor(options?: TimeSeriesOptions) {
        this.options = extend({}, defaultOptions, options);
        this.clear();
    }

    /**
     * Clears all data and state from this TimeSeries object.
     */
    clear() {
        this.data = [];
        this.maxValue = Number.NaN; // The maximum value ever seen in this TimeSeries.
        this.minValue = Number.NaN; // The minimum value ever seen in this TimeSeries.
    }

    /**
     * Recalculate the min/max values for this <code>TimeSeries</code> object.
     *
     * This causes the graph to scale itself in the y-axis.
     */
    resetBounds(): void {
        if (this.data.length) {
            // Walk through all data points, finding the min/max value
            this.maxValue = this.data[0][1];
            this.minValue = this.data[0][1];
            for (let i = 1; i < this.data.length; i++) {
                const value = this.data[i][1];
                if (value > this.maxValue) {
                    this.maxValue = value;
                }
                if (value < this.minValue) {
                    this.minValue = value;
                }
            }
        } else {
            // No data exists, so set min/max to NaN
            this.maxValue = Number.NaN;
            this.minValue = Number.NaN;
        }
    }

    /**
     * Adds a new data point to the <code>TimeSeries</code>, preserving chronological order.
     *
     * @param timestamp the position, in time, of this data point
     * @param value the value of this data point
     * @param sumRepeatedTimeStampValues if <code>timestamp</code> has an exact match in the series, this flag controls
     * whether it is replaced, or the values summed (defaults to false.)
     */
    append(timestamp: number, value: number, sumRepeatedTimeStampValues?: boolean): void {
        // Rewind until we hit an older timestamp
        let i = this.data.length - 1;
        while (i >= 0 && this.data[i][0] > timestamp) {
            i--;
        }

        if (i === -1) {
            // This new item is the oldest data
            this.data.splice(0, 0, [timestamp, value]);
        } else if (this.data.length > 0 && this.data[i][0] === timestamp) {
            // Update existing values in the array
            if (sumRepeatedTimeStampValues) {
                // Sum this value into the existing 'bucket'
                this.data[i][1] += value;
                value = this.data[i][1];
            } else {
                // Replace the previous value
                this.data[i][1] = value;
            }
        } else if (i < this.data.length - 1) {
            // Splice into the correct position to keep timestamps in order
            this.data.splice(i + 1, 0, [timestamp, value]);
        } else {
            // Add to the end of the array
            this.data.push([timestamp, value]);
        }

        this.maxValue = isNaN(this.maxValue) ? value : Math.max(this.maxValue, value);
        this.minValue = isNaN(this.minValue) ? value : Math.min(this.minValue, value);
    }

    dropOldData(oldestValidTime: number, maxDataSetLength: number): void {
        // We must always keep one expired data point as we need this to draw the
        // line that comes into the chart from the left, but any points prior to that can be removed.
        var removeCount = 0;
        while (this.data.length - removeCount >= maxDataSetLength && this.data[removeCount + 1][0] < oldestValidTime) {
            removeCount++;
        }
        if (removeCount !== 0) {
            this.data.splice(0, removeCount);
        }
    }
}