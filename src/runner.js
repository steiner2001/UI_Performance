// SETUP

if (!window.performance || !window.performance.now) {
    throw new Error('These tests use performance.now() which is not supported by your browser.');
}



// RUNNER


function runBenchmarks(impls, suite, callback) {
    var frame = document.getElementById('benchmark-frame');
    var results = document.getElementById('benchmark-results');

    frame.style.display = 'block';
    results.style.visibility = 'hidden';
    while (results.lastChild) {
        results.removeChild(results.lastChild);
    }

    runImplementations(impls, suite, 0, function() {
        var canvas = document.createElement('canvas');
        results.appendChild(canvas);
        updateChart(canvas, impls);
        frame.style.display = 'none';
        results.style.visibility = 'visible';
        callback();
    });
}



// RUN IMPLEMENTATIONS


function runImplementations(impls, suite, index, done) {
    var impl = impls[index];
    var frame = document.getElementById('benchmark-frame');
    frame.onload = function() {
        withFacts(0, frame.contentDocument, suite.getFacts, function(facts) {
            runSteps(facts, suite.steps, index, 0, [], function(results) {
                impl.results = results;
                impl.time = getTotalTime(results);
                console.log(
                    impl.name + ' ' + impl.version +
                    (impl.optimized ? '' : '') +
                    ' = ' + trunc(impl.time) + ' ms'
                );

                ++index;

                return (index < impls.length) ?
                    runImplementations(impls, suite, index, done) :
                    done();
            });
        });
    }

    frame.src = impl.url;
}


function getTotalTime(results) {
    var total = 0;
    for (var i = 0; i < results.length; i++) {
        total += results[i].sync;
        total += results[i].async;
    }
    return total;
}


function withFacts(tries, doc, getFacts, callback) {
    if (tries > 5) {
        throw new Error('Could not get facts for this implementation.');
    }

    setTimeout(function() {
        var facts = getFacts(doc);
        typeof facts === 'undefined' ?
            withFacts(tries + 1, doc, getFacts, callback) :
            callback(facts);
    }, 16 * Math.pow(2, tries));
}



/* RUN STEPS ***/


function runSteps(facts, steps, implIndex, index, results, done) {
    timedStep(steps[index].work, facts, function(syncTime, asyncTime) {
        results.push({
            name: steps[index].name,
            sync: syncTime,
            async: asyncTime
        });

        ++index;

        if (index < steps.length) {
            return runSteps(facts, steps, implIndex, index, results, done)
        }

        return done(results);
    });
}


function trunc(time) {
    return Math.round(time);
}


function timedStep(work, facts, callback) {
    // time all synchronous work
    var start = performance.now();
    work(facts);
    var end = performance.now();
    var syncTime = end - start;

    // time ONE round of asynchronous work
    var asyncStart = performance.now();
    setTimeout(function() {
        var asyncEnd = performance.now();
        callback(syncTime, asyncEnd - asyncStart);
    }, 0);

    // if anyone does more than one round, we do not capture it!
}



/* SETUP WORK LIST *********/


function setupWorklist(suite) {
    var impls = suite.impls;
    var steps = suite.steps;

    var workList = document.getElementById('work-list');

    while (workList.lastChild) {
        workList.removeChild(workList.lastChild);
    }

    for (var i = 0; i < impls.length; i++) {
        var impl = document.createElement('li');
        var title = document.createTextNode(impls[i].name);
        impl.appendChild(title);
        workList.appendChild(impl);
    }

    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(workList);
}



/* DRAW CHARTS *************/


function updateChart(canvas, impls) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: impls.map(toLabel),
            datasets: [{
                label: 'ms',
                data: impls.map(function(impl) { return trunc(impl.time); }),
                backgroundColor: impls.map(toColor),
                borderColor: impls.map(toColorBorder),
                borderWidth: 5
            }]
        },
        options: {
            title: {
                display: true
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    },
                    barPercentage: 0.6,
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90,
                        fontSize: 10,
                        fontColor: "Black",
                        defaultFontFamily: "Arial, Helvetica, sans-serif"

                    }
                }],
                yAxes: [{

                    ticks: {

                        beginAtZero: true,
                        fontSize: 12,
                        fontColor: "Black",
                        defaultFontFamily: "Arial, Helvetica, sans-serif",



                    }

                }]
            }
        },
        plugins: {
            afterDatasetsDraw: function(context, easing) {
                var ctx = context.chart.ctx;
                context.data.datasets.forEach(function(dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        if (dataset.data[i] != 0) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                            var textY = model.y + (dataset.type == "line" ? -3 : 15);

                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                            ctx.textAlign = 'start';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = dataset.type == "line" ? "black" : "black";
                            ctx.save();
                            ctx.translate(model.x, textY - 15);
                            ctx.rotate(4.7);
                            ctx.fillText(dataset.data[i], 0, 0);
                            ctx.restore();
                        }
                    }
                });
            }

        }

    });
}

function toLabel(impl) {
    return impl.name + ' ' + impl.version;
}

function toColor(impl) {
    return impl.optimized ?
        'rgba(75, 192, 192, 0.2)' :
        'rgba(54, 162, 235, 0.2)';
}

function toColorBorder(impl) {
    return impl.optimized ?
        'rgba(75, 192, 192, 1)' :
        'rgba(54, 162, 235, 1)';
}